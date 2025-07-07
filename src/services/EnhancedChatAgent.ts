// Enhanced agent with internet access and real-world context
// This agent can search, research, and proactively suggest opportunities

export interface WebSearchResult {
  title: string
  url: string
  snippet: string
  relevance_score: number
}

export interface OpportunityDetected {
  type: 'event' | 'funding' | 'partnership' | 'content_opportunity' | 'networking'
  title: string
  description: string
  deadline?: string
  action_suggested: string
  priority: 'high' | 'medium' | 'low'
  reasoning: string
}

export interface EnhancedAgentRequest {
  user_message: string
  conversation_context: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  user_profile: {
    location?: string
    interests: string[]
    current_projects: string[]
    goals: string[]
  }
  search_enabled: boolean
  proactive_suggestions: boolean
}

export interface EnhancedAgentResponse {
  response: string
  web_research?: {
    query: string
    results: WebSearchResult[]
    summary: string
  }
  opportunities_detected?: OpportunityDetected[]
  suggested_tasks?: Array<{
    task: string
    lane: string
    priority: string
    deadline?: string
  }>
  needs_confirmation?: boolean
  confirmation_question?: string
  ready_for_task_processing: boolean
}

export class EnhancedChatAgent {
  private searchAPI: string
  private location: string
  private userProfile: any

  constructor() {
    this.searchAPI = import.meta.env.VITE_SEARCH_API_KEY || 'mock'
    this.location = 'Peoria, IL' // Could be dynamic
    this.userProfile = {
      interests: ['AI', 'podcasting', 'startups', 'venture capital'],
      projects: ['Podcast Bots AI', 'Podcasting', 'Accelerator Work'],
      goals: ['grow startup', 'expand network', 'find funding', 'content creation']
    }
    
    // Log initialization for debugging
    console.log('Enhanced Chat Agent initialized for:', this.location)
  }

  async processEnhancedRequest(request: EnhancedAgentRequest): Promise<EnhancedAgentResponse> {
    console.log('Enhanced Agent Processing:', request)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Check if this requires web research
    const needsResearch = this.detectResearchNeed(request.user_message)
    
    let response: EnhancedAgentResponse = {
      response: '',
      ready_for_task_processing: false
    }

    if (needsResearch && request.search_enabled) {
      response = await this.performWebResearch(request)
    } else {
      response = await this.processWithoutResearch(request)
    }

    // Always check for proactive opportunities
    if (request.proactive_suggestions) {
      response.opportunities_detected = await this.detectOpportunities(request)
    }

    return response
  }

  private detectResearchNeed(message: string): boolean {
    const researchKeywords = [
      'search for', 'look up', 'find events', 'what\'s happening',
      'opportunities in', 'funding for', 'events in', 'conferences',
      'networking', 'meetups', 'startups in', 'accelerators',
      'investors', 'VCs', 'venture capital', 'grants'
    ]
    
    return researchKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
  }

  private async performWebResearch(request: EnhancedAgentRequest): Promise<EnhancedAgentResponse> {
    const query = this.extractSearchQuery(request.user_message)
    
    // Mock web search results - replace with real search API
    const mockResults: WebSearchResult[] = [
      {
        title: "Central Illinois Startup Mixer - January 2025",
        url: "https://peoriastartups.com/mixer-jan-2025",
        snippet: "Join 50+ entrepreneurs and investors for networking. Focus on AI and tech startups. January 15th, 6-9 PM at the Peoria Riverfront.",
        relevance_score: 0.95
      },
      {
        title: "Midwest AI Accelerator Program - Applications Open",
        url: "https://midwestai.org/accelerator",
        snippet: "12-week program for AI startups. $50K investment + mentorship. Applications due January 31st. Perfect for B2B AI companies.",
        relevance_score: 0.88
      },
      {
        title: "TechStars Chicago - AI Track 2025",
        url: "https://techstars.com/chicago-ai",
        snippet: "Premier accelerator program focusing on AI/ML startups. $120K investment. Demo day connects with top VCs. Application deadline: February 15th.",
        relevance_score: 0.92
      }
    ]

    const researchSummary = `Found several highly relevant opportunities for your AI startup and networking goals:

🎯 **High Priority Opportunities:**
1. **Central Illinois Startup Mixer** (Jan 15) - Local networking with 50+ entrepreneurs
2. **Midwest AI Accelerator** (Deadline: Jan 31) - $50K + mentorship for AI startups  
3. **TechStars Chicago AI Track** (Deadline: Feb 15) - $120K + top-tier VC connections

These align perfectly with your Podcast Bots AI startup goals and location.`

    const suggestedTasks = [
      {
        task: "Apply to Midwest AI Accelerator program",
        lane: "podcast-bots-ai",
        priority: "high",
        deadline: "2025-01-31"
      },
      {
        task: "Attend Central Illinois Startup Mixer",
        lane: "miscellaneous", 
        priority: "medium",
        deadline: "2025-01-15"
      },
      {
        task: "Prepare TechStars application materials",
        lane: "podcast-bots-ai",
        priority: "high", 
        deadline: "2025-02-10"
      }
    ]

    return {
      response: `I found some amazing opportunities for you! ${researchSummary}

**Should I add these to your task tracking?**
- Apply to Midwest AI Accelerator (high priority, due Jan 31)
- RSVP for Peoria Startup Mixer (Jan 15) 
- Start TechStars application prep (due Feb 15)

This could be exactly the kind of exposure and funding pipeline you're looking for. Want me to process these as formal tasks?`,
      web_research: {
        query,
        results: mockResults,
        summary: researchSummary
      },
      suggested_tasks: suggestedTasks,
      needs_confirmation: true,
      confirmation_question: "Should I add these opportunities as tasks to your project lanes?",
      ready_for_task_processing: false
    }
  }

  private async processWithoutResearch(request: EnhancedAgentRequest): Promise<EnhancedAgentResponse> {
    // Standard task processing logic
    const message = request.user_message.toLowerCase()
    
    if (message.includes('yes') || message.includes('add') || message.includes('process')) {
      return {
        response: `✅ **Opportunities Added to Your Project Tracking!**

**Podcast Bots AI Lane:**
- Apply to Midwest AI Accelerator (Due: Jan 31) 
- Prepare TechStars application (Due: Feb 10)

**Miscellaneous Lane:**  
- Attend Peoria Startup Mixer (Jan 15)

These are now tracked and you'll get reminders. This kind of proactive opportunity detection is exactly how we stack the odds in your favor! 

Want me to search for more funding opportunities or upcoming tech events?`,
        ready_for_task_processing: true
      }
    }

    // Regular task processing
    return {
      response: `I understand you're sharing task updates. I can also help you discover opportunities - just ask me to "search for startup events in Peoria" or "find AI accelerator programs" and I'll research and suggest relevant actions.

For your current update, can you tell me:
1. Which project lane? (Podcasting, Podcast Bots AI, Accelerator Work, Miscellaneous)
2. What did you complete?
3. What's in progress?
4. What needs to be done?`,
      ready_for_task_processing: false
    }
  }

  private extractSearchQuery(message: string): string {
    // Extract search intent from user message
    if (message.toLowerCase().includes('startup') && message.toLowerCase().includes('peoria')) {
      return 'startup events networking Peoria Illinois 2025'
    }
    if (message.toLowerCase().includes('ai accelerator')) {
      return 'AI startup accelerator programs 2025 applications open'
    }
    if (message.toLowerCase().includes('funding')) {
      return 'startup funding opportunities AI midwest 2025'
    }
    
    return 'startup opportunities networking events Illinois 2025'
  }

  private async detectOpportunities(request: EnhancedAgentRequest): Promise<OpportunityDetected[]> {
    // Proactive opportunity detection based on user profile and current context
    console.log('Detecting opportunities for profile:', this.userProfile.interests)
    
    const opportunities: OpportunityDetected[] = [
      {
        type: 'funding',
        title: 'SBIR Phase I Grant for AI Startups',
        description: 'Small Business Innovation Research grant specifically for AI/ML companies. Up to $275K non-dilutive funding.',
        deadline: '2025-02-28',
        action_suggested: 'Research SBIR requirements and prepare application',
        priority: 'high',
        reasoning: 'Perfect match for Podcast Bots AI - non-dilutive funding for proven AI product'
      },
      {
        type: 'content_opportunity', 
        title: 'AI Startup Podcast Guest Opportunity',
        description: 'TechCrunch is looking for AI startup founders for their "AI Founders" podcast series.',
        action_suggested: 'Pitch Podcast Bots AI story and apply to be a guest',
        priority: 'medium',
        reasoning: 'Great exposure opportunity that aligns with your podcasting expertise'
      },
      {
        type: 'partnership',
        title: 'Potential Integration with Spotify Podcasting Tools',
        description: 'Spotify is expanding their creator tools API. Could be integration opportunity for podcast discovery.',
        action_suggested: 'Research Spotify Partner Program and potential API integration',
        priority: 'medium', 
        reasoning: 'Strategic fit - your AI tool could enhance Spotify\'s podcast ecosystem'
      }
    ]

    return opportunities
  }

  // Method for real search API integration
  async performRealWebSearch(query: string): Promise<WebSearchResult[]> {
    // TODO: Integrate with real search API (Google, Bing, Serper, etc.)
    try {
      // const response = await fetch(`https://api.search.com/search?q=${encodeURIComponent(query)}&key=${this.searchAPI}`)
      // const data = await response.json()
      // return this.parseSearchResults(data)
      
      console.log('Would search for:', query)
      return []
    } catch (error) {
      console.error('Search API error:', error)
      return []
    }
  }
}

export const enhancedChatAgent = new EnhancedChatAgent()
