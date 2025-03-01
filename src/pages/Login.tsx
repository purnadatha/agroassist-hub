
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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

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

  const validateEmail = (email: string) => {
    // Enhanced email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

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
    
    if (!validateEmail(email)) {
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
        
        setLoginAttempts(prev => prev + 1);
        
        // Handling specific error messages more user-friendly
        if (authError.message.includes("Invalid login credentials")) {
          if (loginAttempts >= 2) {
            setError("Multiple login attempts failed. Please verify your credentials or use the 'Create & Login with Demo Account' option below.");
          } else {
            setError("The email or password you entered is incorrect. Please try again or reset your password.");
          }
          
          // Debug info - shows the error in the console but doesn't show to the user
          console.log("Auth error details:", authError);
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please check your email inbox to confirm your account before logging in.");
        } else {
          setError(`Login failed: ${authError.message}. Please check your credentials and try again.`);
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

  // Create or use demo account
  const createAndLoginWithDemoAccount = async () => {
    clearError();
    setIsLoading(true);
    
    const demoEmail = "demo@agrotrack.com";
    const demoPassword = "demo123";
    
    try {
      // First check if we can login with the demo account
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      
      if (signInError) {
        console.log("Demo account login failed, attempting to create account:", signInError);
        
        // If login fails, create the demo account
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            data: {
              full_name: "Demo User",
              phone: "1234567890",
              email: demoEmail
            }
          }
        });

        if (signUpError) {
          console.error("Demo account creation error:", signUpError);
          setError("Couldn't create demo account: " + signUpError.message);
        } else {
          // Check if email confirmation is required
          if (data?.user?.identities?.length === 0) {
            setRegistrationSuccess(true);
            setEmail(demoEmail);
            setPassword(demoPassword);
            toast({
              title: "Demo account created",
              description: "Please check the demo email inbox for a confirmation link, or login once confirmed.",
            });
          } else {
            // Try to automatically sign in with the new account
            const { data: autoSignInData, error: autoSignInError } = await supabase.auth.signInWithPassword({
              email: demoEmail,
              password: demoPassword,
            });
            
            if (autoSignInError) {
              setRegistrationSuccess(true);
              setEmail(demoEmail);
              setPassword(demoPassword);
              toast({
                title: "Demo account created",
                description: "Demo credentials are now filled in. Please click Login to sign in.",
              });
            } else if (autoSignInData.user) {
              toast({
                title: "Demo login successful",
                description: "You are now logged in with the demo account.",
              });
              navigate("/dashboard");
            }
          }
        }
      } else if (signInData.user) {
        // Login was successful
        toast({
          title: "Demo login successful",
          description: "You are now logged in with the demo account.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoCredentials = () => {
    setEmail("demo@agrotrack.com");
    setPassword("demo123");
    clearError();
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
          
          {registrationSuccess && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">
                Demo account is ready to use. Click Login with the following credentials:
                <div className="font-medium mt-1">
                  Email: demo@agrotrack.com<br/>
                  Password: demo123
                </div>
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
            
            {/* Demo account options */}
            <div className="flex flex-col gap-2 mt-2">
              <Button
                type="button"
                onClick={useDemoCredentials}
                variant="outline"
                className="text-sm"
              >
                Use Demo Credentials
              </Button>
              
              <Button
                type="button"
                onClick={createAndLoginWithDemoAccount}
                variant="secondary"
                className="text-sm"
              >
                Create & Login with Demo Account
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-1">
                Demo: demo@agrotrack.com / Password: demo123
              </p>
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
