import { Box, Typography, Paper, Tabs, Tab } from '@mui/material'
import { TaskChatInterface } from '../components/TaskChatInterface'
import AgentOrchestratorUI from '../components/AgentOrchestratorUI'
import { useState } from 'react'
import type { OrchestrationResult } from '../services/AgentOrchestrator'

export default function TaskChat() {
  const [activeTab, setActiveTab] = useState(0)
  
  const handleOrchestrationComplete = (result: OrchestrationResult) => {
    console.log('Agent orchestration completed:', result)
    // You could show results in the chat interface or save to state
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            mb: 3,
            fontWeight: 300,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Agentic Task Assistant
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            fontWeight: 300,
            opacity: 0.8,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.4,
          }}
        >
          CrewAI-style multi-agent orchestration with tool use and user confirmation workflows
        </Typography>
        
        <Paper
          elevation={1}
          sx={{
            p: 3,
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            maxWidth: '700px',
            mx: 'auto',
            mb: 4,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 300, lineHeight: 1.6 }}>
            <strong>Development Roadmap:</strong>
            <br />1. ✅ Chat UI with voice input simulation
            <br />2. ✅ CrewAI-style agent orchestration
            <br />3. ✅ Multi-agent workflows with tool use
            <br />4. ✅ User confirmation steps
            <br />5. 🔄 Cloud API integration (OpenAI/Claude)
            <br />6. 🔄 Real voice input (Whisper API)
            <br />7. 🔄 Persistent task/project updates
          </Typography>
        </Paper>
      </Box>

      {/* Tab Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Task Chat" />
          <Tab label="Agent Orchestrator" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* // ...existing code... */}
          <TaskChatInterface />
        </Box>
      )}

      {activeTab === 1 && (
        <AgentOrchestratorUI onComplete={handleOrchestrationComplete} />
      )}

      {/* Implementation Notes */}
      <Box sx={{ mt: 6 }}>
        <Paper
          elevation={1}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
            Implementation Strategy
          </Typography>
          
          <Box component="ul" sx={{ pl: 3, '& li': { mb: 1, fontSize: '0.95rem', lineHeight: 1.6 } }}>
            <li>
              <strong>Chat Foundation:</strong> Build conversational interface first for task refinement
            </li>
            <li>
              <strong>Cloud API:</strong> Integrate with OpenAI/Claude for natural language processing
            </li>
            <li>
              <strong>Agent Architecture:</strong> Layer 2-agent system (classification → formatting)
            </li>
            <li>
              <strong>Data Integration:</strong> Connect to Airtable/Notion for task persistence
            </li>
            <li>
              <strong>Voice Layer:</strong> Add Whisper speech-to-text as final enhancement
            </li>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
