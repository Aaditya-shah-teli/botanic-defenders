#!/bin/bash

# Botanic Defenders Backend Startup Script

echo "🌱 Starting Botanic Defenders Backend..."
echo "=============================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Start the application
echo "Starting FastAPI server..."
echo "🌐 Backend API will be available at: http://localhost:8002"
echo "📱 Plant Disease API endpoint: http://localhost:8002/predict"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

python main.py
