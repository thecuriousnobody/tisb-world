import { TaskProcessingAPI } from './TaskProcessingAPI';

// Types for agent orchestration
export interface Agent {
  id: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  maxRetries: number;
}

export interface Task {
  id: string;
  description: string;
  expectedOutput: string;
  agentId: string;
  dependencies: string[];
  validation?: (result: string) => { valid: boolean; message: string };
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface ToolCall {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  result?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface OrchestrationResult {
  success: boolean;
  data?: {
    tasks: Task[];
    toolCalls: ToolCall[];
    finalResult: string;
  };
  error?: string;
}

export interface UserConfirmation {
  id: string;
  message: string;
  type: 'proceed' | 'tool_approval' | 'result_approval';
  data?: any;
  response?: 'approved' | 'rejected' | 'modified';
}

/**
 * CrewAI-style agent orchestrator for the web
 * Implements multi-agent sequential task execution with tool use and user confirmation
 */
export class AgentOrchestrator {
  private taskProcessor: TaskProcessingAPI;
  private agents: Map<string, Agent> = new Map();
  private tools: Map<string, ToolCall> = new Map();
  private onProgress?: (update: {
    type: 'agent_start' | 'agent_complete' | 'task_update' | 'tool_call' | 'user_confirmation_needed';
    data: any;
  }) => void;
  private onUserConfirmationNeeded?: (confirmation: UserConfirmation) => Promise<UserConfirmation>;

  constructor(
    taskProcessor: TaskProcessingAPI,
    onProgress?: (update: any) => void,
    onUserConfirmationNeeded?: (confirmation: UserConfirmation) => Promise<UserConfirmation>
  ) {
    this.taskProcessor = taskProcessor;
    this.onProgress = onProgress;
    this.onUserConfirmationNeeded = onUserConfirmationNeeded;
    this.initializeAgents();
    this.initializeTools();
  }

  private initializeAgents() {
    // Guest Finder Agents (similar to your Python CrewAI setup)
    this.agents.set('topic_analyzer', {
      id: 'topic_analyzer',
      role: 'Topic Analyzer',
      goal: 'Analyze the provided topic and identify key aspects, related fields, and potential perspectives',
      backstory: 'You are an expert at breaking down complex topics and identifying various angles for discussion.',
      tools: ['web_search'],
      maxRetries: 3
    });

    this.agents.set('expert_finder', {
      id: 'expert_finder',
      role: 'Expert Finder',
      goal: 'Identify diverse potential guests related to the analyzed topic',
      backstory: 'You have vast knowledge of people working across various disciplines, with focus on both well-known and lesser-known experts.',
      tools: ['web_search'],
      maxRetries: 3
    });

    this.agents.set('contact_researcher', {
      id: 'contact_researcher',
      role: 'Contact Information Researcher',
      goal: 'Find contact information for all identified potential guests',
      backstory: 'You are skilled at finding contact information for individuals across various sectors.',
      tools: ['web_search'],
      maxRetries: 3
    });

    this.agents.set('contact_verifier', {
      id: 'contact_verifier',
      role: 'Contact Verifier',
      goal: 'Verify and validate contact information authenticity',
      backstory: 'You specialize in validating contact information and ensuring data accuracy.',
      tools: ['web_search'],
      maxRetries: 3
    });
  }

  private initializeTools() {
    this.tools.set('web_search', {
      id: 'web_search',
      name: 'Web Search',
      description: 'Search the web for information and current events with automatic fallbacks',
      parameters: {
        query: 'string',
        maxResults: 'number?'
      },
      status: 'pending'
    });

    this.tools.set('calendar_check', {
      id: 'calendar_check',
      name: 'Calendar Check',
      description: 'Check calendar availability and schedule meetings',
      parameters: {
        date: 'string',
        duration: 'number',
        timezone: 'string?'
      },
      status: 'pending'
    });

    this.tools.set('email_outreach', {
      id: 'email_outreach',
      name: 'Email Outreach',
      description: 'Draft and send professional outreach emails',
      parameters: {
        recipient: 'string',
        subject: 'string',
        template: 'string',
        personalization: 'object?'
      },
      status: 'pending'
    });
  }

  /**
   * Execute a CrewAI-style workflow for guest finding
   */
  async executeGuestFinderWorkflow(topic: string): Promise<OrchestrationResult> {
    const tasks: Task[] = [
      {
        id: 'analyze_topic',
        description: `Analyze the topic "${topic}" in depth. Identify key aspects, related fields, historical context, current relevance, and potential perspectives for discussion.`,
        expectedOutput: 'A detailed analysis including key aspects, related fields, and potential discussion perspectives.',
        agentId: 'topic_analyzer',
        dependencies: [],
        status: 'pending',
        validation: this.validateTopicAnalysis
      },
      {
        id: 'find_experts',
        description: `Based on the topic analysis, identify diverse potential podcast guests with high, medium, and low public profiles.`,
        expectedOutput: 'A comprehensive list of at least 15 potential guests with their roles, experience, and value proposition.',
        agentId: 'expert_finder',
        dependencies: ['analyze_topic'],
        status: 'pending'
      },
      {
        id: 'research_contacts',
        description: `Research contact information for all identified potential guests.`,
        expectedOutput: 'Contact information including emails, social media, and outreach suggestions for each guest.',
        agentId: 'contact_researcher',
        dependencies: ['find_experts'],
        status: 'pending',
        validation: this.validateContactInfo
      },
      {
        id: 'verify_contacts',
        description: `Verify the authenticity and accuracy of the collected contact information.`,
        expectedOutput: 'Verified contact information with validation status for each guest.',
        agentId: 'contact_verifier',
        dependencies: ['research_contacts'],
        status: 'pending'
      }
    ];

    return this.executeWorkflow(tasks);
  }

  /**
   * Execute a general workflow with sequential task processing
   */
  async executeWorkflow(tasks: Task[]): Promise<OrchestrationResult> {
    try {
      const completedTasks: Task[] = [];
      const toolCalls: ToolCall[] = [];

      for (const task of tasks) {
        // Check dependencies
        const dependencyResults = this.checkDependencies(task, completedTasks);
        if (!dependencyResults.satisfied) {
          return {
            success: false,
            error: `Task ${task.id} dependencies not satisfied: ${dependencyResults.missing.join(', ')}`
          };
        }

        // Execute task
        this.onProgress?.({
          type: 'agent_start',
          data: { task: task.id, agent: task.agentId }
        });

        const agent = this.agents.get(task.agentId);
        if (!agent) {
          return {
            success: false,
            error: `Agent ${task.agentId} not found`
          };
        }

        task.status = 'running';
        task.startTime = new Date();

        // Request user confirmation before proceeding with task
        if (this.onUserConfirmationNeeded) {
          const confirmation = await this.onUserConfirmationNeeded({
            id: `task_${task.id}`,
            message: `Ready to execute ${agent.role} task: ${task.description}`,
            type: 'proceed',
            data: { task, agent }
          });

          if (confirmation.response === 'rejected') {
            task.status = 'failed';
            return {
              success: false,
              error: `Task ${task.id} rejected by user`
            };
          }
        }

        // Execute the task with retries
        let attempt = 0;
        let taskResult: string | null = null;

        while (attempt < agent.maxRetries && !taskResult) {
          attempt++;
          
          try {
            // Build context from previous tasks
            const context = this.buildTaskContext(task, completedTasks);
            
            // Check if agent needs tools
            const toolResults: ToolCall[] = [];
            for (const toolName of agent.tools) {
              const toolCall = await this.executeTool(toolName, task, context);
              if (toolCall) {
                toolResults.push(toolCall);
                toolCalls.push(toolCall);
              }
            }

            // Execute the main task
            const prompt = this.buildAgentPrompt(agent, task, context, toolResults);
            taskResult = await this.taskProcessor.processMessage(prompt);

            // Validate result if validation function exists
            if (task.validation && taskResult) {
              const validationResult = task.validation(taskResult);
              if (!validationResult.valid) {
                if (attempt < agent.maxRetries) {
                  console.warn(`Task ${task.id} validation failed (attempt ${attempt}): ${validationResult.message}`);
                  taskResult = null; // Retry
                  continue;
                } else {
                  console.error(`Task ${task.id} final validation failed: ${validationResult.message}`);
                  // Continue with invalid result on final attempt
                }
              }
            }

          } catch (error) {
            console.error(`Task ${task.id} attempt ${attempt} failed:`, error);
            if (attempt >= agent.maxRetries) {
              task.status = 'failed';
              return {
                success: false,
                error: `Task ${task.id} failed after ${agent.maxRetries} attempts: ${error}`
              };
            }
          }
        }

        if (!taskResult) {
          task.status = 'failed';
          return {
            success: false,
            error: `Task ${task.id} failed to produce result after ${agent.maxRetries} attempts`
          };
        }

        task.result = taskResult;
        task.status = 'completed';
        task.endTime = new Date();
        completedTasks.push(task);

        this.onProgress?.({
          type: 'agent_complete',
          data: { task: task.id, agent: task.agentId, result: taskResult.substring(0, 200) + '...' }
        });
      }

      // Build final result
      const finalResult = this.buildFinalResult(completedTasks);

      return {
        success: true,
        data: {
          tasks: completedTasks,
          toolCalls,
          finalResult
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `Workflow execution failed: ${error}`
      };
    }
  }

  /**
   * Execute a tool call with user confirmation if needed
   */
  private async executeTool(toolName: string, task: Task, context: string): Promise<ToolCall | null> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      console.warn(`Tool ${toolName} not found`);
      return null;
    }

    // Request user approval for tool use
    if (this.onUserConfirmationNeeded) {
      const confirmation = await this.onUserConfirmationNeeded({
        id: `tool_${toolName}_${Date.now()}`,
        message: `Agent wants to use ${tool.name}: ${tool.description}`,
        type: 'tool_approval',
        data: { tool, task, context }
      });

      if (confirmation.response === 'rejected') {
        return null;
      }
    }

    const toolCall: ToolCall = {
      ...tool,
      id: `${toolName}_${Date.now()}`,
      status: 'running'
    };

    this.onProgress?.({
      type: 'tool_call',
      data: { tool: toolName, task: task.id }
    });

    try {
      // Simulate tool execution (replace with actual implementations)
      let result = '';
      
      switch (toolName) {
        case 'web_search':
          // Extract search query from context/task
          const searchQuery = this.extractSearchQuery(task, context);
          result = await this.executeWebSearch(searchQuery);
          break;
        case 'calendar_check':
          result = await this.executeCalendarCheck();
          break;
        case 'email_outreach':
          result = await this.executeEmailOutreach();
          break;
        default:
          result = `Tool ${toolName} executed successfully`;
      }

      toolCall.result = result;
      toolCall.status = 'completed';
      return toolCall;

    } catch (error) {
      toolCall.status = 'failed';
      console.error(`Tool ${toolName} failed:`, error);
      return toolCall;
    }
  }

  private extractSearchQuery(task: Task, context: string): string {
    // Extract meaningful search query from task description and context
    const taskWords = task.description.toLowerCase().split(' ');
    const contextWords = context.toLowerCase().split(' ');
    
    // Simple keyword extraction (can be enhanced with NLP)
    const keywords = [...taskWords, ...contextWords]
      .filter(word => word.length > 3)
      .filter(word => !['analyze', 'identify', 'find', 'research', 'based', 'information'].includes(word))
      .slice(0, 5);
    
    return keywords.join(' ');
  }

  private async executeWebSearch(query: string): Promise<string> {
    // Mock web search - replace with actual search API
    return `Search results for "${query}": [Mock search results would appear here. In a real implementation, this would call a search API like Serper, Google, or Bing.]`;
  }

  private async executeCalendarCheck(): Promise<string> {
    return "Calendar checked - available slots found for next week";
  }

  private async executeEmailOutreach(): Promise<string> {
    return "Email templates prepared and ready for outreach";
  }

  private checkDependencies(task: Task, completedTasks: Task[]): { satisfied: boolean; missing: string[] } {
    const completedTaskIds = completedTasks.map(t => t.id);
    const missing = task.dependencies.filter(dep => !completedTaskIds.includes(dep));
    return {
      satisfied: missing.length === 0,
      missing
    };
  }

  private buildTaskContext(task: Task, completedTasks: Task[]): string {
    const relevantTasks = completedTasks.filter(t => task.dependencies.includes(t.id));
    return relevantTasks
      .map(t => `${t.id}: ${t.result?.substring(0, 500)}...`)
      .join('\n\n');
  }

  private buildAgentPrompt(agent: Agent, task: Task, context: string, toolResults: ToolCall[]): string {
    const toolContext = toolResults
      .map(tool => `Tool ${tool.name} result: ${tool.result}`)
      .join('\n');

    return `
You are a ${agent.role}.
Goal: ${agent.goal}
Backstory: ${agent.backstory}

Task: ${task.description}
Expected Output: ${task.expectedOutput}

Previous Context:
${context}

Tool Results:
${toolContext}

Please provide a detailed response following the expected output format.
    `.trim();
  }

  private buildFinalResult(completedTasks: Task[]): string {
    return completedTasks
      .map(task => `## ${task.id}\n${task.result}`)
      .join('\n\n');
  }

  // Validation functions (similar to your Python guardrails)
  private validateTopicAnalysis = (result: string): { valid: boolean; message: string } => {
    const requiredSections = [
      'Overview and Key Concepts',
      'Trends and Developments',
      'Challenges and Opportunities',
      'Different Perspectives'
    ];
    
    const missingSections = requiredSections.filter(section => 
      !result.toLowerCase().includes(section.toLowerCase())
    );
    
    if (missingSections.length > 0) {
      return {
        valid: false,
        message: `Missing required sections: ${missingSections.join(', ')}`
      };
    }
    
    return { valid: true, message: 'Topic analysis format valid' };
  };

  private validateContactInfo = (result: string): { valid: boolean; message: string } => {
    if (!result.toLowerCase().includes('contact information')) {
      return {
        valid: false,
        message: 'Missing Contact Information section'
      };
    }
    
    // Check for numbered guest entries
    const guestEntries = result.match(/\d+\.\s+[^\n]+/g);
    if (!guestEntries || guestEntries.length === 0) {
      return {
        valid: false,
        message: 'No numbered guest entries found'
      };
    }
    
    return { valid: true, message: 'Contact information format valid' };
  };
}
