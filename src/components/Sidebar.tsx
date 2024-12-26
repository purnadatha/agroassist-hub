import { Home, ShoppingBag, Tractor, Landmark, LogOut, Sprout, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-64 bg-background border-r p-4 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary relative group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary bg-size-200 animate-gradient-x">
              AgroTrack
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-blue-500 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </h2>
          <ThemeToggle />
        </div>
        <div className="space-y-2">
          <Button 
            variant={isActive("/dashboard") ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => navigate("/dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant={isActive("/profile") ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => navigate("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
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
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};