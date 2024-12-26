import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface RegistrationFormData {
  fullName: string;
  email: string;
  aadhar: string;
  pan: string;
}

export const useRegistration = (phone: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (!digits.startsWith('91')) {
      return `+91${digits}`;
    }
    return `+${digits}`;
  };

  const handleRegister = async (formData: RegistrationFormData) => {
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        phone: formattedPhone,
        password: formattedPhone,
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

  return {
    isLoading,
    handleRegister
  };
};