from crewai_tools import tool
from typing import Dict, Any, List
import httpx
import os
from datetime import datetime, timedelta
import json

@tool("search_web")
def search_web(query: str) -> str:
    """Search the web for information on a given topic."""
    # This will use SerperDevTool in the actual agent
    return f"Web search results for: {query}"

@tool("get_calendar_events")  
def get_calendar_events(days_ahead: int = 7) -> List[Dict[str, Any]]:
    """Get calendar events for the next N days."""
    # Placeholder - would integrate with Google Calendar API
    return [
        {
            "title": "Sample Meeting",
            "start_time": "2025-01-07T10:00:00Z",
            "end_time": "2025-01-07T11:00:00Z",
            "description": "Sample calendar event"
        }
    ]

@tool("create_calendar_event")
def create_calendar_event(
    title: str, 
    start_time: str, 
    end_time: str, 
    description: str = ""
) -> Dict[str, Any]:
    """Create a new calendar event."""
    # Placeholder - would integrate with Google Calendar API
    return {
        "event_id": "sample_event_123",
        "title": title,
        "start_time": start_time,
        "end_time": end_time,
        "description": description,
        "status": "created"
    }

@tool("save_note")
def save_note(content: str, category: str = "general") -> Dict[str, Any]:
    """Save a note or piece of content for later reference."""
    # Placeholder - would integrate with Notion or other note-taking service
    return {
        "note_id": f"note_{datetime.now().timestamp()}",
        "content": content,
        "category": category,
        "created_at": datetime.now().isoformat(),
        "status": "saved"
    }

@tool("send_email")
def send_email(
    to: str, 
    subject: str, 
    body: str, 
    cc: str = None
) -> Dict[str, Any]:
    """Send an email message."""
    # Placeholder - would integrate with email service
    return {
        "message_id": f"email_{datetime.now().timestamp()}",
        "to": to,
        "subject": subject,
        "status": "sent",
        "sent_at": datetime.now().isoformat()
    }

@tool("research_person")
def research_person(name: str, context: str = "") -> Dict[str, Any]:
    """Research information about a person, optionally with context."""
    # Placeholder - would use web search and social media APIs
    return {
        "name": name,
        "context": context,
        "findings": f"Research results for {name}",
        "sources": ["placeholder_source_1", "placeholder_source_2"],
        "last_updated": datetime.now().isoformat()
    }

@tool("generate_content")
def generate_content(
    content_type: str,
    topic: str, 
    target_audience: str = "general",
    tone: str = "professional"
) -> Dict[str, Any]:
    """Generate content for various purposes (blog post, social media, etc.)."""
    # Placeholder - would use LLM for content generation
    return {
        "content_type": content_type,
        "topic": topic,
        "audience": target_audience,
        "tone": tone,
        "generated_content": f"Generated {content_type} about {topic}",
        "created_at": datetime.now().isoformat()
    }

# Tool collections for different agent types
RESEARCH_TOOLS = [search_web, research_person]
CALENDAR_TOOLS = [get_calendar_events, create_calendar_event]
CONTENT_TOOLS = [generate_content, save_note]
COMMUNICATION_TOOLS = [send_email]

ALL_TOOLS = RESEARCH_TOOLS + CALENDAR_TOOLS + CONTENT_TOOLS + COMMUNICATION_TOOLS
