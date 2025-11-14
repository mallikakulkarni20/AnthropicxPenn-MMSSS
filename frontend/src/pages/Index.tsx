import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">fAIry</h1>
          </div>
          <Link to="/auth">
            <Button variant="outline">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              AI-Powered Lecture
              <br />
              <span className="text-primary">Evolution</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform student feedback into better learning materials.
              fAIry bridges the gap between students and professors with intelligent content updates.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/auth?role=student">
              <Button size="lg" className="gap-2">
                <GraduationCap className="h-5 w-5" />
                I'm a Student
              </Button>
            </Link>
            <Link to="/auth?role=teacher">
              <Button size="lg" variant="secondary" className="gap-2">
                <Users className="h-5 w-5" />
                I'm a Teacher
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Interactive Feedback</h3>
              <p className="text-muted-foreground">
                Highlight, react, and comment on lecture content in real-time
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3 hover:border-accent/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">AI-Driven Updates</h3>
              <p className="text-muted-foreground">
                Smart aggregation of feedback generates targeted content improvements
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3 hover:border-secondary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Collaborative Learning</h3>
              <p className="text-muted-foreground">
                Professors approve or reject AI suggestions for continuous improvement
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
