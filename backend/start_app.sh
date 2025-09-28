#!/bin/bash

echo "🌱 Starting Plant Disease Identification App with Gemini AI..."
echo "=========================================================="

# Kill any existing processes on port 8002
echo "Cleaning up existing processes..."
lsof -ti:8002 | xargs kill -9 2>/dev/null || true
sleep 2

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Start the application
echo "🚀 Starting server on http://localhost:8002"
echo "📱 Backend API will be available at: http://localhost:8002"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

python main.py
