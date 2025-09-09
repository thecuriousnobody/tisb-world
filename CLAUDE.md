# CLAUDE.md - Project Knowledge Base

This document serves as a comprehensive guide for Claude agents working on the TISB (The Idea Sandbox) project. It contains critical information about the codebase, architecture, deployment, and known issues.

## 🚀 Project Overview

TISB is a brutalist-designed portfolio website showcasing music, podcasts, blog posts, and creative work with secure API integrations. Built with React/Vite and deployed on Vercel.

### Key URLs
- **Production**: https://tisb-world.vercel.app
- **Local Dev**: http://localhost:4444 (production build with API proxies)
- **Vite Dev**: http://localhost:3000 (development server - use sparingly)

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Library**: Material-UI (MUI) with brutalist custom styling
- **State Management**: React hooks + Context API
- **Routing**: React Router

### Backend/API Architecture
- **Production**: Vercel Serverless Functions (`/api/` folder)
- **Local Development**: Express server (`simple-server.js` on port 4444)
- **Content Service**: Centralized content fetching with 30-minute caching
- **Security**: All API keys stored server-side, no client-side exposure

## 📁 Critical File Locations

### Core Services
- `src/services/contentService.ts` - Main content fetching logic with caching
- `src/hooks/useContent.ts` - React hooks for content consumption
- `simple-server.js` - Local development server with API proxies

### Serverless Functions (Vercel)
- `api/substack/posts.js` - Substack RSS feed proxy
- `api/spotify/releases.js` - Spotify API proxy  
- `api/youtube/videos.js` - YouTube API proxy

### UI Components
- `src/pages/Blog.tsx` - Blog page using Substack content
- `src/pages/Music.tsx` - Music page using Spotify content
- `src/components/BrutalistBlogGrid.tsx` - Blog post display component

### Configuration
- `vercel.json` - Vercel deployment configuration
- `.env` - Local environment variables (gitignored)
- `.env.example` - Template for required environment variables
- `package.json` - Dependencies and build scripts

## 🔑 Environment Variables

### Required API Keys (stored in Vercel dashboard)
```
YOUTUBE_API_KEY=your_youtube_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id  
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Local Development
Copy `.env.example` to `.env` and fill in your API keys for local testing.

## 🚀 Development Workflow

### Starting Local Development
```bash
# Install dependencies
npm install

# Start local development server (PREFERRED)
npm run serve

# Alternative: Vite dev server (use sparingly)
npm run dev
```

### Building and Deploying
```bash
# Build for production
npm run build

# Deploy to Vercel (automatic on push to main)
git push origin main
```

### Testing Commands
```bash
# Test all API endpoints locally
curl http://localhost:4444/api/substack/posts
curl http://localhost:4444/api/spotify/releases  
curl http://localhost:4444/api/youtube/videos

# Test Vercel endpoints
curl https://tisb-world.vercel.app/api/substack/posts
curl https://tisb-world.vercel.app/api/spotify/releases
curl https://tisb-world.vercel.app/api/youtube/videos
```

## 🔧 Content Integration Details

### Substack Integration
- **Method**: RSS feed parsing (no official API exists)
- **URL**: `https://thecuriousnobody.substack.com/feed`
- **Features**: Enhanced thumbnail extraction (4 different methods)
- **Caching**: 30 minutes client-side + localStorage persistence

### Spotify Integration  
- **Method**: Client Credentials OAuth flow
- **Artist ID**: `2fEAGWgz0y6MdIpvIywp1R` (The Curious Nobody)
- **Returns**: Albums and singles with metadata
- **Rate Limiting**: Handled by Spotify's built-in limits

### YouTube Integration
- **Method**: YouTube Data API v3
- **Channel ID**: `UC_pKSnd_emg2JJMDGJpwZnQ`
- **Returns**: 50 most recent videos with thumbnails
- **Quota**: 10,000 units/day (monitor usage)

### Behance Integration
- **Method**: GitHub Actions scraper with fallback data
- **Schedule**: Updates automatically via GitHub Actions
- **Fallback**: Hardcoded portfolio items when scraper fails

## 🐛 Known Issues & Solutions

### Common Problems

#### "NO POSTS AVAILABLE" or "NO RELEASES AVAILABLE"
**Cause**: Browser caching old frontend code
**Solution**: Hard refresh (Cmd+Shift+R) or test on mobile/incognito

#### Local Development Server Issues
**Cause**: Port conflicts or environment variables missing
**Solution**: 
- Use port 4444 (production build) instead of 3000 (dev server)
- Ensure `.env` file exists with valid API keys
- Restart server: `npm run serve`

#### Vercel Deployment Issues
**Cause**: Environment variables not configured or build failures
**Solution**:
- Verify all 3 API keys are set in Vercel dashboard
- Check Vercel function logs for errors
- Force redeploy by pushing any small change

### Security Notes
- **Never commit API keys**: All keys are server-side only
- **CORS handled**: All endpoints include proper CORS headers
- **No VITE_ prefixed vars**: Removed to prevent client-side exposure

## 🔄 Content Caching System

The `ContentService` implements a sophisticated caching mechanism:
- **Duration**: 30 minutes per platform
- **Storage**: Both memory cache and localStorage
- **Fallback**: Graceful degradation when APIs fail
- **Retry Logic**: Automatic fallback to alternative methods

## 📊 Performance Considerations

### Bundle Size
- Current build: ~688KB (gzipped: ~211KB)
- Consider code splitting for further optimization
- Large bundle warning is acceptable for now

### API Rate Limits
- **Spotify**: No explicit limits (reasonable use)
- **YouTube**: 10,000 quota units/day
- **Substack**: RSS feed has no official limits

## 🚀 Deployment Pipeline

### Automatic Deployment
1. Push to `main` branch triggers Vercel deployment
2. Vercel builds React app using `npm run build`
3. Serverless functions in `/api/` are automatically deployed
4. Static files served via Vercel's CDN

### Manual Deployment Verification
```bash
# Check all endpoints are responding
curl -s https://tisb-world.vercel.app/api/substack/posts | head -5
curl -s https://tisb-world.vercel.app/api/spotify/releases | jq '.items | length'
curl -s https://tisb-world.vercel.app/api/youtube/videos | jq '.items | length'
```

## 🎨 Design System

### Brutalist Design Principles
- Bold typography with high contrast
- Minimal color palette (primarily black/white)
- Geometric layouts with sharp edges
- Functional over decorative elements

### Key Components
- `BrutalistBlogGrid` - Main content grid with hover effects
- `SocialSection` - Social media links and contact info
- Custom MUI theme with brutalist overrides

## 📝 Content Management

### Adding New Content
1. **Substack**: Publish on Substack - automatically appears
2. **Spotify**: Release music - automatically appears within 30min
3. **YouTube**: Upload video - automatically appears
4. **Behance**: Update portfolio - syncs via GitHub Actions

### Manual Content Updates
If needed to manually refresh content, clear browser cache or wait 30 minutes for cache expiration.

## 🔗 External Dependencies

### Critical Services
- **Vercel**: Hosting and serverless functions
- **Substack**: Blog content via RSS
- **Spotify Web API**: Music releases
- **YouTube Data API v3**: Video content
- **GitHub Actions**: Behance scraping automation

### Monitoring
- Check Vercel function logs for API errors
- Monitor API quota usage (especially YouTube)
- GitHub Actions status for Behance updates

## 💡 Future Improvements

### Planned Features
- Analytics integration
- SEO optimization
- Progressive Web App features
- Advanced content filtering/search

### Performance Optimizations  
- Implement lazy loading for images
- Add service worker for offline functionality
- Optimize bundle splitting
- Implement server-side rendering

---

## 📞 Emergency Procedures

### If Site is Down
1. Check Vercel dashboard for deployment failures
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check GitHub Actions for Behance scraper issues
5. Review recent commits for breaking changes

### If APIs are Failing
1. Test endpoints directly with curl
2. Check API key validity and quotas
3. Review server function logs in Vercel
4. Verify CORS configuration
5. Check for API provider outages

---

*Last Updated: 2025-01-09*
*Status: All systems operational ✅*