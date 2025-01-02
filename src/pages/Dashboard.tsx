import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useSpeech } from "@/hooks/useSpeech";

interface AppliedScheme {
  id: string;
  bankName: string;
  schemeName: string;
  interestRate: number;
  maxAmount: number;
  tenure: number;
  description: string;
  applicationDate: string;
  status: string;
}

const Dashboard = () => {
  const [appliedSchemes, setAppliedSchemes] = useState<AppliedScheme[]>([]);
  const [userName, setUserName] = useState("");
  const { speak } = useSpeech();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();

          if (profile?.full_name) {
            setUserName(profile.full_name);
            speak(`Welcome back, ${profile.full_name}!`);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const schemes = JSON.parse(localStorage.getItem("appliedSchemes") || "[]");
    setAppliedSchemes(schemes);
    fetchUserProfile();
  }, [speak]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-4 border-b md:hidden">
          <MobileNav />
        </div>
        <main className="p-4">
          <h1 className="text-2xl font-bold text-primary mb-1">Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome back, {userName || 'User'}!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeatherWidget />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>

            {appliedSchemes.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Applied Loan Schemes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {appliedSchemes.map((scheme) => (
                      <Card key={scheme.id + scheme.applicationDate}>
                        <CardContent className="pt-6">
                          <h3 className="font-semibold text-lg mb-2">{scheme.schemeName}</h3>
                          <div className="space-y-2 text-sm">
                            <p>Bank: {scheme.bankName}</p>
                            <p>Interest Rate: {scheme.interestRate}%</p>
                            <p>Maximum Amount: ₹{scheme.maxAmount.toLocaleString()}</p>
                            <p>Application Date: {new Date(scheme.applicationDate).toLocaleDateString()}</p>
                            <p className="font-medium">Status: {scheme.status}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;