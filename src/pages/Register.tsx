import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const phone = formData.get('phone') as string;
      const email = formData.get('email') as string;
      const fullName = formData.get('fullName') as string;
      const aadhar = formData.get('aadhar') as string;
      const pan = formData.get('pan') as string;

      // Basic validation
      if (!phone || !email || !fullName || !aadhar || !pan) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      // Sign up with phone OTP
      const { data, error } = await supabase.auth.signUp({
        phone,
        password: phone, // Using phone as password for Twilio OTP flow
        email,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            aadhar_number: aadhar,
            pan_number: pan,
            email: email
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration successful!",
          description: "Please proceed to login",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Registration error",
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
            Register for AgroTrack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aadhar Number</label>
              <Input 
                type="text"
                name="aadhar"
                placeholder="Enter your Aadhar number"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PAN Number</label>
              <Input 
                type="text"
                name="pan"
                placeholder="Enter your PAN number"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/login")}
              >
                Login here
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;