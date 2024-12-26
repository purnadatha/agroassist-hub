import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PhoneForm from "@/components/auth/PhoneForm";
import OTPForm from "@/components/auth/OTPForm";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { useLoginState } from "@/hooks/useLoginState";
import { handleOTPVerification } from "@/utils/auth";
import { useRegistration } from "@/hooks/useRegistration";
import { useToast } from "@/hooks/use-toast";

// Helper function to format phone numbers
const formatPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (!digits.startsWith('91')) {
    return `+91${digits}`;
  }
  return `+${digits}`;
};

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const {
    showOTP,
    phone,
    otp,
    resendDisabled,
    resendTimer,
    setShowOTP,
    setPhone,
    setOTP,
    setResendDisabled,
    setResendTimer,
    startResendTimer
  } = useLoginState();

  const { isLoading, handleRegister } = useRegistration(phone);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

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
          shouldCreateUser: false
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
    }
  };

  const handleResendOTP = () => {
    handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formattedPhone = formatPhoneNumber(phone);
      const result = await handleOTPVerification(formattedPhone, otp);
      
      if (result.success) {
        setShowRegistrationForm(true);
        setShowOTP(false);
      } else {
        toast({
          title: "Verification failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Register for AgroTrack
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showOTP && !showRegistrationForm ? (
            <PhoneForm
              phone={phone}
              setPhone={setPhone}
              isLoading={isLoading}
              onSubmit={handleSendOTP}
            />
          ) : showOTP ? (
            <OTPForm
              otp={otp}
              setOTP={setOTP}
              isLoading={isLoading}
              onSubmit={handleVerifyOTP}
              onResend={handleResendOTP}
              onChangePhone={() => {
                setShowOTP(false);
                setShowRegistrationForm(false);
              }}
              resendDisabled={resendDisabled}
              resendTimer={resendTimer}
            />
          ) : (
            <RegistrationForm
              isLoading={isLoading}
              onSubmit={handleRegister}
            />
          )}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate("/login")}
            >
              Login here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;