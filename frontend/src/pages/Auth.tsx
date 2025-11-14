import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, GraduationCap, Users, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get("role") || "student";
  
  const [role, setRole] = useState<"student" | "teacher">(initialRole as "student" | "teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }

    // Validate login against registered users
    const result = auth.login(email, password);
    
    if (!result.success) {
      setLoginError(result.error || "Login failed");
      return;
    }

    if (!result.user) {
      setLoginError("Login failed");
      return;
    }

    // Check if role matches
    if (result.user.role !== role) {
      setLoginError(`Please login as a ${result.user.role}, not as a ${role}`);
      return;
    }

    // Set user and navigate
    auth.setUser(result.user);

    if (role === "student") {
      navigate("/student");
    } else {
      navigate("/teacher");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess(false);

    if (!name || !email || !password) {
      setSignupError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    // Register new user
    const result = auth.registerUser(email, password, name, role);
    
    if (!result.success) {
      setSignupError(result.error || "Signup failed");
      return;
    }

    // Auto-login after signup
    setSignupSuccess(true);
    const loginResult = auth.login(email, password);
    
    if (loginResult.success && loginResult.user) {
      auth.setUser(loginResult.user);
      // Small delay to show success message
      setTimeout(() => {
        if (role === "student") {
          navigate("/student");
        } else {
          navigate("/teacher");
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">fAIry</h1>
        </Link>

        <Card className="border-border">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Choose your role and get started
            </CardDescription>
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={role === "student" ? "default" : "outline"}
                onClick={() => {
                  setRole("student");
                  setLoginError("");
                  setSignupError("");
                }}
                className="gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Student
              </Button>
              <Button
                variant={role === "teacher" ? "default" : "outline"}
                onClick={() => {
                  setRole("teacher");
                  setLoginError("");
                  setSignupError("");
                }}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Teacher
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginError("");
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError("");
                      }}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login as {role === "student" ? "Student" : "Teacher"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {signupSuccess && (
                    <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Account created successfully! Logging you in...</AlertDescription>
                    </Alert>
                  )}
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setSignupError("");
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setSignupError("");
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password (min. 6 characters)</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setSignupError("");
                      }}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign Up as {role === "student" ? "Student" : "Teacher"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
