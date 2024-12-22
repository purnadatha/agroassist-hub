import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tractor, Landmark, Sprout } from "lucide-react";
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
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const schemes = JSON.parse(localStorage.getItem("appliedSchemes") || "[]");
    setAppliedSchemes(schemes);
    
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserName(userData.fullName || "User");
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-4 border-b md:hidden">
          <MobileNav />
        </div>
        <main className="p-4">
          <h1 className="text-2xl font-bold text-primary mb-1">Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome back, {userName}!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeatherWidget />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto group transition-all duration-300 hover:scale-105"
                  onClick={() => navigate("/marketplace")}
                >
                  <ShoppingBag className="h-6 w-6 mb-2 group-hover:animate-bounce text-primary transition-colors duration-300" />
                  <span>Marketplace</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto group transition-all duration-300 hover:scale-105"
                  onClick={() => navigate("/rent-tools")}
                >
                  <Tractor className="h-6 w-6 mb-2 group-hover:animate-pulse text-primary transition-colors duration-300" />
                  <span>Rent Tools</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto group transition-all duration-300 hover:scale-105"
                  onClick={() => navigate("/crop-recommendation")}
                >
                  <Sprout className="h-6 w-6 mb-2 group-hover:rotate-12 text-primary transition-all duration-300" />
                  <span>Crop Guide</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto group transition-all duration-300 hover:scale-105"
                  onClick={() => navigate("/loans")}
                >
                  <Landmark className="h-6 w-6 mb-2 group-hover:animate-pulse text-primary transition-colors duration-300" />
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
    </div>
  );
};

export default Dashboard;