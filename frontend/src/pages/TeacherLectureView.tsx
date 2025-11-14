import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Check, X, ThumbsUp, Frown, ThumbsDown, Loader2, Wand2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { api, Lecture, Reaction, Suggestion } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const TeacherLectureView = () => {
  const { lectureId } = useParams();
  const { toast } = useToast();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // Hardcoded teacher ID for now - in production this would come from auth
  const teacherId = "teacher-1";

  useEffect(() => {
    const fetchLectureData = async () => {
      if (!lectureId) return;

      try {
        setLoading(true);
        const [lectureData, commentsData] = await Promise.all([
          api.getLecture(lectureId),
          api.getLectureCommentsForTeacher(teacherId, lectureId),
        ]);
        setLecture(lectureData);
        setReactions(commentsData.reactions);
        setSuggestions(commentsData.suggestions);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load lecture. Please try again.",
          variant: "destructive",
        });
        console.error("Error fetching lecture:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectureData();
  }, [lectureId, toast, teacherId]);

  const handleGenerateSuggestions = async () => {
    if (!lectureId) return;

    try {
      setGeneratingSuggestions(true);
      const result = await api.generateSuggestions(lectureId);
      setSuggestions([...result.createdSuggestions, ...suggestions]);
      toast({
        title: "Success",
        description: `Generated ${result.createdSuggestions.length} AI suggestion(s)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating suggestions:", error);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const handleApprove = async (suggestionId: string) => {
    try {
      setProcessingAction(suggestionId);
      const result = await api.approveSuggestion(suggestionId);
      
      // Update suggestions list
      setSuggestions(suggestions.map(s => 
        s.id === suggestionId ? result.suggestion : s
      ));

      // Mark reactions as addressed
      const approvedSuggestion = suggestions.find(s => s.id === suggestionId);
      if (approvedSuggestion) {
        setReactions(reactions.map(r => 
          r.sectionId === approvedSuggestion.sectionId ? { ...r, addressed: true } : r
        ));
      }

      toast({
        title: "Suggestion Approved",
        description: "New lecture version created with the updated content.",
      });

      // Optionally redirect to the new version
      // navigate(`/teacher/lecture/${result.newLecture.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve suggestion. Please try again.",
        variant: "destructive",
      });
      console.error("Error approving suggestion:", error);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (suggestionId: string) => {
    try {
      setProcessingAction(suggestionId);
      const result = await api.rejectSuggestion(suggestionId);
      
      // Update suggestions list
      setSuggestions(suggestions.map(s => 
        s.id === suggestionId ? result.suggestion : s
      ));

      // Mark reactions as addressed
      const rejectedSuggestion = suggestions.find(s => s.id === suggestionId);
      if (rejectedSuggestion) {
        setReactions(reactions.map(r => 
          r.sectionId === rejectedSuggestion.sectionId ? { ...r, addressed: true } : r
        ));
      }

      toast({
        title: "Suggestion Rejected",
        description: "Student feedback has been marked as addressed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject suggestion. Please try again.",
        variant: "destructive",
      });
      console.error("Error rejecting suggestion:", error);
    } finally {
      setProcessingAction(null);
    }
  };

  const getSuggestionForSection = (sectionId: string) => {
    return suggestions.find(s => s.sectionId === sectionId && s.status === "pending");
  };

  const getReactionsForSection = (sectionId: string) => {
    return reactions.filter(r => r.sectionId === sectionId);
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case "typo": return <ThumbsUp className="h-3 w-3 text-green-500" />;
      case "confused": return <Frown className="h-3 w-3 text-yellow-500" />;
      case "calculation_error": return <ThumbsDown className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  const getReactionLabel = (type: string) => {
    switch (type) {
      case "typo": return "Typo";
      case "confused": return "Confused";
      case "calculation_error": return "Calculation Error";
      default: return type;
    }
  };

  const pendingSuggestionsCount = suggestions.filter(s => s.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Lecture not found.</p>
            <Link to="/teacher" className="block mt-4">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/teacher">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">{lecture.title}</h1>
              <Badge variant="outline" className="text-xs">v{lecture.version}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingSuggestionsCount > 0 && (
              <Badge variant="secondary">
                {pendingSuggestionsCount} Pending Suggestion{pendingSuggestionsCount !== 1 ? 's' : ''}
              </Badge>
            )}
            <Button
              onClick={handleGenerateSuggestions}
              disabled={generatingSuggestions}
              className="gap-2"
              size="sm"
            >
              {generatingSuggestions ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate AI Suggestions
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{lecture.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {lecture.sections.map((section) => {
                  const suggestion = getSuggestionForSection(section.id);
                  const sectionReactions = getReactionsForSection(section.id);

                  return (
                    <div key={section.id} className="space-y-3">
                      {suggestion ? (
                        <div className="p-4 rounded-lg border-2 border-green-500/30 bg-green-500/5">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">
                              AI Suggestion
                            </Badge>
                            {sectionReactions.length > 0 && (
                              <Badge variant="outline">
                                {sectionReactions.length} comment{sectionReactions.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Original text */}
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">ORIGINAL:</p>
                            <p className="text-sm text-muted-foreground line-through">
                              {section.text}
                            </p>
                          </div>

                          <Separator className="my-3" />

                          {/* Suggested text */}
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-1">AI SUGGESTED:</p>
                            <p className="text-foreground leading-relaxed bg-green-500/10 p-3 rounded border border-green-500/20">
                              {suggestion.suggestedText}
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApprove(suggestion.id)}
                              className="gap-2 bg-green-600 hover:bg-green-700"
                              size="sm"
                              disabled={processingAction === suggestion.id}
                            >
                              {processingAction === suggestion.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(suggestion.id)}
                              variant="outline"
                              className="gap-2"
                              size="sm"
                              disabled={processingAction === suggestion.id}
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg border border-border">
                          <p className="text-foreground leading-relaxed">{section.text}</p>
                          {sectionReactions.length > 0 && (
                            <Badge variant="outline" className="mt-2">
                              {sectionReactions.length} comment{sectionReactions.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Feedback sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Student Feedback ({reactions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {reactions.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      No student feedback yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {reactions.map((reaction) => (
                        <div 
                          key={reaction.id} 
                          className={`p-3 rounded-lg border ${
                            reaction.addressed 
                              ? "bg-muted/30 border-muted" 
                              : "bg-muted/50 border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getReactionIcon(reaction.type)}
                            <Badge variant="outline" className="text-xs">
                              {getReactionLabel(reaction.type)}
                            </Badge>
                            {reaction.addressed && (
                              <Badge variant="secondary" className="text-xs">
                                Addressed
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs mb-2">
                            Section {reaction.sectionId}
                          </Badge>
                          {reaction.comment && (
                            <p className="text-sm text-foreground mb-2">{reaction.comment}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(reaction.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLectureView;
