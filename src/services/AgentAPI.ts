// Backend API service for agent interactions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export interface ClassificationResult {
  lane: string
  confidence: number
  reasoning: string
}

export interface TaskResponse {
  task_id: string
  status: string
  current_step?: any
  all_steps: any[]
  final_result?: any
}

export interface ResearchResult {
  query: string
  research_result: string
  timestamp: string
}

class AgentAPIService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Agent classification
  async classifyUpdate(transcript: string): Promise<ClassificationResult> {
    return this.makeRequest('/agents/classify', {
      method: 'POST',
      body: JSON.stringify({
        transcript,
      }),
    })
  }

  // Task processing
  async processTask(userInput: string, context?: any): Promise<TaskResponse> {
    return this.makeRequest('/tasks/process', {
      method: 'POST',
      body: JSON.stringify({
        user_input: userInput,
        context,
      }),
    })
  }

  async getTaskStatus(taskId: string): Promise<TaskResponse> {
    return this.makeRequest(`/tasks/${taskId}`)
  }

  async listTasks(): Promise<{ tasks: any[] }> {
    return this.makeRequest('/tasks/')
  }

  // Research functionality
  async researchTopic(query: string): Promise<ResearchResult> {
    return this.makeRequest('/tasks/research', {
      method: 'POST',
      body: JSON.stringify({
        query,
      }),
    })
  }

  // Lane operations
  async getLanes(): Promise<{ lanes: any }> {
    return this.makeRequest('/lanes/')
  }

  async getLaneInfo(laneId: string): Promise<{ lane: any }> {
    return this.makeRequest(`/lanes/${laneId}`)
  }

  async processLaneUpdate(laneId: string, update: string): Promise<any> {
    return this.makeRequest(`/lanes/${laneId}/process`, {
      method: 'POST',
      body: JSON.stringify({
        update,
      }),
    })
  }

  // Agent status
  async getAgentStatus(): Promise<{ agents: any; active_tasks: number }> {
    return this.makeRequest('/agents/status')
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`)
    return response.json()
  }
}

export const agentAPI = new AgentAPIService()
