import { supabase } from "@/integrations/supabase/client";

export const handleOTPVerification = async (phone: string, otp: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms'
    });

    if (error) {
      console.error("OTP verification error:", error);
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes("expired")) {
        return { success: false, error: "OTP has expired. Please request a new one." };
      } else if (errorMessage.includes("invalid")) {
        return { success: false, error: "Invalid OTP. Please try again." };
      } else {
        return { success: false, error: "Verification failed. Please try again." };
      }
    }

    if (data.user) {
      return { success: true, user: data.user };
    }

    return { success: false, error: "Verification failed. Please try again." };
  } catch (error) {
    console.error("Unexpected error during OTP verification:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
};