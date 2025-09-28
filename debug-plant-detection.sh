#!/bin/bash

echo "🔍 Botanic Defenders - Plant Disease Detection Debug Script"
echo "=========================================================="

# Check if servers are running
echo "1. Checking if servers are running..."

# Check backend
if curl -s http://localhost:8002/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:8002"
    echo "   Health check response:"
    curl -s http://localhost:8002/health | jq . 2>/dev/null || curl -s http://localhost:8002/health
else
    echo "❌ Backend is not running on http://localhost:8002"
    echo "   Please start the backend first: cd backend && python main.py"
fi

echo ""

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is not running on http://localhost:3000"
    echo "   Please start the frontend first: cd frontend && npm run dev"
fi

echo ""

# Test API connection
echo "2. Testing API connection..."
if curl -s http://localhost:8002/ > /dev/null; then
    echo "✅ Backend API is accessible"
    echo "   API response:"
    curl -s http://localhost:8002/ | jq . 2>/dev/null || curl -s http://localhost:8002/
else
    echo "❌ Backend API is not accessible"
fi

echo ""

# Test plant health endpoint
echo "3. Testing plant health prediction endpoint..."
echo "   Testing with invalid file (should return error):"
response=$(curl -s -X POST http://localhost:8002/predict -F "file=@/dev/null" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Plant health endpoint is responding"
    echo "   Response: $response"
else
    echo "❌ Plant health endpoint is not responding"
fi

echo ""

# Test frontend API route
echo "4. Testing frontend API route..."
echo "   Testing with invalid file (should return error):"
response=$(curl -s -X POST http://localhost:3000/api/plant-health/predict -F "file=@/dev/null" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Frontend API route is responding"
    echo "   Response: $response"
else
    echo "❌ Frontend API route is not responding"
fi

echo ""

# Check processes
echo "5. Checking running processes..."
echo "   Python processes:"
ps aux | grep "python main.py" | grep -v grep || echo "   No Python backend processes found"

echo "   Node processes:"
ps aux | grep "next dev" | grep -v grep || echo "   No Next.js frontend processes found"

echo ""

# Check ports
echo "6. Checking port usage..."
echo "   Port 8002 (Backend):"
lsof -i:8002 || echo "   Port 8002 is free"

echo "   Port 3000 (Frontend):"
lsof -i:3000 || echo "   Port 3000 is free"

echo ""
echo "🔍 Debug complete!"
echo ""
echo "If you're still having issues:"
echo "1. Make sure both servers are running"
echo "2. Check the browser console for errors"
echo "3. Try uploading a valid image file (JPG, PNG, etc.)"
echo "4. Check the terminal output for any error messages"
