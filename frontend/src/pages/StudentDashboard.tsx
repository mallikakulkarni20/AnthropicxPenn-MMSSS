import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, LogOut, Loader2, History } from "lucide-react";
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

  // Group lectures by baseLectureId for display
  const groupedLectures = lectures.reduce((acc, lecture) => {
    if (!acc[lecture.baseLectureId]) {
      acc[lecture.baseLectureId] = [];
    }
    acc[lecture.baseLectureId].push(lecture);
    return acc;
  }, {} as Record<string, LectureListItem[]>);

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
              {Object.entries(groupedLectures).map(([baseLectureId, versions]) => {
                // Sort versions by version number descending (newest first)
                const sortedVersions = [...versions].sort((a, b) => b.version - a.version);
                const currentVersion = sortedVersions.find(v => v.isCurrent);
                const lectureTitle = sortedVersions[0].title;

                return (
                  <Card key={baseLectureId} className="hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-foreground">
                        {lectureTitle}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {sortedVersions.length > 1 ? (
                          <>
                            <History className="h-3 w-3" />
                            {sortedVersions.length} versions available
                          </>
                        ) : (
                          `Version ${sortedVersions[0].version}`
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {sortedVersions.map((lecture) => (
                        <Link 
                          key={lecture.id} 
                          to={`/student/lecture/${lecture.id}`} 
                          className="block"
                        >
                          <Button 
                            className="w-full justify-between" 
                            variant={lecture.isCurrent ? "default" : "outline"}
                          >
                            <span>Version {lecture.version}</span>
                            {lecture.isCurrent && (
                              <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">
                                Current
                              </Badge>
                            )}
                            {!lecture.isCurrent && (
                              <Badge variant="secondary" className="bg-muted">
                                Previous
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
