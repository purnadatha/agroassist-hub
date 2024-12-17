import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tractor, MessageSquare, Landmark } from "lucide-react";

const Dashboard = () => {
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
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <ShoppingBag className="h-6 w-6 mb-2" />
                  <span>Marketplace</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Tractor className="h-6 w-6 mb-2" />
                  <span>Rent Tools</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span>AI Assistant</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Landmark className="h-6 w-6 mb-2" />
                  <span>Loans</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;