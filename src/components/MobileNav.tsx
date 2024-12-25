import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const MobileNav = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-background border-border w-56">
        <DropdownMenuItem onClick={() => navigate("/dashboard")}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/marketplace")}>
          Marketplace
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/rent-tools")}>
          Rent Tools
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/crop-recommendation")}>
          Crop Recommendation
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/loans")}>
          Loans
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};