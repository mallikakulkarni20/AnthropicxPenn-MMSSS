import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, ThumbsUp, Frown, ThumbsDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

type Reaction = "like" | "confused" | "dislike" | null;

interface Comment {
  id: string;
  sectionId: string;
  text: string;
  reaction: Reaction;
  timestamp: string;
}

const StudentLectureView = () => {
  const { lectureId } = useParams();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [currentReaction, setCurrentReaction] = useState<Reaction>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  // Mock lecture data
  const lectureSections = [
    { id: "1", text: "Introduction to quantum mechanics begins with the wave-particle duality principle, which states that all matter exhibits both wave and particle properties." },
    { id: "2", text: "The Heisenberg Uncertainty Principle is a fundamental concept that limits the precision with which certain pairs of physical properties can be known simultaneously." },
    { id: "3", text: "Schrödinger's equation describes how the quantum state of a physical system changes over time, forming the foundation of quantum mechanics." },
    { id: "4", text: "Wave functions are mathematical descriptions of quantum states that contain all the information about a system's possible outcomes." },
    { id: "5", text: "Quantum entanglement occurs when particles interact in ways such that the quantum state of each particle cannot be described independently." },
  ];

  const handleReaction = (reaction: Reaction) => {
    setCurrentReaction(reaction);
  };

  const handleSubmitComment = () => {
    if (selectedSection && commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        sectionId: selectedSection,
        text: commentText,
        reaction: currentReaction,
        timestamp: new Date().toLocaleString(),
      };
      setComments([newComment, ...comments]);
      setCommentText("");
      setCurrentReaction(null);
      setSelectedSection(null);
    }
  };

  const getReactionIcon = (reaction: Reaction) => {
    switch (reaction) {
      case "like": return <ThumbsUp className="h-3 w-3 text-green-500" />;
      case "confused": return <Frown className="h-3 w-3 text-yellow-500" />;
      case "dislike": return <ThumbsDown className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

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
              <h1 className="text-xl font-bold text-foreground">Lecture {lectureId}</h1>
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
                <CardTitle>Introduction to Topic {lectureId}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {lectureSections.map((section) => (
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
                      variant={currentReaction === "like" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReaction("like")}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Like
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
                      variant={currentReaction === "dislike" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReaction("dislike")}
                      className="gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Dislike
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Add your comment (optional)"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleSubmitComment} className="w-full">
                    Submit Feedback
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
                        <div key={comment.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            {getReactionIcon(comment.reaction)}
                            <Badge variant="outline" className="text-xs">
                              Section {comment.sectionId}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mb-2">{comment.text}</p>
                          <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
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
