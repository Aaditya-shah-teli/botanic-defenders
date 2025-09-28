from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
import base64
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
import numpy as np
import os
import google.generativeai as genai
import json

app = FastAPI(title="Plant Disease Identification", description="AI-powered plant disease detection system")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBpnHNkRJvh0obVAm44_4I9y2JjHt-8rNA")
genai.configure(api_key=GEMINI_API_KEY)

# Load the model and processor
print("Loading plant disease classification model...")
try:
    processor = AutoImageProcessor.from_pretrained("linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")
    model = AutoModelForImageClassification.from_pretrained("linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    processor = None
    model = None

# Disease class mappings (you may need to adjust these based on the actual model output)
DISEASE_MAPPINGS = {
    "healthy": "Healthy Plant",
    "diseased": "Plant Disease Detected",
    "bacterial_spot": "Bacterial Spot",
    "early_blight": "Early Blight",
    "late_blight": "Late Blight",
    "leaf_mold": "Leaf Mold",
    "septoria_leaf_spot": "Septoria Leaf Spot",
    "spider_mites": "Spider Mites",
    "target_spot": "Target Spot",
    "yellow_leaf_curl_virus": "Yellow Leaf Curl Virus",
    "mosaic_virus": "Mosaic Virus"
}

def preprocess_image(image_bytes):
    """Preprocess the uploaded image for the model"""
    try:
        # Open image with PIL
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image to model's expected input size
        image = image.resize((224, 224))
        
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

def get_disease_remedy(disease_name):
    """Get disease remedy and fertilizer suggestions using Gemini API"""
    try:
        model_gemini = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        As a plant disease expert, provide detailed information about the plant disease: "{disease_name}"
        
        Please provide:
        1. Brief description of the disease
        2. Symptoms to look for
        3. Treatment options (organic and chemical)
        4. Best fertilizers to use for recovery
        5. Prevention tips
        6. Expected recovery time
        
        Format your response in a clear, professional manner suitable for farmers and gardeners.
        Keep it concise but informative (max 300 words).
        """
        
        response = model_gemini.generate_content(prompt)
        return response.text if response.text else "Treatment information not available at this time."
    
    except Exception as e:
        print(f"Gemini API error: {str(e)}")
        return f"Treatment recommendations: For {disease_name}, consult with a local agricultural expert or plant pathologist for specific treatment options. General recommendations include proper watering, adequate sunlight, and maintaining good plant hygiene."

def predict_disease(image):
    """Predict plant disease from image"""
    if model is None or processor is None:
        raise HTTPException(status_code=500, detail="Model not loaded properly")
    
    try:
        # Process the image
        inputs = processor(images=image, return_tensors="pt")
        
        # Get predictions
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits[0], dim=-1)
        
        # Get top predictions
        top_predictions = torch.topk(predictions, 3)
        
        results = []
        for i in range(3):
            class_id = top_predictions.indices[i].item()
            confidence = top_predictions.values[i].item()
            
            # Get class name from model's config
            class_name = model.config.id2label.get(class_id, f"Class_{class_id}")
            
            # Map to user-friendly name
            friendly_name = DISEASE_MAPPINGS.get(class_name.lower(), class_name.replace('_', ' ').title())
            
            results.append({
                "disease": friendly_name,
                "confidence": round(confidence * 100, 2),
                "class_id": class_id
            })
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

@app.post("/predict")
async def predict_plant_disease(file: UploadFile = File(...)):
    """Predict plant disease from uploaded image"""
    
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Preprocess image
        processed_image = preprocess_image(image_bytes)
        
        # Get predictions
        predictions = predict_disease(processed_image)
        
        # Get remedy information for the top prediction
        top_disease = predictions[0]["disease"]
        remedy_info = get_disease_remedy(top_disease)
        
        # Convert image to base64 for display
        img_buffer = io.BytesIO()
        processed_image.save(img_buffer, format='JPEG')
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        
        return {
            "success": True,
            "predictions": predictions,
            "remedy_info": remedy_info,
            "image": f"data:image/jpeg;base64,{img_base64}",
            "filename": file.filename
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None and processor is not None
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Plant Disease Identification API", "status": "running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
