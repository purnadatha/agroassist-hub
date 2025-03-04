
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FormMessage, Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isLoading, resendVerificationEmail } = useAuth();
  const [emailForResend, setEmailForResend] = useState("");
  const [isResending, setIsResending] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setEmailForResend(values.email); // Save email for potential resend
    const { error } = await signIn(values.email, values.password);
    if (!error) {
      form.reset();
    }
  };

  const handleResendVerification = async () => {
    const email = emailForResend || form.getValues().email;
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address in the form above first",
        variant: "destructive",
      });
      return;
    }
    
    setIsResending(true);
    await resendVerificationEmail(email);
    setIsResending(false);
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email" 
                        placeholder="Enter your email"
                        autoComplete="email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setEmailForResend(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-sm underline text-primary/80 hover:text-primary"
                >
                  {isResending ? "Sending..." : "Resend verification email"}
                </Button>
              </div>
              
              <div className="mt-2 text-center text-sm">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => navigate("/register")}
                >
                  Register here
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
