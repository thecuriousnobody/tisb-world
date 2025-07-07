#!/bin/bash

# TISB World Backend Startup Script

echo "🚀 Starting TISB World Backend..."

# Check if we're in the backend directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists, create from example if not
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys before running agents"
fi

# Start the FastAPI server
echo "🌟 Starting FastAPI server on http://localhost:8000"
echo "📖 API documentation will be available at http://localhost:8000/docs"
echo "🔗 Frontend should point to http://localhost:8000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
