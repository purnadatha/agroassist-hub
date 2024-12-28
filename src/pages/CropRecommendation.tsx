import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

const CropRecommendation = () => {
  const [soilType, setSoilType] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState("");
  const { toast } = useToast();

  const fetchWeatherData = async () => {
    try {
      // This is a mock API call - replace with actual weather API
      const mockWeatherData = {
        temperature: 25,
        humidity: 65,
        rainfall: 200,
      };
      setWeatherData(mockWeatherData);
      return mockWeatherData;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateRecommendation = async () => {
    if (!soilType || !ph) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const weather = await fetchWeatherData();
      if (!weather) return;

      // This is a mock AI recommendation - replace with actual AI model
      const mockRecommendation = `Based on the current conditions:
        - Soil Type: ${soilType}
        - pH Level: ${ph}
        - Temperature: ${weather.temperature}°C
        - Humidity: ${weather.humidity}%
        - Rainfall: ${weather.rainfall}mm

        Recommended crops:
        1. Rice
        2. Wheat
        3. Maize
        
        These crops are well-suited for your current soil conditions and local climate.`;

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
          <h1 className="text-2xl font-bold text-primary mb-6">Crop Recommendation</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Soil Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Soil Type</label>
                  <Input
                    placeholder="Enter soil type"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">pH Level</label>
                  <Input
                    type="number"
                    placeholder="Enter pH level"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    min="0"
                    max="14"
                    step="0.1"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={generateRecommendation}
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Recommendation
                </Button>
              </CardContent>
            </Card>

            {weatherData && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Weather Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Temperature: {weatherData.temperature}°C</p>
                  <p>Humidity: {weatherData.humidity}%</p>
                  <p>Rainfall: {weatherData.rainfall}mm</p>
                </CardContent>
              </Card>
            )}

            {recommendation && (
              <Card className="md:col-span-2">
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