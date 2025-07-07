import React, { useState } from 'react'
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'
import {
  Mic,
  MicOff,
  Send,
  Close,
} from '@mui/icons-material'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { laneServiceManager, type LaneId } from '../services/LaneServiceManager'
import { agentAPI, type ClassificationResult } from '../services/AgentAPI'

interface VoiceAssistantProps {
  className?: string
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [classifiedLane, setClassifiedLane] = useState<LaneId | null>(null)
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedUpdate, setProcessedUpdate] = useState<string>('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    transcript,
    isListening,
    hasRecognitionSupport,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  // Get all lane information from the service manager
  const PROJECT_LANES = laneServiceManager.getAllLaneInfo()

  // Helper function to get chip color based on lane ID
  const getChipColor = (laneId: LaneId): 'primary' | 'secondary' | 'success' | 'warning' => {
    switch (laneId) {
      case 'podcasting': return 'primary'
      case 'podcast-bots-ai': return 'secondary' 
      case 'accelerator-work': return 'success'
      case 'miscellaneous': return 'warning'
      default: return 'primary'
    }
  }

  // Process the transcript and classify it
  const processUpdate = async () => {
    if (!transcript.trim()) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      // Use the real backend for classification
      const result = await agentAPI.classifyUpdate(transcript)
      
      setClassificationResult(result)
      setClassifiedLane(result.lane as LaneId)
      setProcessedUpdate(transcript)
      
    } catch (err) {
      console.error('Classification error:', err)
      setError(err instanceof Error ? err.message : 'Classification failed')
      
      // Fallback to local classification
      const lane = laneServiceManager.classifyUpdate(transcript)
      setClassifiedLane(lane)
      setProcessedUpdate(transcript)
    } finally {
      setIsProcessing(false)
    }
  }

  // Send update to the classified lane
  const sendUpdate = async () => {
    if (!classifiedLane || !processedUpdate) return
    
    setIsSending(true)
    setError(null)
    
    try {
      // Try to use the backend API first
      const success = await agentAPI.processLaneUpdate(classifiedLane, processedUpdate)
      
      if (success) {
        const laneInfo = laneServiceManager.getLaneInfo(classifiedLane)
        alert(`Update sent to ${laneInfo?.name}! Agent processing initiated.`)
        handleClose()
      } else {
        alert('Failed to send update. Please try again.')
      }
    } catch (err) {
      console.error('Error sending update:', err)
      setError(err instanceof Error ? err.message : 'Failed to send update')
      
      // Fallback to local processing
      try {
        const success = await laneServiceManager.sendUpdate(classifiedLane, processedUpdate)
        if (success) {
          const laneInfo = laneServiceManager.getLaneInfo(classifiedLane)
          alert(`Update sent to ${laneInfo?.name} (local processing)!`)
          handleClose()
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr)
        alert('An error occurred while sending the update.')
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    stopListening()
    resetTranscript()
    setClassifiedLane(null)
    setClassificationResult(null)
    setProcessedUpdate('')
    setIsProcessing(false)
    setError(null)
  }

  const handleMicClick = () => {
    if (!hasRecognitionSupport) {
      alert('Speech recognition is not supported in your browser')
      return
    }
    setIsOpen(true)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <>
      {/* Floating Mic Button */}
      <Fab
        color="primary"
        aria-label="voice assistant"
        onClick={handleMicClick}
        className={className}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
          },
        }}
      >
        <Mic />
      </Fab>

      {/* Voice Assistant Dialog */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            border: '1px solid #333',
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Voice Assistant</Typography>
            <Button onClick={handleClose} color="inherit">
              <Close />
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Recording Section */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">Record Update</Typography>
                <Button
                  variant={isListening ? "contained" : "outlined"}
                  color={isListening ? "error" : "primary"}
                  onClick={toggleListening}
                  startIcon={isListening ? <MicOff /> : <Mic />}
                  disabled={!hasRecognitionSupport}
                >
                  {isListening ? 'Stop' : 'Start'} Recording
                </Button>
              </Box>

              {!hasRecognitionSupport && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Speech recognition is not supported in your browser
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                sx={{
                  minHeight: 100,
                  p: 2,
                  border: '1px solid #333',
                  borderRadius: 1,
                  bgcolor: isListening ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {transcript || (isListening ? 'Listening...' : 'Click Start Recording to begin')}
                </Typography>
              </Box>
            </Box>

            {/* Process Button */}
            {transcript && !classifiedLane && (
              <Button
                variant="contained"
                onClick={processUpdate}
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} /> : <Send />}
              >
                {isProcessing ? 'Processing...' : 'Process Update'}
              </Button>
            )}

            {/* Classification Results */}
            {classifiedLane && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Classified Lane
                  </Typography>
                  <Chip
                    label={PROJECT_LANES.find(l => l.id === classifiedLane)?.name}
                    color={getChipColor(classifiedLane)}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {PROJECT_LANES.find(l => l.id === classifiedLane)?.description}
                  </Typography>
                  
                  {classificationResult && (
                    <>
                      <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>
                        Confidence: {(classificationResult.confidence * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>
                        Reasoning: {classificationResult.reasoning}
                      </Typography>
                    </>
                  )}
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Processed Update
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid #333',
                      borderRadius: 1,
                      bgcolor: 'rgba(0, 255, 0, 0.05)',
                    }}
                  >
                    <Typography variant="body2">{processedUpdate}</Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="success"
                  onClick={sendUpdate}
                  disabled={isSending}
                  startIcon={isSending ? <CircularProgress size={20} /> : <Send />}
                  fullWidth
                >
                  {isSending ? 'Sending...' : `Send to ${PROJECT_LANES.find(l => l.id === classifiedLane)?.name}`}
                </Button>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
