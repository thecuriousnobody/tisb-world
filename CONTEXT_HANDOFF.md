# Context Handoff for CrewAI Agentic Backend

## 🎯 Project Overview
Building a CrewAI-powered agentic backend for TISB World voice assistant system. This is being extracted to a separate automation/experimentation repository for focused development.

## 🏗️ Current Architecture State

### Frontend (TISB World - Completed ✅)
- **React + TypeScript + Material UI** frontend
- **Voice Assistant Component** with floating mic button
- **Real-time speech-to-text** using Web Speech API
- **Lane Classification System** for routing updates to project lanes:
  - Podcasting (content creation)
  - Podcast Bots AI (startup development)
  - Accelerator Work (consulting)
  - Miscellaneous (general tasks)

### Backend Foundation (Basic FastAPI + CrewAI ✅)
- **FastAPI server** on port 8000
- **CrewAI orchestration** with 5 specialized agents:
  - **Classifier Agent**: Categorizes user inputs into lanes
  - **Researcher Agent**: Web research and information gathering
  - **Calendar Agent**: Schedule and calendar management
  - **Content Agent**: Content creation and editing
  - **Coordinator Agent**: Multi-step task coordination
- **LLM Configuration**: Supports OpenAI, Anthropic, with fallback handling
- **API Routes**: `/agents/`, `/tasks/`, `/lanes/` endpoints

### Current Workflow
```
User Voice → Speech-to-Text → Classification → Agent Orchestration → Tool Execution
```

## 🎯 Next Development Goals

### Core Features to Build
1. **LLM Streaming Responses** - Real-time agent output
2. **Structured LLM Calls** - Using Pydantic models for reliable parsing
3. **Tool Integration Framework** - Connect to external APIs
4. **User Confirmation Workflows** - Before executing actions
5. **Event Streaming** - Real-time progress updates

### Agent Enhancement Priorities
1. **Classifier Agent**: Improve accuracy, confidence scoring
2. **Tool Selection Agent**: Map updates to specific APIs
3. **Execution Agent**: Handle API calls with auth & rate limiting
4. **Feedback Agent**: Learn from user corrections

### Tool Integration Targets
- **Notion**: Database updates, page creation
- **Google Calendar**: Event scheduling  
- **GitHub**: Issue creation, project updates
- **Slack/Discord**: Team notifications
- **Analytics**: Custom metrics tracking

## 🛠️ Technical Decisions Made

### LLM Configuration
- Configured to work with multiple providers (OpenAI, Anthropic, etc.)
- Environment-based API key management
- Graceful fallback when no API keys available
- Temperature: 0.7, Max tokens: 2000

### CrewAI Setup
- Latest versions: CrewAI 0.140.0, crewai-tools 0.49.0
- All agents initialized with LLM injection
- Sequential process with verbose logging
- Task history tracking with UUIDs

### API Architecture
- RESTful endpoints for classification, task processing, research
- Async/await patterns throughout
- Proper error handling and logging
- CORS enabled for frontend integration

## 🔗 Key Integration Points

### Frontend → Backend Communication
```typescript
// AgentAPI.ts - Main service class
await AgentAPI.classifyUpdate(transcript) // Lane classification
await AgentAPI.processTask(userInput, lane) // Task orchestration
await AgentAPI.executeResearch(query) // Research tasks
```

### Agent Orchestration Flow
```python
# orchestrator.py - Core workflow
1. classify_update() → Determines project lane
2. process_task() → Creates coordination plan
3. execute_research_task() → Handles research needs
```

## 📝 Code Organization

### Frontend Structure (TISB World)
```
src/
├── components/VoiceAssistant.tsx     # Main UI component
├── hooks/useSpeechRecognition.ts     # Speech-to-text logic
├── services/AgentAPI.ts              # Backend communication
└── services/Lane*Service.ts          # Project lane handlers
```

### Backend Structure (FastAPI)
```
backend/
├── main.py                           # FastAPI server
├── agents/orchestrator.py            # CrewAI orchestration
├── config/llm_config.py             # LLM configuration
├── routes/                          # API endpoints
└── models/schemas.py                # Pydantic models
```

## 🚧 Known Limitations & Next Steps

### Current Limitations
- No real tool integrations (placeholder API calls)
- Basic keyword-based classification
- No streaming responses
- No user confirmation workflows
- No persistent task state

### Immediate Next Steps
1. **Set up streaming infrastructure** for real-time responses
2. **Add Pydantic models** for structured LLM outputs
3. **Implement tool framework** for external API integration
4. **Add confirmation workflows** before executing actions
5. **Create event system** for real-time progress updates

## 💡 Context for New Development

### What's Working Well
- Frontend voice interface is polished and functional
- Backend agent structure is solid and extensible
- LLM configuration is flexible and robust
- API contracts are well-defined

### Key Design Principles Established
- **Modular architecture** - Easy to add new agents/tools
- **TypeScript + Python** - Strong typing throughout
- **Environment-driven config** - Easy deployment
- **User-centric workflow** - Confirmation before actions

### Development Approach
- **Proof-of-concept first** - Get core features working
- **Incremental integration** - Add tools one by one
- **User feedback driven** - Test with real workflows
- **Documentation heavy** - Everything well documented

## 🎯 Specific Technical Context

### CrewAI Patterns Used
```python
# Agent creation with LLM injection
agent = Agent(
    role='...',
    goal='...',
    backstory='...',
    llm=self.llm,  # Critical: LLM injection
    tools=[],
    verbose=True
)

# Task execution with crew
crew = Crew(
    agents=[agent],
    tasks=[task],
    process=Process.sequential
)
result = crew.kickoff()
```

### Error Patterns to Watch
- CrewAI import issues (use latest versions)
- LLM initialization failures (graceful fallback)
- JSON parsing errors (add validation)
- API rate limiting (implement backoff)

This document should provide comprehensive context for continuing development in the new repository while maintaining all the architectural decisions and technical context we've established.
