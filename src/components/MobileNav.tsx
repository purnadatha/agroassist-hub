import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

export const MobileNav = () => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col space-y-4 mt-8">
          <h2 className="text-xl font-bold text-primary mb-4">AgroTrack</h2>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/marketplace")}>
            Marketplace
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/rent-tools")}>
            Rent Tools
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/crop-recommendation")}>
            Crop Recommendation
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            AI Assistant
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/loans")}>
            Loans
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => navigate("/login")}
          >
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};