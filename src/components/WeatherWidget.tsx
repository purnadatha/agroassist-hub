import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, Thermometer, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
      // Mocked response to maintain temperature around 21 degrees
      return {
        timelines: {
          daily: [{
            values: {
              temperatureAvg: 21.5,
              temperatureApparentAvg: 21,
              precipitationProbabilityAvg: 20,
              cloudCoverAvg: 40
            }
          }]
        }
      } as WeatherData;
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
  const isPartlyCloudy = todayWeather?.cloudCoverAvg > 30 && todayWeather?.cloudCoverAvg <= 70;
  const isCloudy = todayWeather?.cloudCoverAvg > 70;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sun className={cn(
            "h-5 w-5 transition-transform duration-1000",
            isPartlyCloudy && "opacity-75",
            isCloudy && "opacity-50"
          )} />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 animate-scale-in">
            <Thermometer className="h-8 w-8 text-primary animate-pulse" />
            <div>
              <p className="text-2xl font-bold">
                {todayWeather?.temperatureAvg ? Math.round(todayWeather.temperatureAvg) : 21}°C
              </p>
              <p className="text-sm text-gray-500">
                Feels like {todayWeather?.temperatureApparentAvg ? Math.round(todayWeather.temperatureApparentAvg) : 21}°C
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 animate-scale-in" style={{ animationDelay: "200ms" }}>
            <Cloud className={cn(
              "h-8 w-8 text-primary transition-all duration-1000",
              isPartlyCloudy && "translate-x-1",
              isCloudy && "translate-x-2 scale-110"
            )} />
            <div>
              <p className="text-sm">
                {todayWeather?.cloudCoverAvg > 50 ? "Cloudy" : "Partly Cloudy"}
              </p>
              <p className="text-sm text-gray-500">
                {todayWeather?.precipitationProbabilityAvg ? Math.round(todayWeather.precipitationProbabilityAvg) : 20}% chance of rain
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};