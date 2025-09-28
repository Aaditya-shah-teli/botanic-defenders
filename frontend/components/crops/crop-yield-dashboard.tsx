"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  Search,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

interface CropRecommendation {
  crops: string;
  tips: string;
  color: string;
}

export function CropYieldDashboard() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cropRecommendation, setCropRecommendation] = useState<CropRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationNotFound, setLocationNotFound] = useState(false);

  const getCropRecommendation = (temp: number): CropRecommendation => {
    if (temp <= 10) {
      return {
        crops: "Kale, Spinach, Cabbage, Carrots, Radish",
        tips: "Protect your crops from frost and ensure proper drainage.",
        color: "text-blue-600",
      };
    } else if (temp <= 20) {
      return {
        crops: "Lettuce, Peas, Broccoli, Onions, Strawberries",
        tips: "Good weather for planting cool-season crops. Water consistently.",
        color: "text-green-600",
      };
    } else if (temp <= 30) {
      return {
        crops: "Tomatoes, Corn, Peppers, Mangoes, Bananas",
        tips: "Ensure crops are watered adequately to prevent heat stress.",
        color: "text-orange-600",
      };
    } else if (temp <= 40) {
      return {
        crops: "Okra, Watermelon, Papaya, Guava, Dates",
        tips: "Extreme heat; irrigation and shade for crops are essential.",
        color: "text-red-600",
      };
    } else {
      return {
        crops: "Extreme temperatures; focus on drought-resistant crops.",
        tips: "Monitor your crops closely, and provide shade where needed.",
        color: "text-red-800",
      };
    }
  };

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError("");
    setLocationNotFound(false);

    try {
      const apiKey = "9ef94a95f4475ff3f3558ad3ea74295b";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "404") {
        setLocationNotFound(true);
        setWeatherData(null);
        setCropRecommendation(null);
        return;
      }

      const temp = Math.round(data.main.temp - 273.15);
      const weather: WeatherData = {
        temperature: temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        location: data.name,
      };

      setWeatherData(weather);
      setCropRecommendation(getCropRecommendation(temp));
      setLocationNotFound(false);
    } catch (error) {
      setError("Failed to fetch weather data. Please try again.");
      setWeatherData(null);
      setCropRecommendation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (location.trim()) {
      fetchWeatherData(location.trim());
    } else {
      setError("Please enter a city name.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container className="pt-20 pb-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-foreground">
          🌱 Botanic Defenders
        </h1>
        <p className="text-xl text-muted-foreground">
          Agricultural Weather Insights & Crop Yield Optimization
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Enter Your Location
            </CardTitle>
            <CardDescription>
              Get agricultural weather insights and crop recommendations for your area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your city or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {locationNotFound && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Location not found! Please try again.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Weather and Crop Information */}
      {weatherData && cropRecommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Weather Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Thermometer className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {weatherData.temperature}°C
                </div>
                <p className="text-sm text-muted-foreground">Temperature</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Cloud className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-lg font-semibold capitalize">
                  {weatherData.description}
                </div>
                <p className="text-sm text-muted-foreground">Condition</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Droplets className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {weatherData.humidity}%
                </div>
                <p className="text-sm text-muted-foreground">Humidity</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Wind className="w-8 h-8 text-gray-500" />
                </div>
                <div className="text-3xl font-bold text-gray-600">
                  {weatherData.windSpeed} km/h
                </div>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
              </CardContent>
            </Card>
          </div>

          {/* Crop Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Best Crops for This Temperature
                </CardTitle>
                <CardDescription>
                  Recommended crops based on current weather conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn("text-lg font-semibold mb-2", cropRecommendation.color)}>
                  {cropRecommendation.crops}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  Optimal growing conditions detected
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Agricultural Tips
                </CardTitle>
                <CardDescription>
                  Expert recommendations for your crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-base text-foreground mb-2">
                  {cropRecommendation.tips}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  Based on current weather analysis
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Info */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 text-center">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium">
                  Weather data for {weatherData.location}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Choose Botanic Defenders?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Weather</h3>
              <p className="text-sm text-muted-foreground">
                Get accurate weather data and crop recommendations based on current conditions
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered crop suggestions tailored to your local climate and soil conditions
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Maximize Yield</h3>
              <p className="text-sm text-muted-foreground">
                Optimize your farming decisions with data-driven insights and expert tips
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Container>
  );
}
