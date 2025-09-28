#!/bin/bash

# Botanic Defenders - Clean Startup Script

echo "🌱 Starting Botanic Defenders (Clean Version)..."
echo "==============================================="

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "python main.py" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Start backend
echo ""
echo "🚀 Starting Backend Server..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Start backend in background
echo "Starting FastAPI server on http://localhost:8002..."
python main.py &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Test backend
echo "Testing backend connection..."
if curl -s http://localhost:8002/health > /dev/null; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo ""
echo "🌐 Starting Frontend Server..."
cd ../frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "Starting Next.js development server on http://localhost:3000..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend to start..."
sleep 10

echo ""
echo "🎉 Botanic Defenders is now running!"
echo "=================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8002"
echo "🌱 Plant Health: http://localhost:3000/plant-health"
echo "📊 Dashboard: http://localhost:3000/dashboard"
echo ""
echo "🔐 Authentication: Enter any email and password to sign in"
echo "🛑 Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped. Goodbye!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
