import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  IconButton
} from '@mui/material';
import { ThumbUp, ThumbDown, Email } from '@mui/icons-material';
import SocialSection from '../components/SocialSection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AI: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      
      {/* Header */}
      <Box sx={{
        px: { xs: 2, md: 8 },
        mb: 6,
        textAlign: 'center',
      }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 900,
            mb: 3,
          }}
        >
          AI INNOVATIONS
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            opacity: 0.8,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Exploring the intersection of artificial intelligence, automation, and human creativity. 
          From production tools to experimental prototypes.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ 
        px: { xs: 2, md: 8 },
        mb: 4,
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 700,
              py: 2,
              px: 4,
              color: '#000000',
              border: '2px solid #000000',
              borderRadius: 0,
              mr: 2,
              '&.Mui-selected': {
                backgroundColor: '#FF4500',
                color: '#000000',
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 69, 0, 0.1)',
              }
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            }
          }}
        >
          <Tab label="IN PRODUCTION" />
          <Tab label="IDEAS LAB" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ px: { xs: 2, md: 8 } }}>
        
        {/* Production Tab */}
        <TabPanel value={tabValue} index={0}>
          <Card sx={{ 
            mb: 4, 
            overflow: 'visible',
            backgroundColor: '#000000',
            color: 'white',
            border: '3px solid #FF4500',
          }}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 3,
                  color: '#FF4500',
                }}
              >
                PODCASTBOTS.AI
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  mb: 4,
                  lineHeight: 1.6,
                  opacity: 0.9,
                }}
              >
                AI-powered platform for podcast creators. Automates guest discovery, outreach, and content 
                optimization so creators can focus on meaningful conversations. Built with the philosophy 
                that AI should enhance human creativity, not replace it.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  href="https://www.podcastbots.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    py: 2,
                    px: 4,
                    backgroundColor: '#FF4500',
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: '#e63e00',
                    }
                  }}
                >
                  LAUNCH PODCASTBOTS.AI
                </Button>
              </Box>
              
              {/* iframe embed */}
              <Box sx={{ 
                position: 'relative', 
                width: '100%',
                height: '600px',
                border: '2px solid #FF4500',
                borderRadius: 0,
                overflow: 'hidden'
              }}>
                <iframe
                  src="https://www.podcastbots.ai/"
                  title="Podcast Bots AI"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allowFullScreen
                />
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Ideas Lab Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
              }}
            >
              EXPERIMENTAL PROTOTYPES
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.125rem' },
                textAlign: 'center',
                opacity: 0.8,
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
                lineHeight: 1.6,
              }}
            >
              Early-stage concepts and prototypes exploring new possibilities. Your feedback helps shape 
              these ideas into practical solutions.
            </Typography>
          </Box>

          {/* KettleMic Card */}
          <Card sx={{ 
            mb: 6,
            border: '3px solid #000000',
            borderRadius: 0,
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
            }}>
              <Box 
                component="video"
                controls
                sx={{ 
                  width: { xs: '100%', md: '40%' },
                  height: { xs: '300px', md: '400px' },
                  objectFit: 'cover',
                  backgroundColor: '#000000',
                }}
                src="/Media/Prototypes/KettleMic/kettleMicProto.mp4"
                poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkY0NTAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+S0VUVExFTUlDPC90ZXh0Pgo8L3N2Zz4="
              />
              <CardContent sx={{ 
                flex: 1,
                p: { xs: 3, md: 4 },
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  KETTLEMIC
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    backgroundColor: '#FF4500',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 0,
                    fontWeight: 600,
                    display: 'inline-block',
                    mb: 3,
                  }}
                >
                  PROTOTYPE
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  Solving the fundamental instability problem of microphone stands. Traditional stands are 
                  unstable, move around, and aren't easily configurable. KettleMic reimagines the microphone 
                  stand as a stable, weighted base with flexible positioning.
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  HELP REFINE THIS IDEA
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 3,
                  alignItems: 'center',
                }}>
                  <IconButton 
                    sx={{ 
                      border: '2px solid #000000',
                      borderRadius: 0,
                      '&:hover': { backgroundColor: 'rgba(0, 255, 0, 0.1)' }
                    }}
                  >
                    <ThumbUp />
                  </IconButton>
                  <IconButton 
                    sx={{ 
                      border: '2px solid #000000',
                      borderRadius: 0,
                      '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' }
                    }}
                  >
                    <ThumbDown />
                  </IconButton>
                  <Button
                    startIcon={<Email />}
                    variant="outlined"
                    href="mailto:rajeev@theideasandbox.com?subject=KettleMic Feedback"
                    sx={{
                      borderColor: '#FF4500',
                      color: '#FF4500',
                      borderRadius: 0,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#FF4500',
                        backgroundColor: 'rgba(255, 69, 0, 0.1)',
                      }
                    }}
                  >
                    SEND FEEDBACK
                  </Button>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic',
                    opacity: 0.7,
                  }}
                >
                  Your insights help shape these prototypes into real solutions. What features matter most to you?
                </Typography>
              </CardContent>
            </Box>
          </Card>

          {/* Coming Soon Section */}
          <Box sx={{
            textAlign: 'center',
            py: 6,
            border: '2px dashed #000000',
            borderRadius: 0,
            backgroundColor: 'rgba(255, 69, 0, 0.05)',
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
              }}
            >
              MORE IDEAS BREWING...
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.8,
                mb: 3,
              }}
            >
              3D printed prototypes, automation tools, and AI experiments coming soon.
            </Typography>
            <Button
              variant="outlined"
              href="mailto:rajeev@theideasandbox.com?subject=Ideas Lab - New Concept"
              sx={{
                borderColor: '#FF4500',
                color: '#FF4500',
                borderRadius: 0,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#FF4500',
                  backgroundColor: 'rgba(255, 69, 0, 0.1)',
                }
              }}
            >
              SUGGEST AN IDEA
            </Button>
          </Box>
        </TabPanel>
      </Box>

      {/* Social Section */}
      <SocialSection />
    </Box>
  );
};

export default AI;
