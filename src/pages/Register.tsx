import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PhoneForm from "@/components/auth/PhoneForm";
import OTPForm from "@/components/auth/OTPForm";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { useLoginState } from "@/hooks/useLoginState";
import { handleOTPVerification } from "@/utils/auth";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (!digits.startsWith('91')) {
      return `+91${digits}`;
    }
    return `+${digits}`;
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData: {
    fullName: string;
    email: string;
    aadhar: string;
    pan: string;
  }) => {
    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      // First, sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        phone: formattedPhone,
        password: formattedPhone, // Using phone as password for Twilio OTP flow
        email: formData.email,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formattedPhone,
            aadhar_number: formData.aadhar,
            pan_number: formData.pan,
            email: formData.email
          }
        }
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error("User creation failed");
      }

      // Explicitly insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formattedPhone,
          aadhar_number: formData.aadhar,
          pan_number: formData.pan
        });

      if (profileError) throw profileError;

      toast({
        title: "Registration successful!",
        description: "Please proceed to login",
      });
      
      // Sign out the user after registration
      await supabase.auth.signOut();
      navigate("/login");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message,
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