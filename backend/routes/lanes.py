from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

# Lane configurations
LANE_CONFIGS = {
    "podcasting": {
        "name": "Podcasting",
        "description": "Podcast content, interviews, episode planning",
        "tools": ["calendar", "research", "content_creation"],
        "default_actions": [
            "Research guest background",
            "Schedule interview",
            "Prepare questions",
            "Create episode outline"
        ]
    },
    "podcast-bots-ai": {
        "name": "Podcast Bots AI",
        "description": "AI startup development and product work",
        "tools": ["research", "content_creation", "task_management"],
        "default_actions": [
            "Research market trends",
            "Create product documentation",
            "Plan development tasks",
            "Generate marketing content"
        ]
    },
    "accelerator-work": {
        "name": "Accelerator Work", 
        "description": "Business development and accelerator activities",
        "tools": ["calendar", "research", "networking"],
        "default_actions": [
            "Research potential partners",
            "Schedule meetings",
            "Prepare pitch materials",
            "Track progress metrics"
        ]
    },
    "miscellaneous": {
        "name": "Miscellaneous",
        "description": "General tasks and personal activities",
        "tools": ["calendar", "research", "content_creation"],
        "default_actions": [
            "Research topic",
            "Schedule task",
            "Create reminder",
            "Generate summary"
        ]
    }
}

@router.get("/")
async def list_lanes():
    """Get all available project lanes"""
    return {
        "lanes": LANE_CONFIGS
    }

@router.get("/{lane_id}")
async def get_lane_info(lane_id: str):
    """Get detailed information about a specific lane"""
    if lane_id not in LANE_CONFIGS:
        return {"error": "Lane not found"}
    
    return {
        "lane": LANE_CONFIGS[lane_id]
    }

@router.post("/{lane_id}/process")
async def process_lane_update(lane_id: str, request: dict):
    """Process an update for a specific lane"""
    if lane_id not in LANE_CONFIGS:
        return {"error": "Lane not found"}
    
    update_text = request.get("update", "")
    
    # Lane-specific processing logic
    result = {
        "lane": lane_id,
        "update": update_text,
        "suggested_actions": LANE_CONFIGS[lane_id]["default_actions"],
        "status": "processed"
    }
    
    return result
