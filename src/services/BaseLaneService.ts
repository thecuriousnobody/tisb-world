// Base interface for all project lane services
export interface ProjectUpdate {
  content: string
  timestamp: Date
  lane: string
  processed?: boolean
}

export interface LaneService {
  name: string
  description: string
  sendUpdate(update: ProjectUpdate): Promise<boolean>
  getRecentUpdates?(limit?: number): Promise<ProjectUpdate[]>
}

// Simulated API responses - replace with real implementations
export class BaseLaneService implements LaneService {
  public name: string
  public description: string
  protected apiUrl?: string

  constructor(name: string, description: string, apiUrl?: string) {
    this.name = name
    this.description = description
    this.apiUrl = apiUrl
  }

  async sendUpdate(update: ProjectUpdate): Promise<boolean> {
    // Simulate API call
    console.log(`[${this.name}] Sending update:`, update)
    
    // TODO: Replace with actual API calls
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return true
  }

  async getRecentUpdates(limit: number = 10): Promise<ProjectUpdate[]> {
    // TODO: Replace with actual API calls
    console.log(`[${this.name}] Fetching recent updates (limit: ${limit})`)
    return []
  }
}
