import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { api, LectureListItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const TeacherDashboard = () => {
  const { toast } = useToast();
  const [lectures, setLectures] = useState<LectureListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openLectures, setOpenLectures] = useState<Set<string>>(new Set());

  // Hardcoded teacher ID for now - in production this would come from auth
  const teacherId = "teacher-1";

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const data = await api.getTeacherLectures(teacherId);
        setLectures(data);
        // Open current versions by default
        const currentBaseLectureIds = data
          .filter(l => l.isCurrent)
          .map(l => l.baseLectureId);
        setOpenLectures(new Set(currentBaseLectureIds));
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

  // Group lectures by baseLectureId
  const groupedLectures = lectures.reduce((acc, lecture) => {
    if (!acc[lecture.baseLectureId]) {
      acc[lecture.baseLectureId] = [];
    }
    acc[lecture.baseLectureId].push(lecture);
    return acc;
  }, {} as Record<string, LectureListItem[]>);

  // Sort versions within each group
  Object.keys(groupedLectures).forEach(key => {
    groupedLectures[key].sort((a, b) => b.version - a.version);
  });

  const toggleLecture = (baseLectureId: string) => {
    const newOpen = new Set(openLectures);
    if (newOpen.has(baseLectureId)) {
      newOpen.delete(baseLectureId);
    } else {
      newOpen.add(baseLectureId);
    }
    setOpenLectures(newOpen);
  };

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
                Manage content, review student feedback, and approve AI suggestions
              </p>
            </div>
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
                <div className="text-3xl font-bold text-foreground">
                  {Object.keys(groupedLectures).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Versions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{lectures.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Versions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary-foreground">
                  {lectures.filter(l => l.isCurrent).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lecture Cards */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : Object.keys(groupedLectures).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No lectures created yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedLectures).map(([baseLectureId, versions]) => {
                const currentVersion = versions.find(v => v.isCurrent) || versions[0];
                const isOpen = openLectures.has(baseLectureId);
                
                return (
                  <Card key={baseLectureId} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{currentVersion.title}</CardTitle>
                            <CardDescription>
                              {versions.length} version{versions.length !== 1 ? 's' : ''}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {currentVersion.isCurrent && (
                            <Badge variant="default">Current</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLecture(baseLectureId)}
                          >
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <Collapsible open={isOpen}>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="space-y-2">
                            {versions.map((version) => (
                              <div
                                key={version.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline">v{version.version}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {version.id}
                                  </span>
                                  {version.isCurrent && (
                                    <Badge variant="secondary" className="text-xs">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <Link to={`/teacher/lecture/${version.id}`}>
                                  <Button size="sm" variant="outline">
                                    View
                                  </Button>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
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

export default TeacherDashboard;
