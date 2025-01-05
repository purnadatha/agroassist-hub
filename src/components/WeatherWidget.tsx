import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, Thermometer, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "./ui/use-toast";

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

interface Location {
  latitude: number;
  longitude: number;
  locationName: string;
}

export const WeatherWidget = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHIwOWh4Z2cwMGRqMmtvNzVwNnpxZXF4In0.a9qmD5MJ6oRlIUkm3sATvg`
            );
            const data = await response.json();
            const placeName = data.features[0]?.place_name || "Current Location";
            
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              locationName: placeName,
            });
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              locationName: "Current Location",
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Access Required",
            description: "Please enable location access for accurate weather data.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["weather", location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location) return null;
      
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      if (error) throw error;
      return data as WeatherData;
    },
    enabled: !!location,
  });

  if (isLoading || !location) {
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

  const todayWeather = weather?.timelines?.daily[0]?.values;
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
          <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location.locationName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 animate-scale-in">
            <Thermometer className="h-8 w-8 text-primary animate-pulse" />
            <div>
              <p className="text-2xl font-bold">
                {todayWeather?.temperatureAvg ? Math.round(todayWeather.temperatureAvg) : "--"}°C
              </p>
              <p className="text-sm text-gray-500">
                Feels like {todayWeather?.temperatureApparentAvg ? Math.round(todayWeather.temperatureApparentAvg) : "--"}°C
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
                {todayWeather?.precipitationProbabilityAvg ? Math.round(todayWeather.precipitationProbabilityAvg) : "--"}% chance of rain
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};