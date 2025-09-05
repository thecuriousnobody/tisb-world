#!/bin/bash

# Kill any existing processes on port 5173
echo "Cleaning up port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Wait a moment for port to be released
sleep 1

# Start the dev server
echo "Starting development server..."
npm run dev