from fastapi import APIRouter, HTTPException
from typing import List
import logging

from models.schemas import ProcessUpdateRequest, ClassificationResult
from agents.orchestrator import orchestrator

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/classify", response_model=ClassificationResult)
async def classify_update(request: ProcessUpdateRequest):
    """Classify a user update into the appropriate lane"""
    try:
        result = await orchestrator.classify_update(request.transcript)
        
        return ClassificationResult(
            lane=result["lane"],
            confidence=result["confidence"],
            reasoning=result["reasoning"]
        )
    except Exception as e:
        logger.error(f"Classification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_agent_status():
    """Get the current status of all agents"""
    return {
        "agents": {
            "classifier": "active",
            "researcher": "active", 
            "calendar_manager": "active",
            "content_creator": "active",
            "coordinator": "active"
        },
        "active_tasks": len(orchestrator.list_active_tasks())
    }
