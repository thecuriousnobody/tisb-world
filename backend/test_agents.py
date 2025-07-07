#!/usr/bin/env python3
"""
Quick test script to verify the CrewAI backend is working
Run this after starting the backend to test agent functionality
"""

import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.orchestrator import orchestrator

async def test_classification():
    """Test the classification agent"""
    print("🧠 Testing Classification Agent...")
    
    test_inputs = [
        "I want to interview Sam Altman about AI safety",
        "Research the latest trends in podcast monetization", 
        "Schedule a meeting with potential investors",
        "Create a blog post about our AI startup progress",
        "Buy groceries and walk the dog"
    ]
    
    for i, test_input in enumerate(test_inputs, 1):
        print(f"\n{i}. Input: '{test_input}'")
        try:
            result = await orchestrator.classify_update(test_input)
            print(f"   Lane: {result['lane']}")
            print(f"   Confidence: {result['confidence']:.1%}")
            print(f"   Reasoning: {result['reasoning']}")
        except Exception as e:
            print(f"   ❌ Error: {e}")

async def test_research():
    """Test the research agent"""
    print("\n🔍 Testing Research Agent...")
    
    try:
        result = await orchestrator.execute_research_task("Latest AI podcast trends 2025")
        print(f"Research completed: {result['research_result'][:100]}...")
    except Exception as e:
        print(f"❌ Research Error: {e}")

async def main():
    print("🚀 TISB World Backend Test Suite")
    print("=" * 40)
    
    await test_classification()
    await test_research()
    
    print("\n✅ Backend test completed!")
    print("🌐 If you see results above, your CrewAI agents are working!")
    print("📱 Now test the frontend at http://localhost:5173")

if __name__ == "__main__":
    asyncio.run(main())
