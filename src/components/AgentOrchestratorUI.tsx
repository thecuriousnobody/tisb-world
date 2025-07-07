import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PlayArrow as PlayArrowIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { AgentOrchestrator } from '../services/AgentOrchestrator';
import type { Task, ToolCall, UserConfirmation, OrchestrationResult } from '../services/AgentOrchestrator';
import { TaskProcessingAPI } from '../services/TaskProcessingAPI';

interface AgentOrchestratorUIProps {
  onComplete?: (result: OrchestrationResult) => void;
}

interface WorkflowExecution {
  id: string;
  topic: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  tasks: Task[];
  toolCalls: ToolCall[];
  currentStep: number;
  result?: OrchestrationResult;
}

interface ProgressUpdate {
  type: 'agent_start' | 'agent_complete' | 'task_update' | 'tool_call' | 'user_confirmation_needed';
  data: any;
}

export const AgentOrchestratorUI: React.FC<AgentOrchestratorUIProps> = ({ onComplete }) => {
  const [topic, setTopic] = useState('');
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [orchestrator, setOrchestrator] = useState<AgentOrchestrator | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    confirmation?: UserConfirmation;
    resolve?: (confirmation: UserConfirmation) => void;
  }>({ open: false });
  
  const [progressLog, setProgressLog] = useState<ProgressUpdate[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  // Initialize orchestrator
  useEffect(() => {
    const taskAPI = new TaskProcessingAPI();
    
    const handleProgress = (update: ProgressUpdate) => {
      setProgressLog(prev => [...prev, update]);
      
      // Update current execution state
      setExecution(prev => {
        if (!prev) return prev;
        
        if (update.type === 'agent_start') {
          return {
            ...prev,
            currentStep: prev.currentStep + 1,
          };
        }
        
        return prev;
      });
    };

    const handleUserConfirmation = async (confirmation: UserConfirmation): Promise<UserConfirmation> => {
      return new Promise((resolve) => {
        setConfirmationDialog({
          open: true,
          confirmation,
          resolve
        });
      });
    };

    const orch = new AgentOrchestrator(taskAPI, handleProgress, handleUserConfirmation);
    setOrchestrator(orch);
  }, []);

  // Auto-scroll progress log
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.scrollTop = progressRef.current.scrollHeight;
    }
  }, [progressLog]);

  const handleStartWorkflow = async () => {
    if (!orchestrator || !topic.trim()) return;

    const newExecution: WorkflowExecution = {
      id: `workflow_${Date.now()}`,
      topic: topic.trim(),
      status: 'running',
      startTime: new Date(),
      tasks: [],
      toolCalls: [],
      currentStep: 0,
    };

    setExecution(newExecution);
    setProgressLog([]);

    try {
      const result = await orchestrator.executeGuestFinderWorkflow(topic.trim());
      
      setExecution(prev => prev ? {
        ...prev,
        status: result.success ? 'completed' : 'failed',
        endTime: new Date(),
        result,
        tasks: result.data?.tasks || [],
        toolCalls: result.data?.toolCalls || [],
      } : null);

      if (onComplete) {
        onComplete(result);
      }

    } catch (error) {
      setExecution(prev => prev ? {
        ...prev,
        status: 'failed',
        endTime: new Date(),
        result: { success: false, error: String(error) }
      } : null);
    }
  };

  const handleConfirmationResponse = (response: 'approved' | 'rejected') => {
    if (confirmationDialog.confirmation && confirmationDialog.resolve) {
      const updatedConfirmation = {
        ...confirmationDialog.confirmation,
        response
      };
      confirmationDialog.resolve(updatedConfirmation);
      setConfirmationDialog({ open: false });
    }
  };

  const getStepIcon = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'running':
        return <CircularProgress size={24} />;
      default:
        return <PsychologyIcon color="disabled" />;
    }
  };

  const getAgentIcon = (agentId: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      topic_analyzer: <PsychologyIcon />,
      expert_finder: <SearchIcon />,
      contact_researcher: <PersonIcon />,
      contact_verifier: <CheckCircleIcon />,
    };
    return iconMap[agentId] || <SmartToyIcon />;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SmartToyIcon fontSize="large" />
        CrewAI-Style Agent Orchestrator
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Multi-agent workflow for podcast guest finding with tool use and user confirmation steps.
      </Typography>

      {/* Input Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            label="Podcast Topic"
            placeholder="e.g., Artificial Intelligence in Healthcare, Climate Change Solutions, etc."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={execution?.status === 'running'}
            multiline
            maxRows={3}
          />
          <Button
            variant="contained"
            onClick={handleStartWorkflow}
            disabled={!topic.trim() || execution?.status === 'running' || !orchestrator}
            startIcon={execution?.status === 'running' ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            sx={{ minWidth: 120 }}
          >
            {execution?.status === 'running' ? 'Running...' : 'Start Workflow'}
          </Button>
        </Box>
      </Paper>

      {/* Workflow Execution Display */}
      {execution && (
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left Column: Workflow Steps */}
          <Paper sx={{ flex: 1, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Workflow Progress
            </Typography>
            
            <Chip
              label={execution.status.toUpperCase()}
              color={
                execution.status === 'completed' ? 'success' :
                execution.status === 'failed' ? 'error' :
                execution.status === 'running' ? 'primary' : 'default'
              }
              sx={{ mb: 2 }}
            />

            <Stepper orientation="vertical" activeStep={execution.currentStep}>
              {execution.tasks.map((task) => (
                <Step key={task.id}>
                  <StepLabel
                    icon={getStepIcon(task)}
                    optional={
                      <Typography variant="caption">
                        {task.agentId.replace('_', ' ').toUpperCase()}
                      </Typography>
                    }
                  >
                    {task.description.substring(0, 60)}...
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ pb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Expected: {task.expectedOutput}
                      </Typography>
                      
                      {task.result && (
                        <Accordion sx={{ mt: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="body2">View Result</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {task.result.substring(0, 500)}
                              {task.result.length > 500 && '...'}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Right Column: Progress Log & Tool Calls */}
          <Box sx={{ flex: 1 }}>
            {/* Progress Log */}
            <Paper sx={{ p: 3, mb: 3, height: 300 }}>
              <Typography variant="h6" gutterBottom>
                Live Progress Log
              </Typography>
              <Box
                ref={progressRef}
                sx={{
                  height: 240,
                  overflowY: 'auto',
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                {progressLog.map((update, index) => (
                  <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getAgentIcon(update.data?.agent || '')}
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      <strong>{update.type.replace('_', ' ')}:</strong> {JSON.stringify(update.data).substring(0, 80)}...
                    </Typography>
                  </Box>
                ))}
                {progressLog.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Progress updates will appear here...
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Tool Calls */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tool Calls ({execution.toolCalls.length})
              </Typography>
              <List dense>
                {execution.toolCalls.map((tool, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <BuildIcon color={tool.status === 'completed' ? 'success' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={tool.name}
                      secondary={`Status: ${tool.status} | ${tool.description.substring(0, 50)}...`}
                    />
                  </ListItem>
                ))}
                {execution.toolCalls.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No tool calls yet...
                  </Typography>
                )}
              </List>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Final Results */}
      {execution?.result?.success && execution.result.data && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Final Results
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            Workflow completed successfully! Generated guest recommendations for "{execution.topic}".
          </Alert>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">View Complete Results</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {execution.result.data.finalResult}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      )}

      {/* User Confirmation Dialog */}
      <Dialog
        open={confirmationDialog.open}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {confirmationDialog.confirmation?.type === 'proceed' && 'Proceed with Task?'}
          {confirmationDialog.confirmation?.type === 'tool_approval' && 'Approve Tool Use?'}
          {confirmationDialog.confirmation?.type === 'result_approval' && 'Approve Result?'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {confirmationDialog.confirmation?.message}
          </Typography>
          
          {confirmationDialog.confirmation?.data && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Additional Context:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {JSON.stringify(confirmationDialog.confirmation.data, null, 2).substring(0, 300)}...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationResponse('rejected')} color="error">
            Reject
          </Button>
          <Button onClick={() => handleConfirmationResponse('approved')} variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Actions */}
      {execution?.status === 'running' && (
        <Tooltip title="Workflow in progress">
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 20, right: 20 }}
            disabled
          >
            <CircularProgress size={24} color="inherit" />
          </Fab>
        </Tooltip>
      )}
    </Box>
  );
};

export default AgentOrchestratorUI;
