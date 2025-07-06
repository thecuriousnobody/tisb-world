# TISB Website Development Memory

## Project Overview
- **Name**: TISB World - Personal website for Rajeev Kumar
- **Tech Stack**: React 19 + TypeScript + Vite + Material UI
- **Hosting**: Vercel (perfect for this stack)
- **Repository**: `/Users/rajeevkumar/Documents/GIT_Repos/tisb-world`

## Design Philosophy
- **Minimalistic** Material UI design with dark theme
- **Professional** but personal branding  
- **Voice interface** integration planned (Whisper API)
- **Multi-faceted content**: Music, Blog, Code, AI startup, Podcast, Admin

## Current Architecture
- Clean component structure with Layout + Pages
- Voice interface foundation with floating mic button
- Navigation: Home, Music, Blog, Code, AI, Podcast, Admin
- Dark theme with gradient text effects

## Pages Structure
- **Home**: Landing page with feature cards
- **Music**: Musical compositions and audio experiences
- **Blog**: Technology and creative writing
- **Code**: Open source projects and experiments  
- **AI**: Startup projects and AI development
- **Podcast**: Episode management and player
- **Admin**: Backend management dashboard (future)

## Technical Details

### Current Dependencies
```json
{
  "@mui/material": "^latest",
  "@emotion/react": "^latest", 
  "@emotion/styled": "^latest",
  "@mui/icons-material": "^latest",
  "react-router-dom": "^latest"
}
```

### Theme Configuration
- Dark mode with black background
- White primary text with gradient effects
- Subtle hover animations and glass morphism
- Inter font family for clean typography

### Voice Interface Foundation
- Floating microphone FAB (bottom right)
- Voice state management in Layout component
- Prepared hooks for Whisper API integration
- Speech synthesis planning

## Future Voice Integration Plans
- **OpenAI Whisper API** for speech-to-text
- **Web Speech API** for text-to-speech
- Voice commands for navigation ("go to music", "show projects")
- Voice content interaction ("play music", "read blog post")
- **Backend integration** via Vercel Serverless Functions (Python support)

## Database Strategy
- **Supabase** for structured data + real-time features
- **Vercel KV** for caching/sessions  
- **Local development** with file-based content initially

## Development Preferences & Context
- **Minimalistic, clean code** - avoid complex abstractions
- **Material UI components** over custom CSS when possible
- **Voice-first thinking** for all future features
- **Easy backend integration** preparation
- **TypeScript strict mode** for type safety
- **Responsive design** for mobile/desktop

## Development Workflow
- React 19 + TypeScript + Vite for fast development
- Material UI for consistent, professional components
- ESLint for code quality
- Git workflow with meaningful commits
- Vercel for seamless deployment

## Voice Commands (Planned)
```
Navigation:
- "Go to [page]" / "Show [page]" / "Open [page]"
- "Go home" / "Take me home"

Content:
- "Play music" / "Show my compositions"
- "Read blog" / "Show latest posts"  
- "Show projects" / "Display code"
- "Open admin" / "Admin panel"

General:
- "Help" / "What can I do"
- "Search for [term]"
```

## Next Development Priorities
1. **Content Management** - Add actual content to pages
2. **Voice Integration** - Implement Whisper API
3. **Backend Setup** - Vercel functions + Supabase
4. **Admin Panel** - Content management interface
5. **Deployment** - Push to Vercel

## Key Decisions Made
- ✅ Material UI for components (minimalistic design)
- ✅ Dark theme with gradient text effects
- ✅ Voice interface foundation with floating FAB
- ✅ Multi-page structure reflecting personal brand
- ✅ Vercel hosting (optimal for React + future Python backend)
- ✅ Clean component architecture

## Development Notes
- All components use TypeScript for type safety
- Material UI theme customization in App.tsx
- Voice interface hooks prepared but not yet implemented
- Admin functionality structured but not yet built
- Ready for easy Vercel deployment

---
*Last updated: July 6, 2025*
*Development Status: Foundation Complete, Voice Integration Next*
