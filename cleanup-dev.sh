#!/bin/bash

echo "🧹 TISB Development Environment Cleanup"
echo "======================================"

# Kill all Node/Vite processes
echo "📍 Stopping all Node processes..."
pkill -f node 2>/dev/null || true
pkill -f vite 2>/dev/null || true

# Clear specific port
echo "📍 Clearing port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Clear node_modules cache
echo "📍 Clearing Vite cache..."
rm -rf node_modules/.vite 2>/dev/null || true

# Clear any lock files
echo "📍 Removing lock files..."
rm -f ./*.lock 2>/dev/null || true
rm -f ./.*lock* 2>/dev/null || true

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "You can now start the dev server with:"
echo "  npm run start"
echo "  or"
echo "  node dev-server.js"