from fastapi import APIRouter, HTTPException
from typing import List
import logging

from models.schemas import TaskRequest, TaskResponse, ConfirmationRequest
from agents.orchestrator import orchestrator

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/process", response_model=TaskResponse)
async def process_task(request: TaskRequest):
    """Process a complex task using the agent crew"""
    try:
        task_id = await orchestrator.process_task(
            user_input=request.user_input,
            lane=request.context.get("lane") if request.context else None
        )
        
        # Get the initial task status
        task_status = orchestrator.get_task_status(task_id)
        
        return TaskResponse(
            task_id=task_id,
            status="processing",
            current_step=None,  # Will be populated as task progresses
            all_steps=[],
            final_result=task_status
        )
    except Exception as e:
        logger.error(f"Task processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task_status(task_id: str):
    """Get the status of a specific task"""
    task_status = orchestrator.get_task_status(task_id)
    
    if not task_status:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return TaskResponse(
        task_id=task_id,
        status=task_status.get("status", "unknown"),
        current_step=None,
        all_steps=[],
        final_result=task_status
    )

@router.get("/")
async def list_tasks():
    """List all active tasks"""
    return {
        "tasks": orchestrator.list_active_tasks()
    }

@router.post("/confirm")
async def confirm_action(request: ConfirmationRequest):
    """Confirm or reject an agent action that requires user approval"""
    # TODO: Implement confirmation logic
    return {
        "message": "Confirmation received",
        "task_id": request.task_id,
        "action_approved": request.action_approved
    }

@router.post("/research")
async def research_topic(request: dict):
    """Execute a research task"""
    try:
        query = request.get("query")
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        result = await orchestrator.execute_research_task(query)
        return result
    except Exception as e:
        logger.error(f"Research error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
