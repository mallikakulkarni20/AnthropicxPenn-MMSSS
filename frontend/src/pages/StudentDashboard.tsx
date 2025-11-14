import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">fAIry</h1>
            <span className="text-sm text-muted-foreground ml-2">Student</span>
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
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">My Lectures</h2>
            <p className="text-muted-foreground">
              View lecture content, provide feedback, and track updates
            </p>
          </div>

          {/* Lecture Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((lecture) => (
              <Card key={lecture} className="hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Lecture {lecture}
                  </CardTitle>
                  <CardDescription>
                    Introduction to Topic {lecture}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Sections:</span>
                      <span className="font-medium text-foreground">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Feedback:</span>
                      <span className="font-medium text-foreground">3 comments</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium text-foreground">2 days ago</span>
                    </div>
                  </div>
                  <Link to={`/student/lecture/${lecture}`} className="block">
                    <Button className="w-full mt-4" variant="outline">
                      Open Lecture
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
