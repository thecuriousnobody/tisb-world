import { type LaneService, type ProjectUpdate } from './BaseLaneService'
import { PodcastingService } from './PodcastingService'
import { PodcastBotsAIService } from './PodcastBotsAIService'
import { AcceleratorWorkService } from './AcceleratorWorkService'
import { MiscellaneousService } from './MiscellaneousService'

export type LaneId = 'podcasting' | 'podcast-bots-ai' | 'accelerator-work' | 'miscellaneous'

export class LaneServiceManager {
  private services: Map<LaneId, LaneService>

  constructor() {
    this.services = new Map()
    this.services.set('podcasting', new PodcastingService())
    this.services.set('podcast-bots-ai', new PodcastBotsAIService())
    this.services.set('accelerator-work', new AcceleratorWorkService())
    this.services.set('miscellaneous', new MiscellaneousService())
  }

  getService(laneId: LaneId): LaneService | undefined {
    return this.services.get(laneId)
  }

  getAllServices(): Map<LaneId, LaneService> {
    return new Map(this.services)
  }

  async sendUpdate(laneId: LaneId, content: string): Promise<boolean> {
    const service = this.getService(laneId)
    if (!service) {
      console.error(`Service not found for lane: ${laneId}`)
      return false
    }

    const update: ProjectUpdate = {
      content,
      timestamp: new Date(),
      lane: laneId,
      processed: false,
    }

    try {
      const result = await service.sendUpdate(update)
      console.log(`Update sent to ${service.name}:`, result)
      return result
    } catch (error) {
      console.error(`Error sending update to ${service.name}:`, error)
      return false
    }
  }

  // Enhanced classification using keyword matching
  // TODO: Replace with AI-based classification
  classifyUpdate(content: string): LaneId {
    const lowerContent = content.toLowerCase()
    
    // Podcast Bots AI keywords
    const podcastBotsKeywords = [
      'podcast bot', 'ai', 'startup', 'development', 'feature', 'user', 'customer',
      'analytics', 'metric', 'funding', 'investor', 'product', 'technical debt'
    ]
    
    // Podcasting keywords
    const podcastingKeywords = [
      'episode', 'recording', 'edit', 'publish', 'upload', 'guest', 'interview',
      'script', 'research', 'show notes', 'audio', 'production'
    ]
    
    // Accelerator keywords
    const acceleratorKeywords = [
      'accelerator', 'mentoring', 'portfolio', 'technical direction', 'consulting',
      'part-time', 'meeting', 'review', 'hours', 'time tracking'
    ]
    
    // Score each lane based on keyword matches
    const scores = {
      'podcast-bots-ai': this.calculateScore(lowerContent, podcastBotsKeywords),
      'podcasting': this.calculateScore(lowerContent, podcastingKeywords),
      'accelerator-work': this.calculateScore(lowerContent, acceleratorKeywords),
      'miscellaneous': 0
    }
    
    // Find the lane with the highest score
    const maxScore = Math.max(...Object.values(scores))
    
    // If no keywords matched, default to miscellaneous
    if (maxScore === 0) {
      return 'miscellaneous'
    }
    
    // Return the lane with the highest score
    const topLane = Object.entries(scores).find(([, score]) => score === maxScore)?.[0] as LaneId
    return topLane || 'miscellaneous'
  }

  private calculateScore(content: string, keywords: string[]): number {
    return keywords.reduce((score, keyword) => {
      return content.includes(keyword) ? score + 1 : score
    }, 0)
  }

  // Get lane information for UI display
  getLaneInfo(laneId: LaneId) {
    const service = this.getService(laneId)
    if (!service) return null
    
    return {
      id: laneId,
      name: service.name,
      description: service.description,
    }
  }

  // Get all lane information for UI
  getAllLaneInfo() {
    return Array.from(this.services.entries()).map(([id, service]) => ({
      id,
      name: service.name,
      description: service.description,
    }))
  }
}

// Singleton instance
export const laneServiceManager = new LaneServiceManager()
