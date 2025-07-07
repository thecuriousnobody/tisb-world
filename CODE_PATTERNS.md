# Key Code Patterns for New Repository

## 🎯 Critical Code Patterns to Replicate

### 1. LLM Configuration Pattern
```python
# config/llm_config.py
from crewai import LLM
import os

class LLMConfig:
    def has_valid_api_keys(self) -> bool:
        return any([
            os.getenv("OPENAI_API_KEY"),
            os.getenv("ANTHROPIC_API_KEY")
        ])
    
    def get_llm_config(self):
        if openai_key := os.getenv("OPENAI_API_KEY"):
            return {
                "llm": {
                    "model": "gpt-4",
                    "api_key": openai_key,
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
            }
        # Add other providers...
        return None

# Initialize LLM
llm_params = llm_config.get_llm_config()["llm"]
self.llm = LLM(
    model=llm_params["model"],
    api_key=llm_params["api_key"],
    temperature=llm_params.get("temperature", 0.7),
    max_tokens=llm_params.get("max_tokens", 2000)
)
```

### 2. Agent Creation Pattern
```python
# Always inject LLM into agents
def _create_agent(self) -> Agent:
    agent_config = {
        'role': 'Agent Role',
        'goal': 'Agent Goal',
        'backstory': 'Agent Background',
        'tools': [],
        'verbose': True,
        'allow_delegation': False
    }
    
    # Critical: Add LLM if available
    if self.llm:
        agent_config['llm'] = self.llm
        
    return Agent(**agent_config)
```

### 3. Task Execution Pattern
```python
# Standard CrewAI task execution
async def execute_task(self, input_data: str) -> Dict[str, Any]:
    task = Task(
        description=f"Process: {input_data}",
        agent=self.agent,
        expected_output="Structured response"
    )
    
    crew = Crew(
        agents=[self.agent],
        tasks=[task],
        verbose=True,
        process=Process.sequential
    )
    
    try:
        result = crew.kickoff()
        # Handle JSON parsing if needed
        if isinstance(result, str):
            import json
            return json.loads(result)
        return result
    except Exception as e:
        logger.error(f"Task execution error: {e}")
        # Return fallback response
        return {"error": str(e), "fallback": True}
```

### 4. FastAPI Route Pattern
```python
# routes/agents.py
from fastapi import APIRouter, HTTPException
from ..agents.orchestrator import orchestrator

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/classify")
async def classify_update(request: dict):
    try:
        transcript = request.get("transcript", "")
        result = await orchestrator.classify_update(transcript)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 5. Environment Configuration
```bash
# .env.example
# LLM API Keys (choose one or more)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# External Tool APIs
SERPER_API_KEY=your_serper_key_here
NOTION_API_KEY=your_notion_key_here
GOOGLE_CALENDAR_API_KEY=your_calendar_key_here

# Server Configuration
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
```

### 6. Requirements.txt
```
fastapi==0.104.1
uvicorn==0.24.0
crewai==0.140.0
crewai-tools==0.49.0
python-dotenv==1.0.0
pydantic==2.5.0
python-multipart==0.0.6
```

## 🎯 Next Implementation Priorities

### 1. Streaming Response Pattern
```python
# For streaming LLM responses
from fastapi.responses import StreamingResponse
import json

@router.post("/stream-task")
async def stream_task_execution(request: dict):
    async def generate_stream():
        # Implement streaming logic
        for chunk in agent_response_stream:
            yield f"data: {json.dumps(chunk)}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/plain"
    )
```

### 2. Pydantic Models Pattern
```python
# models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class ProjectLane(str, Enum):
    PODCASTING = "podcasting"
    PODCAST_BOTS_AI = "podcast-bots-ai"
    ACCELERATOR_WORK = "accelerator-work"
    MISCELLANEOUS = "miscellaneous"

class ClassificationResult(BaseModel):
    lane: ProjectLane
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str
    suggested_actions: List[str] = []

class TaskExecutionRequest(BaseModel):
    user_input: str
    lane: Optional[ProjectLane] = None
    require_confirmation: bool = True
```

### 3. Tool Integration Framework
```python
# tools/base_tool.py
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseTool(ABC):
    @abstractmethod
    async def execute(self, **kwargs) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        pass

# tools/notion_tool.py
class NotionTool(BaseTool):
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    async def execute(self, action: str, **kwargs) -> Dict[str, Any]:
        # Implement Notion API calls
        pass
```

## 🚧 Development Workflow

### 1. Set up new repository structure:
```
automation-backend/
├── agents/          # CrewAI agents
├── tools/           # External API integrations  
├── config/          # Configuration management
├── routes/          # FastAPI endpoints
├── models/          # Pydantic schemas
├── tests/           # Test suite
└── main.py          # Server entry point
```

### 2. Copy core patterns from TISB World backend
### 3. Implement streaming and Pydantic models
### 4. Add tool integrations one by one
### 5. Test with TISB World frontend
### 6. Integrate back to main service

This should give you a solid foundation to continue development with all the context preserved!
