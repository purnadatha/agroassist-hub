import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setEmail(data.email || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ email: email })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email updated successfully",
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-4 border-b md:hidden">
          <MobileNav />
        </div>
        <main className="p-4">
          <h1 className="text-2xl font-bold text-primary mb-6">Profile Details</h1>
          {profile && (
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="p-2 bg-muted rounded-md">
                      {profile.full_name}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <div className="p-2 bg-muted rounded-md">
                      {profile.phone}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Email</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter new email"
                        />
                        <Button onClick={handleUpdateEmail}>Save</Button>
                      </div>
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aadhar Number</label>
                    <div className="p-2 bg-muted rounded-md">
                      {profile.aadhar_number}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">PAN Number</label>
                    <div className="p-2 bg-muted rounded-md">
                      {profile.pan_number}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;