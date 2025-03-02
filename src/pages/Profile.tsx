
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/ui/back-button";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const Profile = () => {
  useRequireAuth(); // This no longer enforces authentication
  
  const [profile, setProfile] = useState<any>({
    full_name: "Demo User",
    email: "user@example.com",
    phone: "9876543210",
    aadhar_number: "123456789012",
    pan_number: "ABCDE1234F"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have saved profile data in localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setEditedProfile(profile);
    setIsLoading(false);
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Validate Aadhar number
      if (editedProfile.aadhar_number && !/^\d{12}$/.test(editedProfile.aadhar_number)) {
        toast({
          title: "Invalid Aadhar Number",
          description: "Please enter a valid 12-digit Aadhar number",
          variant: "destructive",
        });
        return;
      }

      // Validate PAN number
      if (editedProfile.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(editedProfile.pan_number)) {
        toast({
          title: "Invalid PAN Number",
          description: "Please enter a valid PAN number (e.g., ABCDE1234F)",
          variant: "destructive",
        });
        return;
      }

      // Update local profile state
      setProfile(editedProfile);
      
      // Save to localStorage for persistence across pages
      localStorage.setItem("userProfile", JSON.stringify(editedProfile));
      
      // Save name separately for easy access from Dashboard
      localStorage.setItem("userName", editedProfile.full_name);
      
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-4 border-b md:hidden">
          <MobileNav />
        </div>
        <main className="p-4">
          <BackButton />
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Profile Details</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : profile ? (
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.full_name || ''}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.full_name || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.email || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.phone || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Aadhar Number</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.aadhar_number || ''}
                        onChange={(e) => handleChange('aadhar_number', e.target.value)}
                        placeholder="Enter your 12-digit Aadhar number"
                        pattern="\d{12}"
                        maxLength={12}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.aadhar_number || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">PAN Number</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.pan_number || ''}
                        onChange={(e) => handleChange('pan_number', e.target.value.toUpperCase())}
                        placeholder="Enter your 10-character PAN number"
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        maxLength={10}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.pan_number || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <Button onClick={handleSave} disabled={isLoading}>
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No profile information available</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
