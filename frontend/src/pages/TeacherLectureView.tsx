import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Check, X, ThumbsUp, Frown, ThumbsDown, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { auth, teacherApi, lectureApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  id: string;
  lectureId: string;
  sectionId: string;
  suggestedText: string;
  status: "pending" | "accepted" | "rejected";
  createdAt?: string;
}

interface Reaction {
  id: string;
  lectureId: string;
  sectionId: string;
  userId: string;
  type: "like" | "confused" | "dislike";
  comment: string;
  addressed: boolean;
  createdAt?: string;
}

interface Section {
  id: string;
  order: number;
  text: string;
}

interface Lecture {
  id: string;
  title: string;
  sections: Section[];
  teacherId: string;
}

const TeacherLectureView = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = auth.getUser();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user || user.role !== "teacher") {
      navigate("/auth?role=teacher");
    }
  }, [user, navigate]);

  // Fetch lecture details
  const { data: lecture, isLoading: lectureLoading } = useQuery({
    queryKey: ["lecture", lectureId],
    queryFn: async () => {
      if (!lectureId) return null;
      const response = await lectureApi.getLecture(lectureId);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
        return null;
      }
      return response.data as Lecture;
    },
    enabled: !!lectureId,
  });

  // Fetch comments (reactions and suggestions)
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["lecture-comments", lectureId, user?.id],
    queryFn: async () => {
      if (!lectureId || !user?.id) return null;
      const response = await teacherApi.getLectureComments(user.id, lectureId);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
        return null;
      }
      return response.data as { reactions: Reaction[]; suggestions: Suggestion[] };
    },
    enabled: !!lectureId && !!user?.id,
  });

  const reactions = commentsData?.reactions || [];
  const suggestions = commentsData?.suggestions || [];

  // Approve suggestion mutation
  const approveMutation = useMutation({
    mutationFn: async (suggestionId: string) => {
      const response = await teacherApi.approveSuggestion(suggestionId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as { suggestion: Suggestion; newLecture: Lecture };
    },
    onSuccess: (data) => {
      // Backend creates a new lecture version when approving
      // Navigate to the new lecture version
      const newLectureId = data.newLecture.id;
      queryClient.invalidateQueries({ queryKey: ["lecture-comments"] });
      queryClient.invalidateQueries({ queryKey: ["lecture"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-lectures"] });
      toast({
        title: "Success",
        description: "Suggestion approved and lecture updated!",
      });
      // Navigate to the new lecture version
      if (newLectureId !== lectureId) {
        navigate(`/teacher/lecture/${newLectureId}`);
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Reject suggestion mutation
  const rejectMutation = useMutation({
    mutationFn: async (suggestionId: string) => {
      const response = await teacherApi.rejectSuggestion(suggestionId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecture-comments", lectureId] });
      toast({
        title: "Success",
        description: "Suggestion rejected.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleApprove = (suggestionId: string) => {
    approveMutation.mutate(suggestionId);
  };

  const handleReject = (suggestionId: string) => {
    rejectMutation.mutate(suggestionId);
  };

  const getSuggestionForSection = (sectionId: string): Suggestion | undefined => {
    return suggestions.find(s => s.sectionId === sectionId && s.status === "pending");
  };

  const getReactionsForSection = (sectionId: string): Reaction[] => {
    return reactions.filter(r => r.sectionId === sectionId && !r.addressed);
  };

  const getSectionText = (sectionId: string): string => {
    const section = lecture?.sections.find(s => s.id === sectionId);
    return section?.text || "";
  };

  const getReactionIcon = (reaction: string) => {
    switch (reaction) {
      case "like": return <ThumbsUp className="h-3 w-3 text-green-500" />;
      case "confused": return <Frown className="h-3 w-3 text-yellow-500" />;
      case "dislike": return <ThumbsDown className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "Recently";
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  if (lectureLoading || commentsLoading) {
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
          <CardContent className="p-6">
            <p className="text-muted-foreground">Lecture not found</p>
            <Link to="/teacher">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingSuggestions = suggestions.filter(s => s.status === "pending").length;
  const allReactions = reactions.filter(r => !r.addressed);

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
            </div>
          </div>
          <Badge variant="secondary">
            {pendingSuggestions} Pending Suggestions
          </Badge>
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
                {lecture.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => {
                    const suggestion = getSuggestionForSection(section.id);
                    const sectionReactions = getReactionsForSection(section.id);
                    const originalText = getSectionText(section.id);

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
                                  {sectionReactions.length} comments
                                </Badge>
                              )}
                            </div>
                            
                            {/* Original text */}
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1">ORIGINAL:</p>
                              <p className="text-sm text-muted-foreground line-through">
                                {originalText}
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
                                disabled={approveMutation.isPending}
                              >
                                {approveMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Approving...
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4" />
                                    Approve
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => handleReject(suggestion.id)}
                                variant="outline"
                                className="gap-2"
                                size="sm"
                                disabled={rejectMutation.isPending}
                              >
                                {rejectMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Rejecting...
                                  </>
                                ) : (
                                  <>
                                    <X className="h-4 w-4" />
                                    Reject
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-lg border border-border">
                            <p className="text-foreground leading-relaxed">{section.text}</p>
                            {sectionReactions.length > 0 && (
                              <Badge variant="outline" className="mt-2">
                                {sectionReactions.length} comments
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

          {/* Comments sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Student Feedback ({allReactions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {allReactions.length > 0 ? (
                      allReactions.map((reaction) => (
                        <div key={reaction.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            {getReactionIcon(reaction.type)}
                            <span className="text-sm font-medium text-foreground">
                              Student {reaction.userId.split("-")[1] || reaction.userId}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs mb-2">
                            Section {reaction.sectionId.split("-")[1] || reaction.sectionId}
                          </Badge>
                          {reaction.comment && (
                            <p className="text-sm text-foreground mb-2">{reaction.comment}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(reaction.createdAt)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No feedback yet
                      </p>
                    )}
                  </div>
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
