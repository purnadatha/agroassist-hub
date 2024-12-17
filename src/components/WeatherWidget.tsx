import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, Thermometer } from "lucide-react";

export const WeatherWidget = () => {
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
              <p className="text-2xl font-bold">28°C</p>
              <p className="text-sm text-gray-500">Feels like 30°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm">Partly Cloudy</p>
              <p className="text-sm text-gray-500">30% chance of rain</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};