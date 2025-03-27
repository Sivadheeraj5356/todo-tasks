
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getCurrentLocation, getWeatherByCoords, getWeatherByCity, getWeatherIconUrl, WeatherData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Cloud, MapPin, Wind, Droplets, Thermometer } from 'lucide-react';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          // Attempt to get user's current location
          const position = await getCurrentLocation();
          const { latitude, longitude } = position.coords;
          
          // Fetch weather data based on coordinates
          const weatherData = await getWeatherByCoords(latitude, longitude);
          setWeather(weatherData);
        } catch (locationError) {
          console.log('Location access denied, using fallback city');
          // Fallback to a default city if geolocation fails
          const weatherData = await getWeatherByCity('London');
          setWeather(weatherData);
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Could not fetch weather data');
        toast({
          title: 'Weather Error',
          description: 'Failed to load weather information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeatherData();
  }, [toast]);
  
  if (loading) {
    return (
      <Card className="p-4 animate-pulse glass-card">
        <div className="flex items-center justify-center h-24">
          <p className="text-muted-foreground">Loading weather...</p>
        </div>
      </Card>
    );
  }
  
  if (error || !weather) {
    return (
      <Card className="p-4 glass-card">
        <div className="flex items-center justify-center h-24">
          <Cloud className="h-5 w-5 mr-2 opacity-50" />
          <p className="text-muted-foreground">Weather unavailable</p>
        </div>
      </Card>
    );
  }
  
  // Format temperature
  const temp = Math.round(weather?.main?.temp || 0);
  const feelsLike = Math.round(weather?.main?.feels_like || 0);
  
  return (
    <Card className="p-4 glass-card animate-fade-in overflow-hidden">
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-1">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <h3 className="text-sm font-medium">{weather?.name}, {weather?.sys?.country}</h3>
            </div>
            
            <div className="flex items-center">
              <span className="text-3xl font-bold">{temp}°</span>
              {weather?.weather?.[0]?.icon && (
                <img 
                  src={getWeatherIconUrl(weather.weather[0].icon)} 
                  alt={weather.weather[0].description}
                  className="h-12 w-12" 
                />
              )}
            </div>
            
            <p className="text-sm capitalize">{weather?.weather?.[0]?.description}</p>
          </div>
          
          <div className="text-right">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-end text-sm">
                <Thermometer className="h-4 w-4 mr-1 opacity-70" />
                <span>Feels like {feelsLike}°</span>
              </div>
              
              <div className="flex items-center justify-end text-sm">
                <Wind className="h-4 w-4 mr-1 opacity-70" />
                <span>{weather?.wind?.speed} m/s</span>
              </div>
              
              <div className="flex items-center justify-end text-sm">
                <Droplets className="h-4 w-4 mr-1 opacity-70" />
                <span>{weather?.main?.humidity}% humidity</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <Cloud className="h-4 w-4 inline mr-1" />
            <span>
              {weather && isGoodWeatherForOutdoor(weather) 
                ? 'Great weather for outdoor activities!' 
                : 'Consider indoor activities today'}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};

// Helper function to determine if weather is suitable for outdoor activities
function isGoodWeatherForOutdoor(weather: WeatherData): boolean {
  const temp = weather.main.temp;
  const weatherCondition = weather.weather[0].main.toLowerCase();
  
  // Bad conditions for outdoor activities
  const badConditions = ['thunderstorm', 'rain', 'snow', 'extreme'];
  
  // Check if temperature is reasonable and weather is not bad
  return (
    temp > 10 && temp < 35 && !badConditions.some(condition => weatherCondition.includes(condition))
  );
}

export default WeatherWidget;
