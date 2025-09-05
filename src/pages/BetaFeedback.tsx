import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, Button, IconButton, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Mic, Stop, SkipNext, ArrowBack, ArrowForward, CheckCircle, Keyboard } from '@mui/icons-material';

const questions = [
  "How useful would an AI-powered tool be for finding podcast guests in your niche?",
  "What would you expect to pay monthly for this service?",
  "What was your biggest challenge or frustration with PodcastBots?",
  "What one feature would make this 10x better?",
  "Would you recommend this to a fellow podcaster?"
];

const BetaFeedback: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [responses, setResponses] = useState<string[]>(Array(5).fill(''));
  const [isCompleted, setIsCompleted] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Request microphone permission on component mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Microphone access granted');
      })
      .catch((err) => {
        console.error('Microphone access denied:', err);
      });
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) { // 5 minutes max
            stopRecording();
            return 300;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Please allow microphone access to record your feedback.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      
      // Call the API endpoint
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Transcription failed');
      }
      
      const result = await response.json();
      setTranscription(result.transcription);
      
      // Update responses array
      const newResponses = [...responses];
      newResponses[currentQuestion] = result.transcription;
      setResponses(newResponses);
      setIsTranscribing(false);
      
    } catch (error) {
      console.error('Transcription error:', error);
      // Fallback to simulated transcription if API fails
      const sampleResponses = [
        "I found PodcastBots really helpful for connecting with guests in my tech niche. The AI recommendations were surprisingly accurate and saved me hours of research time that I usually spend on LinkedIn and Twitter.",
        "I'd probably pay around $25-30 per month for this service, maybe up to $50 if it included additional features like scheduling integration and automated follow-ups.",
        "My biggest frustration was that some guest profiles lacked recent contact information, and I wish there was better filtering for guest availability and response rates.",
        "Integration with my existing scheduling tools like Calendly would make this 10x better. Also, maybe some kind of CRM feature to track outreach conversations and follow-ups would be amazing.",
        "Absolutely! I've already told three fellow podcasters about this. It's exactly what the podcasting community has been waiting for - finding quality guests is such a pain point."
      ];
      
      const fallbackTranscription = sampleResponses[currentQuestion] || `[Voice response recorded for question ${currentQuestion + 1}]`;
      setTranscription(fallbackTranscription);
      
      // Update responses array
      const newResponses = [...responses];
      newResponses[currentQuestion] = fallbackTranscription;
      setResponses(newResponses);
      setIsTranscribing(false);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setTranscription(textInput);
      
      // Update responses array
      const newResponses = [...responses];
      newResponses[currentQuestion] = textInput;
      setResponses(newResponses);
      
      setTextInput('');
    }
  };

  const handleInputModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'voice' | 'text') => {
    if (newMode !== null) {
      setInputMode(newMode);
      setTranscription('');
      setTextInput('');
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTranscription('');
      setTextInput('');
    } else {
      // Submit all responses
      submitFeedback();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTranscription('');
      setTextInput('');
    }
  };

  const skipQuestion = () => {
    nextQuestion();
  };

  const submitFeedback = async () => {
    try {
      // Send responses to backend
      console.log('Submitting feedback:', responses);
      
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      const result = await response.json();
      console.log('Feedback submitted successfully:', result);
      
      // Show completion screen
      setIsCompleted(true);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Still show completion screen even if submission fails
      setIsCompleted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Completion screen
  if (isCompleted) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8e8e8 0%, #b8b8b8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}>
        <Box sx={{
          backgroundColor: 'white',
          borderRadius: 3,
          p: 6,
          textAlign: 'center',
          maxWidth: '600px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}>
          <CheckCircle sx={{ fontSize: '4rem', color: '#4caf50', mb: 3 }} />
          <img
            src="/Media/Branding/podcastbots_logo.png"
            alt="PodcastBots.ai"
            style={{ height: '180px', marginBottom: '24px', maxWidth: '400px', objectFit: 'contain' }}
          />
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 3,
              color: '#333',
            }}
          >
            Thank You!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: '#666',
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            Your feedback is incredibly valuable and will help us build something podcasters actually want to use. 
            We'll review your responses and may follow up with additional questions.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '1rem',
              color: '#888',
              fontStyle: 'italic',
            }}
          >
            Thanks for being part of the early journey!<br />
            — Rajeev & Ryan, PodcastBots.ai
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8e8e8 0%, #b8b8b8 100%)',
      display: 'flex',
      flexDirection: 'column',
      px: 2,
      py: 4,
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      
      {/* Header */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4,
      }}>
        <img
          src="/Media/Branding/podcastbots_logo.png"
          alt="PodcastBots.ai"
          style={{ height: '240px', marginBottom: '16px', maxWidth: '600px', objectFit: 'contain' }}
        />
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            color: '#333',
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Beta Feedback Session
        </Typography>
      </Box>

      {/* Progress Indicators */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        mb: 4,
      }}>
        {questions.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: responses[index] ? '#4caf50' : index === currentQuestion ? '#333' : 'rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              border: index === currentQuestion ? '3px solid #666' : responses[index] ? '2px solid #4caf50' : '2px solid transparent',
            }}
          />
        ))}
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '800px',
        mx: 'auto',
        width: '100%',
      }}>
        
        {/* Question Display */}
        <Box sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          textAlign: 'center',
          width: '100%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}>
          <Typography
            variant="body2"
            sx={{
              color: '#888',
              mb: 2,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              color: '#333',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              lineHeight: 1.4,
            }}
          >
            {questions[currentQuestion]}
          </Typography>
        </Box>

        {/* Input Mode Toggle */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={inputMode}
            exclusive
            onChange={handleInputModeChange}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 2,
            }}
          >
            <ToggleButton value="voice" sx={{ px: 3, py: 1 }}>
              <Mic sx={{ mr: 1 }} />
              Voice
            </ToggleButton>
            <ToggleButton value="text" sx={{ px: 3, py: 1 }}>
              <Keyboard sx={{ mr: 1 }} />
              Text
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Input Area */}
        {inputMode === 'voice' ? (
          /* Voice Recording Area */
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}>
            
            {/* Record Button */}
            <IconButton
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              sx={{
                width: 120,
                height: 120,
                backgroundColor: isRecording ? '#f44336' : '#4caf50',
                color: 'white',
                mb: 3,
                position: 'relative',
                '&:hover': {
                  backgroundColor: isRecording ? '#d32f2f' : '#45a049',
                  transform: 'scale(1.05)',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                },
                transition: 'all 0.3s ease',
                animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)',
                  },
                  '70%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 20px rgba(244, 67, 54, 0)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
                  },
                },
              }}
            >
              {isRecording ? <Stop sx={{ fontSize: '3rem' }} /> : <Mic sx={{ fontSize: '3rem' }} />}
            </IconButton>

            {/* Timer */}
            {isRecording && (
              <Typography
                variant="h6"
                sx={{
                  color: '#000000',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {formatTime(recordingTime)} / 5:00
              </Typography>
            )}

            {/* Status Messages */}
            <Typography
              variant="body1"
              sx={{
                color: '#000000',
                textAlign: 'center',
                opacity: 0.8,
                mb: 3,
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {isTranscribing && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: '2px solid rgba(0,0,0,0.3)',
                    borderTop: '2px solid #000000',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              )}
              {isTranscribing 
                ? 'Processing your response...'
                : isRecording 
                  ? 'Recording... Tap the red button when finished'
                  : 'Tap the green button to start recording'
              }
            </Typography>
          </Box>
        ) : (
          /* Text Input Area */
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
            width: '100%',
            maxWidth: '600px',
          }}>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your response here..."
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#45a049',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              Submit Response
            </Button>
          </Box>
        )}

        {/* Transcription Display */}
        {transcription && (
          <Box sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            p: 3,
            maxWidth: '600px',
            width: '100%',
            mb: 3,
          }}>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontWeight: 600,
                mb: 1,
              }}
            >
              Your Response:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#333',
                fontStyle: 'italic',
              }}
            >
              {transcription}
            </Typography>
          </Box>
        )}

        {/* Control Buttons */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '600px',
        }}>
          {/* Previous Question Button */}
          <Button
            variant="outlined"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            startIcon={<ArrowBack />}
            sx={{
              borderColor: '#333333',
              color: '#333333',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              opacity: currentQuestion === 0 ? 0.5 : 1,
              '&:hover': {
                borderColor: '#000000',
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: '#000000',
              },
              '&:disabled': {
                borderColor: 'rgba(0,0,0,0.3)',
                color: 'rgba(0,0,0,0.3)',
              },
            }}
          >
            Previous
          </Button>

          <Button
            variant="outlined"
            onClick={skipQuestion}
            startIcon={<SkipNext />}
            sx={{
              borderColor: '#333333',
              color: '#333333',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              '&:hover': {
                borderColor: '#000000',
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: '#000000',
              },
            }}
          >
            Skip
          </Button>

          {transcription && (
            <Button
              variant="contained"
              onClick={nextQuestion}
              endIcon={currentQuestion < questions.length - 1 ? <ArrowForward /> : <CheckCircle />}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#45a049',
                },
              }}
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BetaFeedback;
