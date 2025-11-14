import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, LogOut, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { auth, teacherApi, lectureApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Lecture {
  id: string;
  baseLectureId: string;
  version: number;
  isCurrent: boolean;
  title: string;
  courseId: string;
}

interface LectureWithStats extends Lecture {
  pendingSuggestions: number;
  totalFeedback: number;
  sectionsCount: number;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = auth.getUser();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [newLectureSections, setNewLectureSections] = useState("");
  const [newLectureCourseId, setNewLectureCourseId] = useState("course-1"); // Default course

  // Redirect if not authenticated
  useEffect(() => {
    if (!user || user.role !== "teacher") {
      navigate("/auth?role=teacher");
    }
  }, [user, navigate]);

  // Fetch lectures
  const { data: lecturesResponse, isLoading: lecturesLoading } = useQuery({
    queryKey: ["teacher-lectures", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await teacherApi.getLectures(user.id);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
        return null;
      }
      return response.data as Lecture[];
    },
    enabled: !!user?.id,
  });

  // Fetch comments for each lecture to calculate stats
  const { data: lecturesWithStats, isLoading: statsLoading } = useQuery({
    queryKey: ["lectures-with-stats", lecturesResponse],
    queryFn: async () => {
      if (!lecturesResponse || !user?.id) return [];
      
      const statsPromises = lecturesResponse.map(async (lecture) => {
        const commentsResponse = await teacherApi.getLectureComments(user.id, lecture.id);
        if (commentsResponse.error) {
          return {
            ...lecture,
            pendingSuggestions: 0,
            totalFeedback: 0,
            sectionsCount: 0,
          } as LectureWithStats;
        }

        const { reactions = [], suggestions = [] } = commentsResponse.data as {
          reactions: any[];
          suggestions: any[];
        };

        // Get lecture details to count sections
        const lectureDetailsResponse = await lectureApi.getLecture(lecture.id);
        const lectureData = lectureDetailsResponse.data as { sections?: Array<{ id: string; order: number; text: string }> } | undefined;
        const sectionsCount = lectureData?.sections?.length || 0;

        return {
          ...lecture,
          pendingSuggestions: suggestions.filter((s) => s.status === "pending").length,
          totalFeedback: reactions.length,
          sectionsCount,
        } as LectureWithStats;
      });

      return Promise.all(statsPromises);
    },
    enabled: !!lecturesResponse && !!user?.id,
  });

  // Create lecture mutation
  const createLectureMutation = useMutation({
    mutationFn: async (data: { title: string; sections: string[]; teacherId: string; courseId: string }) => {
      const response = await lectureApi.createLecture(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-lectures"] });
      setIsCreateDialogOpen(false);
      setNewLectureTitle("");
      setNewLectureSections("");
      toast({
        title: "Success",
        description: "Lecture created successfully!",
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

  const handleCreateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const sections = newLectureSections
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sections.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide at least one section.",
      });
      return;
    }

    createLectureMutation.mutate({
      title: newLectureTitle,
      sections,
      teacherId: user.id,
      courseId: newLectureCourseId,
    });
  };

  const handleLogout = () => {
    auth.clearUser();
    navigate("/");
  };

  const totalLectures = lecturesWithStats?.length || 0;
  const totalPending = lecturesWithStats?.reduce((sum, l) => sum + l.pendingSuggestions, 0) || 0;
  const totalFeedback = lecturesWithStats?.reduce((sum, l) => sum + l.totalFeedback, 0) || 0;

  if (lecturesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
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
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  New Lecture
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateLecture}>
                  <DialogHeader>
                    <DialogTitle>Create New Lecture</DialogTitle>
                    <DialogDescription>
                      Enter the lecture title and sections. Each line will be a new section.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newLectureTitle}
                        onChange={(e) => setNewLectureTitle(e.target.value)}
                        placeholder="Introduction to Algorithms"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseId">Course ID</Label>
                      <Input
                        id="courseId"
                        value={newLectureCourseId}
                        onChange={(e) => setNewLectureCourseId(e.target.value)}
                        placeholder="course-1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sections">Sections (one per line)</Label>
                      <Textarea
                        id="sections"
                        value={newLectureSections}
                        onChange={(e) => setNewLectureSections(e.target.value)}
                        placeholder="Section 1 text&#10;Section 2 text&#10;Section 3 text"
                        className="min-h-[200px]"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createLectureMutation.isPending}>
                      {createLectureMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
                <div className="text-3xl font-bold text-foreground">{totalLectures}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{totalPending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Student Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary-foreground">{totalFeedback}</div>
              </CardContent>
            </Card>
          </div>

          {/* Lecture Cards */}
          {lecturesWithStats && lecturesWithStats.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {lecturesWithStats
                .filter((lecture) => lecture.isCurrent)
                .map((lecture) => (
                  <Card key={lecture.id} className="hover:border-primary/50 transition-all cursor-pointer group">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        {lecture.pendingSuggestions > 0 && (
                          <Badge variant="secondary" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {lecture.pendingSuggestions} pending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {lecture.title}
                      </CardTitle>
                      <CardDescription>
                        Version {lecture.version} • {lecture.courseId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Sections:</span>
                            <span className="font-medium text-foreground">{lecture.sectionsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Student Feedback:</span>
                            <span className="font-medium text-foreground">{lecture.totalFeedback} comments</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/teacher/lecture/${lecture.id}`} className="flex-1">
                            <Button className="w-full" variant="outline">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                          {lecture.pendingSuggestions > 0 && (
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
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No lectures yet</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first lecture to get started
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  New Lecture
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
