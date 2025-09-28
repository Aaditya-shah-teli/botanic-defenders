"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Search,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Info,
  Brain,
  Clock,
  Smartphone,
  Loader2,
  X,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface Prediction {
  disease: string;
  confidence: number;
  class_id: number;
}

interface AnalysisResult {
  success: boolean;
  predictions: Prediction[];
  remedy_info: string;
  image: string;
  filename: string;
}

export default function PlantHealthPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError("");
      setResults(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/plant-health/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
      } else {
        setError("Failed to analyze image. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResults(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="pt-20 pb-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <Leaf className="w-10 h-10 text-green-600" />
            Plant Disease AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Advanced AI-powered plant disease identification system
          </p>
        </motion.div>

        {/* Main Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Upload Plant Image</CardTitle>
              <CardDescription>
                Upload a clear image of your plant to get instant disease identification and treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer",
                  dragOver
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                  selectedFile && "border-green-500 bg-green-50 dark:bg-green-950/20"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-600">
                        Image Selected
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        Drag & drop your plant image here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse files
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || loading}
                  className="min-w-[200px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze Plant Disease
                    </>
                  )}
                </Button>
                
                {selectedFile && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Image Preview */}
              {previewUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Selected Image:</h3>
                  <div className="flex justify-center">
                    <img
                      src={previewUrl}
                      alt="Selected plant"
                      className="max-w-full max-h-64 rounded-lg shadow-lg border"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Image Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Analyzed Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img
                    src={results.image}
                    alt="Analyzed plant"
                    className="max-w-full max-h-96 rounded-lg shadow-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>Disease Analysis Results</CardTitle>
                <CardDescription>
                  AI-powered analysis of your plant image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border-l-4",
                      index === 0
                        ? "border-l-red-500 bg-red-50 dark:bg-red-950/20"
                        : "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {index === 0 ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Info className="w-5 h-5 text-blue-600" />
                        )}
                        <h3 className="font-semibold text-lg">
                          {prediction.disease}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-lg font-bold", getConfidenceColor(prediction.confidence))}>
                          {prediction.confidence}%
                        </div>
                        <div className="text-sm text-muted-foreground">confidence</div>
                      </div>
                    </div>
                    
                    {/* Confidence Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={cn("h-2 rounded-full transition-all duration-500", getConfidenceBg(prediction.confidence))}
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Confidence Alert */}
                {results.predictions[0] && (
                  <Alert className={results.predictions[0].confidence > 70 ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"}>
                    {results.predictions[0].confidence > 70 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <AlertDescription>
                      {results.predictions[0].confidence > 70 ? (
                        <>
                          <strong>High Confidence Detection:</strong> Our AI has identified{" "}
                          <strong>{results.predictions[0].disease}</strong> with{" "}
                          {results.predictions[0].confidence}% confidence.
                        </>
                      ) : (
                        <>
                          <strong>Low Confidence Detection:</strong> The analysis shows uncertain results. 
                          Please try with a clearer image or consult with a plant specialist for accurate diagnosis.
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Treatment Recommendations */}
            {results.remedy_info && (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Treatment & Fertilizer Recommendations
                  </CardTitle>
                  <CardDescription>
                    Expert advice for treating your plant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed">
                      {results.remedy_info}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
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
            Why Choose Our Plant Disease AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced machine learning models trained on thousands of plant disease images
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Get accurate disease identification in seconds with detailed confidence scores
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Mobile Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  Works perfectly on all devices - desktop, tablet, and mobile
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
