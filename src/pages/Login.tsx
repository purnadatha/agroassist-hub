
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useLoginState } from "@/hooks/useLoginState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isLoading,
    email,
    password,
    error,
    setIsLoading,
    setEmail,
    setPassword,
    setError,
    clearError
  } = useLoginState();

  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    clearError();
    
    if (!email) {
      setError("Email is required");
      return false;
    }
    
    if (!password) {
      setError("Password is required");
      return false;
    }
    
    // Basic email validation - less strict now
    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Try to sign in with the provided credentials
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        console.error("Login error:", authError);
        
        // Handling specific error messages more user-friendly
        if (authError.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Please try again or create an account.");
          
          // Debug info - shows the error in the console but doesn't show to the user
          console.log("Auth error details:", authError);
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please check your email inbox to confirm your account before logging in.");
        } else {
          setError("Login failed. Please check your credentials and try again.");
        }
        
        toast({
          title: "Login failed",
          description: "Check your credentials or try registering for a new account.",
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back to AgroTrack!",
        });
        navigate("/dashboard");
      }
    } catch (unexpectedError) {
      console.error("Unexpected error:", unexpectedError);
      setError("An unexpected error occurred. Please try again later.");
      toast({
        title: "Error",
        description: "Connection issue. Please check your internet and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For debugging - let's add an option to auto-fill test credentials
  const fillTestCredentials = () => {
    setEmail("test@example.com");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Login to AgroTrack
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <button 
                  type="button" 
                  className="text-xs text-primary hover:underline"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"} password
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            {/* For testing purposes */}
            <div className="text-center">
              <button 
                type="button" 
                onClick={fillTestCredentials}
                className="text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                Fill test credentials
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
