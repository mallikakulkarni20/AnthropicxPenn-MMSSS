import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Check, X, ThumbsUp, Frown, ThumbsDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Suggestion {
  id: string;
  sectionId: string;
  originalText: string;
  suggestedText: string;
  status: "pending" | "accepted" | "rejected";
}

interface StudentComment {
  id: string;
  sectionId: string;
  studentName: string;
  text: string;
  reaction: "like" | "confused" | "dislike";
  timestamp: string;
}

const TeacherLectureView = () => {
  const { lectureId } = useParams();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      sectionId: "2",
      originalText: "The Heisenberg Uncertainty Principle is a fundamental concept that limits the precision with which certain pairs of physical properties can be known simultaneously.",
      suggestedText: "The Heisenberg Uncertainty Principle is a cornerstone of quantum mechanics. It states that there's a fundamental limit to how precisely we can simultaneously know certain pairs of physical properties (like position and momentum). The more accurately we measure one property, the less accurately we can know the other. This isn't due to measurement errors, but a fundamental property of quantum systems.",
      status: "pending"
    },
    {
      id: "2",
      sectionId: "4",
      originalText: "Wave functions are mathematical descriptions of quantum states that contain all the information about a system's possible outcomes.",
      suggestedText: "Wave functions (represented by the Greek letter ψ, psi) are mathematical tools that describe quantum states. Think of them as containing all possible information about where a particle might be and what it might be doing. When we measure the system, the wave function 'collapses' to give us one specific outcome from all the possibilities it described.",
      status: "pending"
    }
  ]);

  const studentComments: StudentComment[] = [
    { id: "1", sectionId: "2", studentName: "Alice Chen", text: "I don't understand what 'simultaneously' means in this context", reaction: "confused", timestamp: "2 hours ago" },
    { id: "2", sectionId: "2", studentName: "Bob Smith", text: "Could you provide an example?", reaction: "confused", timestamp: "3 hours ago" },
    { id: "3", sectionId: "4", studentName: "Carol Davis", text: "What is a wave function exactly?", reaction: "confused", timestamp: "1 hour ago" },
    { id: "4", sectionId: "3", studentName: "David Lee", text: "This explanation is very clear!", reaction: "like", timestamp: "4 hours ago" },
    { id: "5", sectionId: "4", studentName: "Emma Wilson", text: "Too technical, needs simpler explanation", reaction: "dislike", timestamp: "2 hours ago" },
  ];

  const lectureSections = [
    { id: "1", text: "Introduction to quantum mechanics begins with the wave-particle duality principle, which states that all matter exhibits both wave and particle properties." },
    { id: "2", text: "The Heisenberg Uncertainty Principle is a fundamental concept that limits the precision with which certain pairs of physical properties can be known simultaneously." },
    { id: "3", text: "Schrödinger's equation describes how the quantum state of a physical system changes over time, forming the foundation of quantum mechanics." },
    { id: "4", text: "Wave functions are mathematical descriptions of quantum states that contain all the information about a system's possible outcomes." },
    { id: "5", text: "Quantum entanglement occurs when particles interact in ways such that the quantum state of each particle cannot be described independently." },
  ];

  const handleApprove = (suggestionId: string) => {
    setSuggestions(suggestions.map(s => 
      s.id === suggestionId ? { ...s, status: "accepted" as const } : s
    ));
  };

  const handleReject = (suggestionId: string) => {
    setSuggestions(suggestions.map(s => 
      s.id === suggestionId ? { ...s, status: "rejected" as const } : s
    ));
  };

  const getSuggestionForSection = (sectionId: string) => {
    return suggestions.find(s => s.sectionId === sectionId && s.status === "pending");
  };

  const getCommentsForSection = (sectionId: string) => {
    return studentComments.filter(c => c.sectionId === sectionId);
  };

  const getReactionIcon = (reaction: string) => {
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
            <Link to="/teacher">
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
          <Badge variant="secondary">
            {suggestions.filter(s => s.status === "pending").length} Pending Suggestions
          </Badge>
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
                {lectureSections.map((section) => {
                  const suggestion = getSuggestionForSection(section.id);
                  const sectionComments = getCommentsForSection(section.id);

                  return (
                    <div key={section.id} className="space-y-3">
                      {suggestion ? (
                        <div className="p-4 rounded-lg border-2 border-green-500/30 bg-green-500/5">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">
                              AI Suggestion
                            </Badge>
                            {sectionComments.length > 0 && (
                              <Badge variant="outline">
                                {sectionComments.length} comments
                              </Badge>
                            )}
                          </div>
                          
                          {/* Original text */}
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">ORIGINAL:</p>
                            <p className="text-sm text-muted-foreground line-through">
                              {suggestion.originalText}
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
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(suggestion.id)}
                              variant="outline"
                              className="gap-2"
                              size="sm"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg border border-border">
                          <p className="text-foreground leading-relaxed">{section.text}</p>
                          {sectionComments.length > 0 && (
                            <Badge variant="outline" className="mt-2">
                              {sectionComments.length} comments
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
                <CardTitle className="text-lg">Student Feedback ({studentComments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {studentComments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          {getReactionIcon(comment.reaction)}
                          <span className="text-sm font-medium text-foreground">
                            {comment.studentName}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs mb-2">
                          Section {comment.sectionId}
                        </Badge>
                        <p className="text-sm text-foreground mb-2">{comment.text}</p>
                        <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                      </div>
                    ))}
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
