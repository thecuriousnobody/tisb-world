# TISB - The Idea Sandbox

A brutalist-designed portfolio website showcasing music, podcasts, blog posts, and creative work.

## 🚀 Quick Start

### One-Command Start
```bash
npm run start
```

This will automatically:
- Clean up any existing processes on port 5173
- Start the Vite development server
- Display helpful information and URLs

### Alternative Methods
```bash
# Using the Node script directly
node dev-server.js

# Traditional Vite command
npm run dev
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tisb-world.git
cd tisb-world
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

4. Open your browser to `http://localhost:5173`

## 🎯 Key Pages

- **Home**: `http://localhost:5173/` - Main landing page
- **Blog**: `http://localhost:5173/blog` - Brutalist blog grid from Substack
- **Podcast**: `http://localhost:5173/podcast` - YouTube video grid
- **Music**: `http://localhost:5173/music` - Music portfolio
- **Timeline**: `http://localhost:5173/timeline` - Chronological content view

## 🔧 Troubleshooting

### Port 5173 Already in Use

Run the cleanup script:
```bash
./cleanup-dev.sh
```

Or manually kill the process:
```bash
lsof -ti:5173 | xargs kill -9
```

### Development Server Won't Start

1. **Check for syntax errors**: Look for TypeScript/JavaScript errors in the console
2. **Clear cache**: 
   ```bash
   rm -rf node_modules/.vite
   npm install
   ```
3. **Check Node version**: Ensure you're using Node.js v16+
   ```bash
   node --version
   ```

### Page Not Loading

1. **Hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
2. **Check browser console**: Look for any JavaScript errors
3. **Disable browser extensions**: Try in incognito/private mode

### Changes Not Reflecting

1. Vite has hot module replacement (HMR) - saves should auto-reload
2. If HMR fails, manually refresh the page
3. For persistent issues, restart the dev server

## 🏗️ Project Structure

```
tisb-world/
├── src/
│   ├── components/         # React components
│   │   ├── BrutalistVideoGrid.tsx
│   │   ├── BrutalistBlogGrid.tsx
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Blog.tsx
│   │   ├── Podcast.tsx
│   │   └── ...
│   ├── services/          # API services
│   │   └── contentService.ts
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
├── index.html            # Entry HTML
└── vite.config.ts        # Vite configuration
```

## 🎨 Features

- **Brutalist Design**: Bold typography, harsh shadows, asymmetric layouts
- **Dynamic Content**: Pulls from YouTube RSS and Substack feeds
- **Responsive**: Mobile-first design approach
- **Performance**: Lazy loading, caching, and optimized images
- **Interactive**: Hover effects, animations, and smooth transitions

## 📦 Available Scripts

```bash
# Start development server with auto-cleanup
npm run start

# Start development server (standard)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Clean development environment
./cleanup-dev.sh
```

## 🐛 Common Issues & Solutions

### "Expected ')' but found 'catch'" Error
This is a syntax error in the TypeScript files. Check the file mentioned in the error and look for mismatched brackets.

### CORS Errors
The app uses multiple CORS proxy fallbacks. If all fail, the content service will return empty results gracefully.

### Slow Initial Load
First visit fetches data from external sources. Subsequent visits use:
- 30-minute memory cache
- localStorage persistence
- Browser HTTP cache

## 🚀 Performance Tips

1. **Initial Load**: First visit may take 2-3 seconds to fetch external content
2. **Caching**: Content is cached for 30 minutes to improve performance
3. **Lazy Loading**: Images load only when visible to save bandwidth
4. **Load More**: Videos and posts load in batches to improve initial render

## 💻 Development Tips

1. **Auto-reload**: Vite provides fast HMR - just save your files
2. **TypeScript**: Full TypeScript support with type checking
3. **React DevTools**: Install browser extension for component debugging
4. **Network Tab**: Monitor API calls and loading performance

## 📧 Support

For issues or questions, contact: rajeev@theideasandbox.com
