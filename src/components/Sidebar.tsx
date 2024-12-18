import { Home, ShoppingBag, Tractor, MessageSquare, Landmark, LogOut, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r p-4 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-primary mb-4">AgroTrack</h2>
          <Button 
            variant={isActive("/dashboard") ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => navigate("/dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant={isActive("/marketplace") ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => navigate("/marketplace")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Marketplace
          </Button>
          <Button 
            variant={isActive("/rent-tools") ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => navigate("/rent-tools")}
          >
            <Tractor className="mr-2 h-4 w-4" />
            Rent Tools
          </Button>
          <Button 
            variant={isActive("/crop-recommendation") ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => navigate("/crop-recommendation")}
          >
            <Sprout className="mr-2 h-4 w-4" />
            Crop Recommendation
          </Button>
          <Button 
            variant={isActive("/loans") ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => navigate("/loans")}
          >
            <Landmark className="mr-2 h-4 w-4" />
            Loans
          </Button>
        </div>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => navigate("/login")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};