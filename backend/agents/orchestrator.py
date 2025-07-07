from crewai import Agent, Task, Crew, Process, LLM
from crewai.tools import BaseTool
from typing import List, Dict, Any, Optional
import os
import json
import uuid
from datetime import datetime
import logging
from ..config.llm_config import llm_config

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    """Main orchestrator for CrewAI agents"""
    
    def __init__(self):
        # Check if we have valid API keys
        if not llm_config.has_valid_api_keys():
            logger.warning("No valid LLM API keys found. Agents will use default configuration.")
        
        # Get LLM configuration
        self.llm_config = llm_config.get_llm_config()
        self.llm = None
        if self.llm_config and "llm" in self.llm_config:
            try:
                llm_params = self.llm_config["llm"]
                self.llm = LLM(
                    model=llm_params["model"],
                    api_key=llm_params["api_key"],
                    temperature=llm_params.get("temperature", 0.7),
                    max_tokens=llm_params.get("max_tokens", 2000)
                )
                logger.info(f"Initialized LLM with model: {llm_params['model']}")
            except Exception as e:
                logger.error(f"Failed to initialize LLM: {e}")
                self.llm = None
        
        # We'll add search tools later when we have API keys
        self.task_history: Dict[str, Dict] = {}
        
        # Initialize agents
        self.classifier_agent = self._create_classifier_agent()
        self.researcher_agent = self._create_researcher_agent()
        self.calendar_agent = self._create_calendar_agent()
        self.content_agent = self._create_content_agent()
        self.coordinator_agent = self._create_coordinator_agent()
    
    def _create_classifier_agent(self) -> Agent:
        """Agent responsible for classifying user inputs into lanes"""
        agent_config = {
            'role': 'Content Classifier',
            'goal': 'Accurately classify user inputs into the appropriate project lanes',
            'backstory': """You are an expert at understanding context and categorizing 
                        content based on Rajeev's projects and interests. You understand 
                        the nuances between podcasting content, AI startup work, 
                        accelerator activities, and general tasks.""",
            'tools': [],
            'verbose': True,
            'allow_delegation': False
        }
        
        # Add LLM if available
        if self.llm:
            agent_config['llm'] = self.llm
            
        return Agent(**agent_config)
    
    def _create_researcher_agent(self) -> Agent:
        """Agent for web research and information gathering"""
        agent_config = {
            'role': 'Research Specialist',
            'goal': 'Conduct thorough research and gather relevant information',
            'backstory': """You are a skilled researcher who can find accurate, 
                        up-to-date information on any topic. You know how to validate 
                        sources and provide comprehensive insights.""",
            'tools': [],  # We'll add search tools when we have API keys
            'verbose': True,
            'allow_delegation': False
        }
        
        # Add LLM if available
        if self.llm:
            agent_config['llm'] = self.llm
            
        return Agent(**agent_config)
    
    def _create_calendar_agent(self) -> Agent:
        """Agent for calendar and scheduling tasks"""
        agent_config = {
            'role': 'Calendar Manager',
            'goal': 'Handle all calendar-related tasks efficiently',
            'backstory': """You are an expert at managing schedules, finding optimal 
                        meeting times, and organizing calendar events. You understand 
                        time zones and scheduling best practices.""",
            'tools': [],  # We'll add calendar tools later
            'verbose': True,
            'allow_delegation': False
        }
        
        # Add LLM if available
        if self.llm:
            agent_config['llm'] = self.llm
            
        return Agent(**agent_config)
    
    def _create_content_agent(self) -> Agent:
        """Agent for content creation and editing"""
        agent_config = {
            'role': 'Content Creator',
            'goal': 'Create high-quality content tailored to specific platforms and audiences',
            'backstory': """You are a creative content specialist who understands 
                        different platforms, writing styles, and audience engagement. 
                        You can adapt tone and format for various needs.""",
            'tools': [],
            'verbose': True,
            'allow_delegation': False
        }
        
        # Add LLM if available
        if self.llm:
            agent_config['llm'] = self.llm
            
        return Agent(**agent_config)
    
    def _create_coordinator_agent(self) -> Agent:
        """Agent that coordinates between other agents and manages workflow"""
        agent_config = {
            'role': 'Task Coordinator',
            'goal': 'Coordinate complex multi-step tasks and ensure smooth workflow',
            'backstory': """You are an expert project manager who can break down 
                        complex requests into manageable steps, coordinate between 
                        different specialists, and ensure tasks are completed efficiently.""",
            'tools': [],
            'verbose': True,
            'allow_delegation': True
        }
        
        # Add LLM if available
        if self.llm:
            agent_config['llm'] = self.llm
            
        return Agent(**agent_config)
    
    async def classify_update(self, transcript: str) -> Dict[str, Any]:
        """Classify a voice/text update into the appropriate lane"""
        task = Task(
            description=f"""
            Classify the following user input into one of these lanes:
            - podcasting: Podcast content, interviews, episode ideas, guest research
            - podcast-bots-ai: AI startup work, product development, technical discussions
            - accelerator-work: Business activities, networking, accelerator program tasks
            - miscellaneous: General tasks, personal items, other activities
            
            User input: "{transcript}"
            
            Provide your classification with confidence level (0-1) and reasoning.
            Return as JSON: {{"lane": "lane_name", "confidence": 0.95, "reasoning": "explanation"}}
            """,
            agent=self.classifier_agent,
            expected_output="JSON object with lane classification, confidence, and reasoning"
        )
        
        crew = Crew(
            agents=[self.classifier_agent],
            tasks=[task],
            verbose=True,
            process=Process.sequential
        )
        
        try:
            result = crew.kickoff()
            # Parse the result (CrewAI returns string, we need to parse JSON)
            if isinstance(result, str):
                import json
                return json.loads(result)
            return result
        except Exception as e:
            logger.error(f"Classification error: {e}")
            # Fallback classification
            return {
                "lane": "miscellaneous",
                "confidence": 0.5,
                "reasoning": "Classification failed, defaulting to miscellaneous"
            }
    
    async def process_task(self, user_input: str, lane: str = None) -> str:
        """Process a complex task using multiple agents"""
        task_id = str(uuid.uuid4())
        
        # Create coordination task
        coordination_task = Task(
            description=f"""
            Plan and coordinate the execution of this user request:
            "{user_input}"
            
            Lane context: {lane or "Not specified"}
            
            Break this down into steps and determine which agents need to be involved.
            Consider if any actions require user confirmation before proceeding.
            
            Provide a detailed execution plan.
            """,
            agent=self.coordinator_agent,
            expected_output="Detailed execution plan with steps and agent assignments"
        )
        
        crew = Crew(
            agents=[self.coordinator_agent],
            tasks=[coordination_task],
            verbose=True,
            process=Process.sequential
        )
        
        try:
            result = crew.kickoff()
            self.task_history[task_id] = {
                "user_input": user_input,
                "lane": lane,
                "plan": result,
                "status": "planned",
                "created_at": datetime.now().isoformat()
            }
            return task_id
        except Exception as e:
            logger.error(f"Task processing error: {e}")
            raise
    
    async def execute_research_task(self, query: str) -> Dict[str, Any]:
        """Execute a research task"""
        research_task = Task(
            description=f"""
            Research the following topic thoroughly:
            "{query}"
            
            Provide comprehensive information including:
            - Key facts and current status
            - Recent developments or news
            - Relevant resources or links
            - Practical insights or recommendations
            """,
            agent=self.researcher_agent,
            expected_output="Comprehensive research report with facts, developments, and recommendations"
        )
        
        crew = Crew(
            agents=[self.researcher_agent],
            tasks=[research_task],
            verbose=True,
            process=Process.sequential
        )
        
        try:
            result = crew.kickoff()
            return {
                "query": query,
                "research_result": result,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Research task error: {e}")
            raise
    
    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get the status of a specific task"""
        return self.task_history.get(task_id)
    
    def list_active_tasks(self) -> List[Dict[str, Any]]:
        """List all active/recent tasks"""
        return list(self.task_history.values())

# Global orchestrator instance
orchestrator = AgentOrchestrator()
