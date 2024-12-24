import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import PhoneForm from "@/components/auth/PhoneForm";
import OTPForm from "@/components/auth/OTPForm";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (!digits.startsWith('91')) {
      return `+91${digits}`;
    }
    return `+${digits}`;
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!phone) {
        toast({
          title: "Missing phone number",
          description: "Please enter your phone number",
          variant: "destructive",
        });
        return;
      }

      const formattedPhone = formatPhoneNumber(phone);
      console.log("Sending OTP to:", formattedPhone);

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true,
          data: {
            phone: formattedPhone
          }
        }
      });

      if (error) {
        console.error("OTP send error:", error);
        toast({
          title: "Failed to send OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setShowOTP(true);
        startResendTimer();
        toast({
          title: "OTP sent",
          description: "Please check your phone for the verification code",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error("OTP verification error:", error);
        const errorMessage = error.message.includes("expired") 
          ? "OTP has expired. Please request a new one."
          : "Invalid OTP. Please try again.";
        
        toast({
          title: "Verification failed",
          description: errorMessage,
          variant: "destructive",
        });

        if (error.message.includes("expired")) {
          setOTP("");
          setShowOTP(false);
        }
      } else if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          {!showOTP ? (
            <PhoneForm
              phone={phone}
              setPhone={setPhone}
              isLoading={isLoading}
              onSubmit={handleSendOTP}
            />
          ) : (
            <OTPForm
              otp={otp}
              setOTP={setOTP}
              isLoading={isLoading}
              onSubmit={handleVerifyOTP}
              onResend={handleSendOTP}
              onChangePhone={() => setShowOTP(false)}
              resendDisabled={resendDisabled}
              resendTimer={resendTimer}
            />
          )}
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate("/register")}
            >
              Register here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;