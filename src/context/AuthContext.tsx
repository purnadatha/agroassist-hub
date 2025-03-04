
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session on initial load
    const getSession = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (!error && data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      setIsLoading(false);
    };

    getSession();

    // Set up auth state listener
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Cleanup function
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // This helps bypass email confirmation if it's enabled
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        console.error("Registration error:", error.message);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log("Registration success:", data);
      
      if (!data.session) {
        // User needs to verify email
        toast({
          title: "Registration successful",
          description: "Please check your email for confirmation or use the 'Resend verification email' option below the login form if you didn't receive it.",
          duration: 6000,
        });
      } else {
        // Auto sign-in successful (email verification might be disabled)
        toast({
          title: "Registration successful",
          description: "You have been automatically logged in!",
        });
        navigate("/dashboard");
        return { error: null };
      }
      
      navigate("/login");
      return { error: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        
        // Special handling for unverified email
        if (error.message.includes("Email not confirmed") || 
            error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login failed",
            description: "Your email may not be verified or credentials are incorrect. Please check your email for a verification link or use the 'Resend verification email' option below.",
            variant: "destructive",
            duration: 6000,
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      console.log("Login success:", data);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/dashboard");
      return { error: null };
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (error) {
        console.error("Failed to resend verification email:", error.message);
        toast({
          title: "Failed to resend verification email",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Verification email sent",
        description: "Please check your inbox and spam folders.",
        duration: 5000,
      });
      
      return { error: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      setSession(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/login");
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        isLoading, 
        signUp, 
        signIn, 
        signOut, 
        resendVerificationEmail 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
