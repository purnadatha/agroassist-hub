
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConfirmEmailChange = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the access token and type from the URL
    const handleEmailChange = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Parse the hash parameters
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");
        
        if (!accessToken || type !== "email_change") {
          setError("Invalid or missing parameters in the confirmation URL.");
          return;
        }

        // Set the session using the access token
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: "", // Not needed for this operation
        });

        if (sessionError) {
          throw sessionError;
        }

        // Update the auth state
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          setSuccess(true);
          toast({
            title: "Email changed successfully",
            description: "Your email address has been updated. You can now continue using the application.",
          });
        }
      } catch (err: any) {
        console.error("Email change confirmation error:", err);
        setError(err.message || "Failed to confirm email change. Please try again.");
        toast({
          title: "Email change failed",
          description: err.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    handleEmailChange();
  }, [location, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Email Change Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="text-center text-muted-foreground">
              <p>Processing your request...</p>
              <div className="mt-2 animate-pulse">Please wait</div>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md">
              <p>Your email has been successfully changed.</p>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmailChange;
