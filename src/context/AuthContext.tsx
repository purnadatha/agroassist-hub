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
  deleteAccount: () => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
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

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

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
        toast({
          title: "Registration successful",
          description: "Please check your email for confirmation or use the 'Resend verification email' option below the login form if you didn't receive it.",
          duration: 6000,
        });
      } else {
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

  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete your account",
          variant: "destructive",
        });
        return { error: new Error("Not authenticated") };
      }

      const { data, error } = await supabase.rpc('delete_user_with_data', {
        user_id: user.id
      });

      if (error) {
        console.error("Account deletion error:", error.message);
        toast({
          title: "Account deletion failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data && data.includes("Error")) {
        console.error("Account deletion issue:", data);
        toast({
          title: "Account deletion issue",
          description: data,
          variant: "destructive",
        });
        return { error: new Error(data) };
      }

      console.log("Account deleted:", data);
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });
      
      navigate("/");
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error during account deletion:", error.message);
      toast({
        title: "Account deletion failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        console.error("Password update error:", error.message);
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Password updated successfully",
        description: "Your password has been updated",
      });
      
      return { error: null };
    } finally {
      setIsLoading(false);
    }
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
        resendVerificationEmail,
        deleteAccount,
        updatePassword
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
