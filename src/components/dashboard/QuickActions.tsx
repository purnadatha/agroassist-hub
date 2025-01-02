import { Button } from "@/components/ui/button";
import { ShoppingBag, Tractor, Landmark, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { speakText } from "@/utils/textToSpeech";

export const QuickActions = () => {
  const navigate = useNavigate();

  const handleActionClick = (route: string, description: string) => {
    speakText(description);
    navigate(route);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        className="flex flex-col items-center p-4 h-auto group transition-all duration-300 hover:scale-105"
        onClick={() => handleActionClick("/marketplace", "Opening marketplace. Buy and sell agricultural products.")}
      >
        <ShoppingBag className="h-6 w-6 mb-2 group-hover:animate-bounce text-primary transition-colors duration-300" />
        <span>Marketplace</span>
      </Button>
      <Button 
        variant="outline" 
        className="flex flex-col items-center p-4 h-auto group transition-all duration-300 hover:scale-105"
        onClick={() => handleActionClick("/rent-tools", "Opening tool rental. Rent farming equipment or list your tools.")}
      >
        <Tractor className="h-6 w-6 mb-2 group-hover:animate-pulse text-primary transition-colors duration-300" />
        <span>Rent Tools</span>
      </Button>
      <Button 
        variant="outline" 
        className="flex flex-col items-center p-4 h-auto group transition-all duration-300 hover:scale-105"
        onClick={() => handleActionClick("/crop-recommendation", "Opening crop guide. Get smart recommendations for your farm.")}
      >
        <Sprout className="h-6 w-6 mb-2 group-hover:rotate-12 text-primary transition-all duration-300" />
        <span>Crop Guide</span>
      </Button>
      <Button 
        variant="outline" 
        className="flex flex-col items-center p-4 h-auto group transition-all duration-300 hover:scale-105"
        onClick={() => handleActionClick("/loans", "Opening loans page. Calculate EMI and view agricultural loan schemes.")}
      >
        <Landmark className="h-6 w-6 mb-2 group-hover:animate-pulse text-primary transition-colors duration-300" />
        <span>Loans</span>
      </Button>
    </div>
  );
};