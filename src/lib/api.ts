
// Weather API service using WeatherAPI.com
// This could be switched to any weather API

const API_KEY = '9fc1120f386647d2b10172845252703'; // WeatherAPI.com API key
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
  sys: {
    country: string;
  };
  wind: {
    speed: number;
  };
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    // Transform WeatherAPI.com response to match our WeatherData interface
    return {
      main: {
        temp: data.current.temp_c,
        humidity: data.current.humidity,
        feels_like: data.current.feelslike_c,
      },
      weather: [
        {
          id: 800, // Default ID
          main: data.current.condition.text,
          description: data.current.condition.text,
          icon: data.current.condition.icon,
        }
      ],
      name: data.location.name,
      sys: {
        country: data.location.country,
      },
      wind: {
        speed: data.current.wind_kph / 3.6, // Convert km/h to m/s
      }
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    // Transform WeatherAPI.com response to match our WeatherData interface
    return {
      main: {
        temp: data.current.temp_c,
        humidity: data.current.humidity,
        feels_like: data.current.feelslike_c,
      },
      weather: [
        {
          id: 800, // Default ID
          main: data.current.condition.text,
          description: data.current.condition.text,
          icon: data.current.condition.icon,
        }
      ],
      name: data.location.name,
      sys: {
        country: data.location.country,
      },
      wind: {
        speed: data.current.wind_kph / 3.6, // Convert km/h to m/s
      }
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

export function getWeatherIconUrl(iconCode: string): string {
  // WeatherAPI.com provides full URLs for icons, so we use them directly
  if (iconCode.startsWith('http')) {
    return iconCode;
  }
  return iconCode; // The API already returns a full URL
}
