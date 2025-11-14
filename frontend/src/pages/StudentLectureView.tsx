import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, ThumbsUp, Frown, ThumbsDown, Loader2, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api, Lecture, Reaction as ReactionType } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ReactionOption = "typo" | "confused" | "calculation_error" | null;

const StudentLectureView = () => {
  const { lectureId } = useParams();
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [currentReaction, setCurrentReaction] = useState<ReactionOption>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<ReactionType[]>([]);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Hardcoded user ID for now - in production this would come from auth
  const userId = "student-1";

  useEffect(() => {
    const fetchLectureData = async () => {
      if (!lectureId) return;

      try {
        setLoading(true);
        const [lectureData, userComments] = await Promise.all([
          api.getLecture(lectureId),
          api.getUserComments(userId, lectureId),
        ]);
        setLecture(lectureData);
        setComments(userComments);
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
  }, [lectureId, toast]);

  const handleReaction = (reaction: ReactionOption) => {
    setCurrentReaction(reaction);
  };

  const handleSubmitComment = async () => {
    if (!selectedSection || !currentReaction || !lectureId) {
      toast({
        title: "Missing Information",
        description: "Please select a reaction type.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const newReaction = await api.submitReaction({
        userId,
        lectureId,
        sectionId: selectedSection,
        type: currentReaction,
        comment: commentText.trim(),
      });

      setComments([newReaction, ...comments]);
      setCommentText("");
      setCurrentReaction(null);
      setSelectedSection(null);

      toast({
        title: "Success",
        description: "Your feedback has been submitted!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting reaction:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getReactionIcon = (reaction: string) => {
    switch (reaction) {
      case "typo": return <ThumbsUp className="h-3 w-3 text-green-500" />;
      case "confused": return <Frown className="h-3 w-3 text-yellow-500" />;
      case "calculation_error": return <ThumbsDown className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  const getReactionLabel = (reaction: string) => {
    switch (reaction) {
      case "typo": return "Typo";
      case "confused": return "Confused";
      case "calculation_error": return "Calculation Error";
      default: return "";
    }
  };

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
            <Link to="/student" className="block mt-4">
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
            <Link to="/student">
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
                {lecture.sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedSection === section.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-border"
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <p className="text-foreground leading-relaxed">{section.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Comment form */}
            {selectedSection && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Add Your Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={currentReaction === "typo" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReaction("typo")}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Typo
                    </Button>
                    <Button
                      variant={currentReaction === "confused" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReaction("confused")}
                      className="gap-2"
                    >
                      <Frown className="h-4 w-4" />
                      Confused
                    </Button>
                    <Button
                      variant={currentReaction === "calculation_error" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReaction("calculation_error")}
                      className="gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Calculation Error
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Add your comment (optional)"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleSubmitComment} 
                    className="w-full"
                    disabled={submitting || !currentReaction}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Comments sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Your Comments ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      No comments yet. Select a section to add feedback.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div 
                          key={comment.id} 
                          className={`p-3 rounded-lg border ${
                            comment.addressed 
                              ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900" 
                              : "bg-muted/50 border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {getReactionIcon(comment.type)}
                            <Badge variant="outline" className="text-xs">
                              {getReactionLabel(comment.type)}
                            </Badge>
                            {comment.addressed && (
                              <Badge variant="default" className="text-xs bg-green-600 gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Resolved
                              </Badge>
                            )}
                          </div>
                          {comment.comment && (
                            <p className="text-sm text-foreground mb-2">{comment.comment}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
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

export default StudentLectureView;
