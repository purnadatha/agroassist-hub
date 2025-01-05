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

  const getCropRecommendations = (
    soilType: string,
    ph: number,
    rainfall: number,
    temperature: number
  ) => {
    const recommendations: { [key: string]: string[] } = {
      Clay: {
        crops: ["Rice", "Wheat", "Cotton", "Sugarcane"],
        phRange: [6.0, 7.5],
        rainfallRange: [750, 2000],
        tempRange: [20, 35],
      },
      Sandy: {
        crops: ["Groundnut", "Potato", "Carrot", "Watermelon"],
        phRange: [5.5, 7.0],
        rainfallRange: [500, 1000],
        tempRange: [15, 30],
      },
      Loamy: {
        crops: ["Corn", "Soybean", "Vegetables", "Fruits"],
        phRange: [6.0, 7.0],
        rainfallRange: [600, 1500],
        tempRange: [18, 32],
      },
      Black: {
        crops: ["Cotton", "Sugarcane", "Sunflower", "Chickpea"],
        phRange: [6.5, 8.0],
        rainfallRange: [500, 1200],
        tempRange: [25, 35],
      },
      Red: {
        crops: ["Groundnut", "Millet", "Tobacco", "Pulses"],
        phRange: [6.0, 7.0],
        rainfallRange: [400, 1000],
        tempRange: [20, 30],
      },
      Alluvial: {
        crops: ["Rice", "Wheat", "Sugarcane", "Vegetables"],
        phRange: [6.5, 7.5],
        rainfallRange: [700, 1500],
        tempRange: [20, 35],
      },
      Laterite: {
        crops: ["Cashew", "Rubber", "Tea", "Coffee"],
        phRange: [5.5, 6.5],
        rainfallRange: [1500, 3000],
        tempRange: [20, 30],
      },
    }[soilType];

    if (!recommendations) {
      return "Invalid soil type selected.";
    }

    const { crops, phRange, rainfallRange, tempRange } = recommendations;
    let suitableCrops = [...crops];
    let conditions = [];

    // Check pH suitability
    if (ph < phRange[0] || ph > phRange[1]) {
      conditions.push(`pH is ${ph < phRange[0] ? "too low" : "too high"}. Ideal range is ${phRange[0]}-${phRange[1]}`);
    }

    // Check rainfall suitability
    if (rainfall < rainfallRange[0] || rainfall > rainfallRange[1]) {
      conditions.push(
        `Rainfall is ${rainfall < rainfallRange[0] ? "insufficient" : "excessive"}. Ideal range is ${rainfallRange[0]}-${rainfallRange[1]} mm`
      );
    }

    // Check temperature suitability
    if (temperature < tempRange[0] || temperature > tempRange[1]) {
      conditions.push(
        `Temperature is ${temperature < tempRange[0] ? "too low" : "too high"}. Ideal range is ${tempRange[0]}-${tempRange[1]}°C`
      );
    }

    let recommendation = `Based on your inputs:\n`;
    recommendation += `Soil Type: ${soilType}\n`;
    recommendation += `pH Level: ${ph}\n`;
    recommendation += `Rainfall: ${rainfall} mm\n`;
    recommendation += `Temperature: ${temperature}°C\n\n`;

    recommendation += `Recommended crops for your soil type:\n`;
    recommendation += crops.map((crop, index) => `${index + 1}. ${crop}`).join('\n');
    recommendation += '\n\n';

    if (conditions.length > 0) {
      recommendation += 'Important considerations:\n';
      recommendation += conditions.map(condition => `- ${condition}`).join('\n');
      recommendation += '\n\n';
    }

    recommendation += 'Additional recommendations:\n';
    recommendation += '- Consider crop rotation to maintain soil health\n';
    recommendation += '- Monitor soil moisture levels regularly\n';
    recommendation += '- Use appropriate fertilizers based on soil testing\n';
    recommendation += '- Implement proper irrigation systems if rainfall is insufficient\n';

    return recommendation;
  };

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
      const rainfallValue = parseFloat(rainfall);
      const temperatureValue = parseFloat(temperature);
      
      const recommendation = getCropRecommendations(
        soilType,
        phValue,
        rainfallValue,
        temperatureValue
      );

      setRecommendation(recommendation);
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

  // ... keep existing code (JSX for the form and layout)

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
