// API service for task processing and agent orchestration
// This is a foundation that can be connected to OpenAI, Claude, or your own backend

export interface TaskProcessingRequest {
  message: string
  context?: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  lane_hint?: string
}

export interface TaskProcessingResponse {
  response: string
  extracted_data?: {
    lane: string
    completed_tasks: string[]
    in_progress_tasks: Array<{ task: string; progress: number }>
    pending_tasks: string[]
    confidence: number
  }
  needs_clarification: boolean
  ready_for_processing: boolean
}

// Mock implementation - replace with real API calls
export class TaskProcessingAPI {
  private baseUrl: string
  private apiKey: string

  constructor() {
    // These would come from environment variables
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
    this.apiKey = import.meta.env.VITE_API_KEY || 'mock-key'
    
    // Silence unused variable warnings for now
    console.log('TaskProcessingAPI initialized with baseUrl:', this.baseUrl.length > 0 ? 'configured' : 'default')
  }

  async processTaskMessage(request: TaskProcessingRequest): Promise<TaskProcessingResponse> {
    // For now, return mock responses
    // TODO: Replace with actual API call to OpenAI/Claude or your backend
    
    console.log('Processing task message:', request)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    return this.mockProcessing(request)
  }

  /**
   * Simple message processing for agent orchestrator
   * @param message The message to process
   * @returns Processed response string
   */
  async processMessage(message: string): Promise<string> {
    const request: TaskProcessingRequest = {
      message,
      context: []
    }
    
    const response = await this.processTaskMessage(request)
    return response.response
  }

  private mockProcessing(request: TaskProcessingRequest): TaskProcessingResponse {
    const message = request.message.toLowerCase()
    
    // Simple keyword-based processing for now
    if (message.includes('complete') || message.includes('done')) {
      if (message.includes('api') && message.includes('integration')) {
        return {
          response: `I see you completed API integration work. Let me extract the details:

**Detected Lane**: ${this.detectLane(message)}
**Completed**: API integration
**In Progress**: UI improvements (if mentioned)
**Status**: Ready for processing

Should I format this for your project tracking system?`,
          extracted_data: {
            lane: this.detectLane(message),
            completed_tasks: ['API integration'],
            in_progress_tasks: message.includes('ui') ? [{ task: 'UI improvements', progress: 40 }] : [],
            pending_tasks: this.extractPendingTasks(message),
            confidence: 0.85
          },
          needs_clarification: false,
          ready_for_processing: true
        }
      }
    }
    
    if (message.includes('yes') || message.includes('process') || message.includes('format')) {
      return {
        response: `✅ **Task Update Processed Successfully!**

**Lane**: Podcast Bots AI
**Summary**: API integration completed, UI work in progress
**Tasks Updated**: 2
**Confidence**: 85%

*This would normally be sent to your Airtable/Notion workspace via API.*

Ready to implement real integrations when you are!`,
        extracted_data: {
          lane: 'podcast-bots-ai',
          completed_tasks: ['API integration'],
          in_progress_tasks: [{ task: 'UI improvements', progress: 40 }],
          pending_tasks: ['User testing'],
          confidence: 0.95
        },
        needs_clarification: false,
        ready_for_processing: false // Already processed
      }
    }
    
    // Default response for unclear messages
    return {
      response: `I'm listening! To help organize your task update, can you tell me:

🎯 **Which project lane?** (Podcasting, Podcast Bots AI, Accelerator Work, Miscellaneous)
✅ **What did you complete today?**
🔄 **What's in progress?** (with % if known)
📋 **What's pending or planned?**

The more specific you are, the better I can structure your update!`,
      needs_clarification: true,
      ready_for_processing: false
    }
  }

  private detectLane(message: string): string {
    if (message.includes('podcast') && (message.includes('bot') || message.includes('ai'))) {
      return 'podcast-bots-ai'
    }
    if (message.includes('podcast') && !message.includes('bot')) {
      return 'podcasting'
    }
    if (message.includes('accelerator') || message.includes('mentor')) {
      return 'accelerator-work'
    }
    return 'miscellaneous'
  }

  private extractPendingTasks(message: string): string[] {
    const tasks: string[] = []
    
    if (message.includes('testing') || message.includes('test')) {
      tasks.push('User testing')
    }
    if (message.includes('review')) {
      tasks.push('Technical review')
    }
    if (message.includes('meeting')) {
      tasks.push('Schedule meetings')
    }
    
    return tasks
  }

  // Method to connect to real APIs later
  async connectToOpenAI(request: TaskProcessingRequest): Promise<TaskProcessingResponse> {
    // TODO: Implement OpenAI API integration
    const prompt = this.buildPrompt(request)
    
    try {
      // const response = await openai.chat.completions.create({
      //   model: "gpt-4",
      //   messages: [{ role: "user", content: prompt }],
      //   temperature: 0.1
      // })
      
      // For now, return mock
      console.log('Would call OpenAI with prompt:', prompt)
      return this.mockProcessing(request)
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
  }

  async connectToClaude(request: TaskProcessingRequest): Promise<TaskProcessingResponse> {
    // TODO: Implement Claude API integration
    const prompt = this.buildPrompt(request)
    
    try {
      // Implementation would go here
      console.log('Would call Claude with prompt:', prompt)
      return this.mockProcessing(request)
    } catch (error) {
      console.error('Claude API error:', error)
      throw error
    }
  }

  private buildPrompt(request: TaskProcessingRequest): string {
    return `
You are a productivity assistant helping to extract and structure task updates.

User message: "${request.message}"

Context: ${request.context?.map(c => `${c.role}: ${c.content}`).join('\n') || 'None'}

Extract and structure the information into this format:
{
  "lane": "project_lane_name",
  "completed_tasks": ["task1", "task2"],
  "in_progress_tasks": [{"task": "task_name", "progress": 40}],
  "pending_tasks": ["task1", "task2"],
  "confidence": 0.85,
  "needs_clarification": false,
  "response": "Helpful response to user"
}

Project lanes: Podcasting, Podcast Bots AI, Accelerator Work, Miscellaneous
`
  }
}

// Export singleton instance
export const taskAPI = new TaskProcessingAPI()
