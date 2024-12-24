import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import PhoneForm from "@/components/auth/PhoneForm";
import OTPForm from "@/components/auth/OTPForm";
import { useLoginState } from "@/hooks/useLoginState";
import { handleOTPVerification } from "@/utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isLoading,
    showOTP,
    phone,
    otp,
    resendDisabled,
    resendTimer,
    setIsLoading,
    setShowOTP,
    setPhone,
    setOTP,
    setResendDisabled,
    setResendTimer,
    startResendTimer
  } = useLoginState();

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

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleResendOTP = () => {
    handleSendOTP({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      const result = await handleOTPVerification(formattedPhone, otp);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      } else {
        // Handle specific error cases
        if (result.error.includes("expired")) {
          toast({
            title: "OTP Expired",
            description: "The OTP has expired. Please request a new one.",
            variant: "destructive",
          });
          setOTP("");
          setShowOTP(false);
          startResendTimer();
        } else {
          toast({
            title: "Verification failed",
            description: result.error,
            variant: "destructive",
          });
        }
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
              onResend={handleResendOTP}
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