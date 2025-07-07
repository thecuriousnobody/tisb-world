from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum

class LaneType(str, Enum):
    PODCASTING = "podcasting"
    PODCAST_BOTS_AI = "podcast-bots-ai"
    ACCELERATOR_WORK = "accelerator-work"
    MISCELLANEOUS = "miscellaneous"

class TaskStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    WAITING_CONFIRMATION = "waiting_confirmation"
    COMPLETED = "completed"
    FAILED = "failed"

class AgentType(str, Enum):
    CLASSIFIER = "classifier"
    RESEARCHER = "researcher"
    CALENDAR_MANAGER = "calendar_manager"
    CONTENT_CREATOR = "content_creator"
    TASK_COORDINATOR = "task_coordinator"

# Request/Response Models
class ProcessUpdateRequest(BaseModel):
    transcript: str
    lane: Optional[LaneType] = None

class ClassificationResult(BaseModel):
    lane: LaneType
    confidence: float
    reasoning: str

class TaskRequest(BaseModel):
    user_input: str
    context: Optional[Dict[str, Any]] = None

class AgentAction(BaseModel):
    agent_type: AgentType
    action: str
    parameters: Dict[str, Any]
    requires_confirmation: bool = False

class TaskStep(BaseModel):
    step_id: str
    description: str
    agent_actions: List[AgentAction]
    status: TaskStatus
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class TaskResponse(BaseModel):
    task_id: str
    status: TaskStatus
    current_step: Optional[TaskStep] = None
    all_steps: List[TaskStep] = []
    final_result: Optional[Dict[str, Any]] = None

class ConfirmationRequest(BaseModel):
    task_id: str
    step_id: str
    action_approved: bool
    user_notes: Optional[str] = None
