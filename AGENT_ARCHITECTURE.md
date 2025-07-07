# TISB World - CrewAI Agent Architecture

## Overview
This project now has a **full frontend/backend separation** with **real CrewAI agents** orchestrating tasks. The architecture mirrors your successful startup pattern with React frontend + FastAPI backend.

## Architecture

```
Frontend (React + TypeScript)          Backend (FastAPI + Python + CrewAI)
├── Voice Assistant UI                 ├── Agent Orchestrator
├── Task Chat Interface                ├── Specialized Agents
├── Progress Visualization             │   ├── Classifier Agent
└── User Confirmation Dialogs          │   ├── Research Agent
                                       │   ├── Calendar Agent
   ↕️ HTTP API calls                   │   ├── Content Creator Agent
                                       │   └── Task Coordinator Agent
                                       ├── Tools Integration
                                       │   ├── Google Search
                                       │   ├── Calendar APIs  
                                       │   ├── Email/Notion
                                       │   └── Custom Tools
                                       └── Lane Processing
                                           ├── Podcasting
                                           ├── Podcast Bots AI
                                           ├── Accelerator Work
                                           └── Miscellaneous
```

## Quick Start

### 1. Start the Backend (Terminal 1)
```bash
cd backend
./start.sh
```
This will:
- Create Python virtual environment 
- Install CrewAI and dependencies
- Start FastAPI server on http://localhost:8000
- API docs available at http://localhost:8000/docs

### 2. Start the Frontend (Terminal 2)  
```bash
# From project root
npm run dev
```
Frontend runs on http://localhost:5173

### 3. Test the Integration
1. Click the floating mic button
2. Say something like "I want to research AI podcast guests"
3. Watch the **real CrewAI agents** classify and process your request
4. See agent reasoning, confidence scores, and planned actions

## What's Actually Running

### **CrewAI Agents (Backend)**
- **Classifier Agent**: Uses LLM to intelligently categorize your voice inputs
- **Research Agent**: Can search Google, research people/topics  
- **Calendar Agent**: Manages scheduling and calendar events
- **Content Agent**: Creates content for different platforms
- **Coordinator Agent**: Orchestrates complex multi-step workflows

### **Voice Assistant (Frontend)**
- Real-time speech-to-text
- Calls backend `/api/agents/classify` endpoint
- Shows agent confidence and reasoning
- Graceful fallback to local processing if backend is down

### **API Integration**
The frontend now makes **real HTTP calls** to:
- `POST /api/agents/classify` - Classify voice updates
- `POST /api/tasks/process` - Process complex tasks  
- `POST /api/tasks/research` - Execute research tasks
- `GET /api/agents/status` - Check agent health

## Configuration

### Backend Environment (.env)
```bash
# Required for agents to work
OPENAI_API_KEY=your_openai_key_here
SERPER_API_KEY=your_serper_key_here  # For web search

# Optional
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_CALENDAR_CREDENTIALS=path/to/credentials.json
```

### Frontend Environment (.env.local)
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## Lane Processing

Each project lane now has **real agent workflows**:

### Podcasting Lane
- Research guest backgrounds
- Schedule interviews  
- Generate question lists
- Create episode outlines

### Podcast Bots AI Lane
- Market research for AI features
- Technical documentation
- Product roadmap planning
- Marketing content creation

### Accelerator Work Lane
- Partner research
- Meeting coordination
- Pitch material creation
- Progress tracking

### Miscellaneous Lane
- General research tasks
- Content creation
- Calendar management
- Note-taking

## Development Experience

This matches your startup's proven architecture:
- **Frontend**: Pure UI logic, makes API calls
- **Backend**: Business logic, agent orchestration, tool integrations
- **Separation**: Easy to test, deploy, and scale independently
- **Fallbacks**: Frontend gracefully handles backend unavailability

## Next Steps

1. **Test the basic flow** - voice → classification → lane processing
2. **Add your API keys** to see real agent intelligence  
3. **Extend tools** - Calendar, Notion, email integrations
4. **Customize agents** - Adjust personalities and capabilities for your needs
5. **Add confirmation workflows** - User approval for actions before execution

The foundation is solid and extensible - just like your successful startup! 🚀
