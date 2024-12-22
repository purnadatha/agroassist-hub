import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, Thermometer, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  timelines: {
    daily: Array<{
      values: {
        temperatureAvg: number;
        temperatureApparentAvg: number;
        precipitationProbabilityAvg: number;
        cloudCoverAvg: number;
      };
    }>;
  };
}

export const WeatherWidget = () => {
  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      const { data: { api_key }, error: keyError } = await supabase.functions.invoke('get-weather-key');
      if (keyError) throw new Error("Failed to get API key");
      
      const response = await fetch(
        `https://api.tomorrow.io/v4/weather/forecast?location=42.3478,-71.0466&apikey=${api_key}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return response.json() as Promise<WeatherData>;
    },
    refetchInterval: 1800000, // Refetch every 30 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Weather Data...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-500">
            Failed to load weather data
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const todayWeather = weather?.timelines.daily[0].values;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sun className="h-5 w-5" />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">
                {todayWeather?.temperatureAvg ? Math.round(todayWeather.temperatureAvg) : 0}°C
              </p>
              <p className="text-sm text-gray-500">
                Feels like {todayWeather?.temperatureApparentAvg ? Math.round(todayWeather.temperatureApparentAvg) : 0}°C
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm">
                {todayWeather?.cloudCoverAvg > 50 ? "Cloudy" : "Partly Cloudy"}
              </p>
              <p className="text-sm text-gray-500">
                {todayWeather?.precipitationProbabilityAvg ? Math.round(todayWeather.precipitationProbabilityAvg) : 0}% chance of rain
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};