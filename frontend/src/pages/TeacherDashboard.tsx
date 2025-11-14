import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, LogOut, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">fAIry</h1>
            <span className="text-sm text-muted-foreground ml-2">Teacher</span>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">My Lectures</h2>
              <p className="text-muted-foreground">
                Manage content, review AI suggestions, and publish updates
              </p>
            </div>
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              New Lecture
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Lectures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">6</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">12</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Student Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary-foreground">47</div>
              </CardContent>
            </Card>
          </div>

          {/* Lecture Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { id: 1, pending: 3, feedback: 8 },
              { id: 2, pending: 5, feedback: 12 },
              { id: 3, pending: 0, feedback: 4 },
              { id: 4, pending: 2, feedback: 9 },
              { id: 5, pending: 1, feedback: 7 },
              { id: 6, pending: 1, feedback: 7 },
            ].map((lecture) => (
              <Card key={lecture.id} className="hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    {lecture.pending > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {lecture.pending} pending
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Lecture {lecture.id}
                  </CardTitle>
                  <CardDescription>
                    Introduction to Topic {lecture.id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Sections:</span>
                        <span className="font-medium text-foreground">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Student Feedback:</span>
                        <span className="font-medium text-foreground">{lecture.feedback} comments</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Published:</span>
                        <span className="font-medium text-foreground">2 days ago</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/teacher/lecture/${lecture.id}`} className="flex-1">
                        <Button className="w-full" variant="outline">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      {lecture.pending > 0 && (
                        <Link to={`/teacher/lecture/${lecture.id}`} className="flex-1">
                          <Button className="w-full" variant="default">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review AI
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
