#!/usr/bin/env python3
"""
Test script for Gemini API integration
"""

import google.generativeai as genai

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyBpnHNkRJvh0obVAm44_4I9y2JjHt-8rNA"
genai.configure(api_key=GEMINI_API_KEY)

def test_gemini_api():
    """Test the Gemini API with a sample plant disease query"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = """
        As a plant disease expert, provide detailed information about the plant disease: "Bacterial Spot"
        
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
        
        print("🧪 Testing Gemini API...")
        print("=" * 50)
        
        response = model.generate_content(prompt)
        
        print("✅ Gemini API is working!")
        print("\n📋 Sample Response:")
        print("-" * 30)
        print(response.text)
        
        return True
        
    except Exception as e:
        print(f"❌ Gemini API test failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_gemini_api()
