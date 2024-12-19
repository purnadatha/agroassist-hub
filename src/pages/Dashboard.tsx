import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tractor, MessageSquare, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const navigate = useNavigate();
  const [appliedSchemes, setAppliedSchemes] = useState<AppliedScheme[]>([]);

  useEffect(() => {
    const schemes = JSON.parse(localStorage.getItem("appliedSchemes") || "[]");
    setAppliedSchemes(schemes);
  }, []);

  const openChat = () => {
    // @ts-ignore - Chatbase types are not available
    if (window.Chatbase) {
      // @ts-ignore
      window.Chatbase.open();
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
          <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeatherWidget />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => navigate("/marketplace")}
                >
                  <ShoppingBag className="h-6 w-6 mb-2" />
                  <span>Marketplace</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => navigate("/rent-tools")}
                >
                  <Tractor className="h-6 w-6 mb-2" />
                  <span>Rent Tools</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={openChat}
                >
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span>AI Assistant</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => navigate("/loans")}
                >
                  <Landmark className="h-6 w-6 mb-2" />
                  <span>Loans</span>
                </Button>
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
      
      {/* Fixed Chat Button */}
      <Button
        onClick={openChat}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Dashboard;