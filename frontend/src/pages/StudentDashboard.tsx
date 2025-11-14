import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api, LectureListItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const { toast } = useToast();
  const [lectures, setLectures] = useState<LectureListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded user ID for now - in production this would come from auth
  const userId = "student-1";

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const data = await api.getRecentLectures(userId);
        setLectures(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load lectures. Please try again.",
          variant: "destructive",
        });
        console.error("Error fetching lectures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [toast]);

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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : lectures.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No lectures available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lecture) => (
                <Card key={lecture.id} className="hover:border-primary/50 transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {lecture.title}
                    </CardTitle>
                    <CardDescription>
                      Version {lecture.version}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/student/lecture/${lecture.id}`} className="block">
                      <Button className="w-full" variant="outline">
                        Open Lecture
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
