"""LLM Configuration for CrewAI Agents"""
import os
from typing import Optional
from crewai_tools.tools.base_tool import BaseTool
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class LLMConfig:
    """Centralized LLM configuration for all agents"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        self.default_provider = os.getenv("DEFAULT_LLM_PROVIDER", "openai")
        self.agent_timeout = int(os.getenv("AGENT_TIMEOUT", "300"))
        self.max_iterations = int(os.getenv("MAX_ITERATIONS", "5"))
        
    def get_llm_config(self, provider: Optional[str] = None) -> dict:
        """Get LLM configuration for CrewAI agents"""
        provider = provider or self.default_provider
        
        if provider == "openai":
            if not self.openai_api_key:
                logger.warning("OpenAI API key not found, agents may not work properly")
                return {}
            
            return {
                "llm": {
                    "model": "gpt-4o",
                    "api_key": self.openai_api_key,
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
            }
            
        elif provider == "anthropic":
            if not self.anthropic_api_key:
                logger.warning("Anthropic API key not found, agents may not work properly")
                return {}
                
            return {
                "llm": {
                    "model": "claude-3-5-sonnet-20241022",
                    "api_key": self.anthropic_api_key,
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
            }
        
        else:
            logger.error(f"Unsupported LLM provider: {provider}")
            return {}
    
    def has_valid_api_keys(self) -> bool:
        """Check if we have at least one valid API key"""
        return bool(self.openai_api_key or self.anthropic_api_key)
    
    def get_available_providers(self) -> list:
        """Get list of available LLM providers based on API keys"""
        providers = []
        if self.openai_api_key:
            providers.append("openai")
        if self.anthropic_api_key:
            providers.append("anthropic")
        return providers

# Global config instance
llm_config = LLMConfig()
