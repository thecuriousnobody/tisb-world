import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  SmartToy as BotIcon,
  Search as SearchIcon,
  TrendingUp as OpportunityIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { enhancedChatAgent, type EnhancedAgentRequest } from '../services/EnhancedChatAgent'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system' | 'error'
  content: string
  timestamp: string
  data?: any
  opportunities?: any[]
  web_research?: any
}

const lanes = [
  { id: 'podcasting', name: 'Podcasting', color: 'primary' },
  { id: 'podcast-bots-ai', name: 'Podcast Bots AI', color: 'secondary' },
  { id: 'accelerator-work', name: 'Accelerator Work', color: 'success' },
  { id: 'miscellaneous', name: 'Miscellaneous', color: 'warning' },
] as const

export const TaskChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Hi! I\'m your productivity assistant. Tell me about your task updates and I\'ll help organize them across your project lanes.',
      timestamp: new Date().toISOString(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [searchEnabled, setSearchEnabled] = useState(true)
  const [proactiveMode, setProactiveMode] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Process message using the Enhanced Chat Agent
  const processMessage = async (message: string): Promise<string> => {
    try {
      // Build context from recent messages
      const context = messages.slice(-4).map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))

      const request: EnhancedAgentRequest = {
        user_message: message,
        conversation_context: context,
        user_profile: {
          location: 'Peoria, IL',
          interests: ['AI', 'podcasting', 'startups', 'venture capital'],
          current_projects: ['Podcast Bots AI', 'Podcasting', 'Accelerator Work'],
          goals: ['grow startup', 'expand network', 'find funding', 'content creation']
        },
        search_enabled: searchEnabled,
        proactive_suggestions: proactiveMode
      }

      const response = await enhancedChatAgent.processEnhancedRequest(request)
      
      // If there are opportunities or research results, add them to the message
      if (response.opportunities_detected || response.web_research) {
        const lastMessage = messages[messages.length - 1]
        if (lastMessage && lastMessage.type === 'user') {
          // Add research data to be displayed in the UI
          setTimeout(() => {
            setMessages(prev => prev.map(msg => 
              msg.id === lastMessage.id 
                ? { ...msg, opportunities: response.opportunities_detected, web_research: response.web_research }
                : msg
            ))
          }, 100)
        }
      }
      
      return response.response
    } catch (error) {
      console.error('Enhanced Agent Error:', error)
      throw new Error('Failed to process message with enhanced agent')
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await processMessage(userMessage.content)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'Sorry, I had trouble processing that. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // TODO: Integrate with your existing voice recognition
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setInput("I completed the API integration for Podcast Bots today and I'm about 40% done with the UI improvements. Still need to finish the user testing.")
        setIsRecording(false)
      }, 3000)
    }
  }

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <BotIcon sx={{ color: '#667eea' }} />
          <Typography variant="h5" sx={{ fontWeight: 400 }}>
            Task Assistant
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          Chat interface for task refinement → Cloud API → Agent processing
        </Typography>
        
        {/* Lane indicators */}
        <Box display="flex" gap={1} flexWrap="wrap">
          {lanes.map(lane => (
            <Chip
              key={lane.id}
              label={lane.name}
              size="small"
              color={lane.color}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Chat Container */}
      <Paper
        elevation={2}
        sx={{
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  backgroundColor: message.type === 'user' 
                    ? 'rgba(102, 126, 234, 0.2)' 
                    : message.type === 'error'
                    ? 'rgba(244, 67, 54, 0.1)'
                    : message.type === 'system'
                    ? 'rgba(76, 175, 80, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    message.type === 'user' 
                      ? 'rgba(102, 126, 234, 0.3)' 
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    opacity: 0.6,
                    fontSize: '0.7rem',
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}
          
          {isLoading && (
            <Box display="flex" justifyContent="flex-start">
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" sx={{ fontWeight: 300 }}>
                    Processing...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Input Area */}
        <Box sx={{ p: 2 }}>
          {isRecording && (
            <Alert 
              severity="info" 
              sx={{ mb: 2, backgroundColor: 'rgba(102, 126, 234, 0.1)' }}
            >
              🎙️ Recording... Speak your task update
            </Alert>
          )}
          
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me about your task updates..."
              disabled={isLoading || isRecording}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
              }}
            />
            
            <IconButton
              onClick={handleVoiceToggle}
              color={isRecording ? 'error' : 'primary'}
              sx={{
                minWidth: '48px',
                height: '48px',
                backgroundColor: isRecording 
                  ? 'rgba(244, 67, 54, 0.1)' 
                  : 'rgba(102, 126, 234, 0.1)',
                '&:hover': {
                  backgroundColor: isRecording 
                    ? 'rgba(244, 67, 54, 0.2)' 
                    : 'rgba(102, 126, 234, 0.2)',
                },
              }}
            >
              {isRecording ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
            
            <IconButton
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              color="primary"
              sx={{
                minWidth: '48px',
                height: '48px',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Architecture Info */}
      <Paper
        elevation={1}
        sx={{
          mt: 3,
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
          Phase 1: Chat → Cloud API Foundation
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
          This chat interface will be the foundation for your agent system. Next steps:
          <br />• Replace mock API with OpenAI/Claude integration
          <br />• Add task extraction and classification
          <br />• Connect to Airtable/Notion APIs
          <br />• Layer on voice assistant capabilities
        </Typography>
      </Paper>
    </Box>
  )
}
