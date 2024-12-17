import { Home, ShoppingBag, Tractor, MessageSquare, Landmark, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white border-r p-4 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-primary mb-4">AgroTrack</h2>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/marketplace")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Marketplace
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Tractor className="mr-2 h-4 w-4" />
            Rent Tools
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
          <Button variant="ghost" className="w-full justify-start">
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