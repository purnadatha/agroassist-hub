import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Leaf } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

const CropRecommendation = () => {
  const [soilType, setSoilType] = useState("");
  const [ph, setPh] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [temperature, setTemperature] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const { toast } = useToast();

  const soilTypes = [
    "Clay",
    "Sandy",
    "Loamy",
    "Black",
    "Red",
    "Alluvial",
    "Laterite",
  ];

  const generateRecommendation = async () => {
    if (!soilType || !ph || !rainfall || !temperature) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate pH range
    const phValue = parseFloat(ph);
    if (phValue < 0 || phValue > 14) {
      toast({
        title: "Invalid pH Value",
        description: "pH must be between 0 and 14.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // This is a mock recommendation logic - in a real app, you'd call an AI model
      let recommendedCrops = [];
      
      // Basic recommendation logic based on soil type and pH
      if (soilType === "Clay" && phValue >= 6 && phValue <= 7.5) {
        recommendedCrops = ["Rice", "Wheat", "Cotton"];
      } else if (soilType === "Sandy" && phValue >= 5.5 && phValue <= 7) {
        recommendedCrops = ["Groundnut", "Potato", "Carrot"];
      } else if (soilType === "Loamy" && phValue >= 6 && phValue <= 7) {
        recommendedCrops = ["Corn", "Soybean", "Vegetables"];
      } else if (soilType === "Black" && phValue >= 6.5 && phValue <= 8) {
        recommendedCrops = ["Cotton", "Sugarcane", "Sunflower"];
      } else {
        recommendedCrops = ["General crops suitable for your soil"];
      }

      const mockRecommendation = `Based on your inputs:
        - Soil Type: ${soilType}
        - pH Level: ${ph}
        - Rainfall: ${rainfall} mm
        - Temperature: ${temperature}°C

        Recommended crops for your conditions:
        ${recommendedCrops.map((crop, index) => `${index + 1}. ${crop}`).join('\n')}
        
        Additional considerations:
        - Ensure proper irrigation if rainfall is less than required
        - Consider crop rotation to maintain soil health
        - Monitor soil moisture levels regularly`;

      setRecommendation(mockRecommendation);
      toast({
        title: "Success",
        description: "Crop recommendation generated successfully!",
      });
    } catch (error) {
      console.error("Error generating recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <BackButton />
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Smart Crop Recommendation</h1>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Soil Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soil Type</label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Soil Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soil pH (0-14)</label>
                  <Input
                    type="number"
                    placeholder="Enter soil pH"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    min="0"
                    max="14"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rainfall (mm)</label>
                  <Input
                    type="number"
                    placeholder="Enter annual rainfall"
                    value={rainfall}
                    onChange={(e) => setRainfall(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperature (°C)</label>
                  <Input
                    type="number"
                    placeholder="Enter average temperature"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={generateRecommendation}
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Recommendation
                </Button>
              </CardContent>
            </Card>

            {recommendation && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendation</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {recommendation}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CropRecommendation;