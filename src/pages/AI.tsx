import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Launch, Email } from '@mui/icons-material';
import SocialSection from '../components/SocialSection';
import GitHubProjectsFeed from '../components/GitHubProjectsFeed';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

// Production projects data
const productionProjects = [
  {
    name: 'PODCASTBOTS.AI',
    description:
      'AI-powered platform for podcast creators. Automates guest discovery, outreach, and content optimization so creators can focus on meaningful conversations.',
    url: 'https://www.podcastbots.ai/',
    stack: ['CrewAI', 'React', 'Python', 'LLMs'],
    status: 'LIVE',
  },
  {
    name: 'DESILO',
    description:
      'The AI system that does the grunt work so you can focus on building. Intelligent research, market analysis, and planning tools for entrepreneurs and startups. Built for the Central Illinois innovation ecosystem.',
    url: 'https://potentiator.ai/',
    stack: ['CrewAI', 'Market Intelligence', 'Agents'],
    status: 'LIVE',
  },
];

const AI: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 } }}>

      {/* Header */}
      <Box sx={{ px: { xs: 2, md: 8 }, mb: 5, textAlign: 'center' }}>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 900, mb: 2 }}
        >
          AI INNOVATIONS
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.15rem' },
            opacity: 0.7,
            maxWidth: '700px',
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          What happens when the tools that used to require a department now fit in a conversation.
          We're building with it, writing about it, and arguing about who should own it.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: { xs: 2, md: 8 }, mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.85rem', md: '1rem' },
              fontWeight: 700,
              py: 1.5,
              px: 3,
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 0,
              mr: 1,
              minHeight: 'auto',
              '&.Mui-selected': { backgroundColor: 'primary.main', color: 'background.default' },
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
            },
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          <Tab label="IN PRODUCTION" />
          <Tab label="OPEN SOURCE" />
          <Tab label="IDEAS LAB" />
        </Tabs>
      </Box>

      <Box sx={{ px: { xs: 2, md: 8 } }}>

        {/* ═══ PRODUCTION TAB ═══ */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}>
            {productionProjects.map((project) => (
              <Card
                key={project.name}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => window.open(project.url, '_blank')}
              >
                {/* Accent top bar */}
                <Box sx={{ height: 4, backgroundColor: 'primary.main' }} />

                <CardContent sx={{ p: { xs: 3, md: 4 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, color: 'primary.main' }}>
                      {project.name}
                    </Typography>
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'background.default',
                        fontWeight: 700,
                        borderRadius: 0,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Typography sx={{ fontSize: '1rem', lineHeight: 1.7, opacity: 0.85, mb: 3, flex: 1 }}>
                    {project.description}
                  </Typography>

                  {/* Stack tags */}
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 3 }}>
                    {project.stack.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)', borderRadius: 0, fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>

                  {/* Launch button */}
                  <Button
                    variant="contained"
                    endIcon={<Launch />}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'background.default',
                      fontWeight: 700,
                      borderRadius: 0,
                      alignSelf: 'flex-start',
                      '&:hover': { backgroundColor: 'primary.main', opacity: 0.9 },
                    }}
                  >
                    LAUNCH
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        {/* ═══ OPEN SOURCE TAB ═══ */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 2 }}
            >
              CODE IN THE WILD
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                opacity: 0.7,
                maxWidth: '700px',
                mx: 'auto',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              Every repo is a rabbit hole of curiosity — from AI-powered podcast tools to
              experimental automation systems.
            </Typography>
          </Box>
          <GitHubProjectsFeed />
        </TabPanel>

        {/* ═══ IDEAS LAB TAB ═══ */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 2 }}
            >
              EXPERIMENTAL PROTOTYPES
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                opacity: 0.7,
                maxWidth: '700px',
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Early-stage concepts and prototypes. Your feedback helps shape these into real solutions.
            </Typography>
          </Box>

          {/* KettleMic */}
          <Card sx={{ mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              <Box
                component="video"
                controls
                sx={{
                  width: { xs: '100%', md: '40%' },
                  height: { xs: '250px', md: '350px' },
                  objectFit: 'cover',
                  backgroundColor: 'background.default',
                }}
                src="/Media/Prototypes/KettleMic/kettleMicProto.mp4"
              />
              <CardContent sx={{ flex: 1, p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography sx={{ fontSize: { xs: '1.3rem', md: '1.6rem' }, fontWeight: 800 }}>
                    KETTLEMIC
                  </Typography>
                  <Chip
                    label="PROTOTYPE"
                    size="small"
                    sx={{ backgroundColor: '#f5c542', color: 'background.default', fontWeight: 700, borderRadius: 0, fontSize: '0.65rem' }}
                  />
                </Box>

                <Typography sx={{ fontSize: '1rem', lineHeight: 1.7, mb: 3 }}>
                  Solving the fundamental instability problem of microphone stands. KettleMic
                  reimagines the mic stand as a stable, weighted base with flexible positioning.
                </Typography>

                <Button
                  startIcon={<Email />}
                  variant="outlined"
                  href="mailto:rajeev@theideasandbox.com?subject=KettleMic Feedback"
                  sx={{
                    borderColor: '#f5c542',
                    color: '#f5c542',
                    borderRadius: 0,
                    fontWeight: 600,
                    '&:hover': { borderColor: '#f5c542', backgroundColor: 'rgba(255, 69, 0, 0.08)' },
                  }}
                >
                  SEND FEEDBACK
                </Button>
              </CardContent>
            </Box>
          </Card>

          {/* More coming */}
          <Box sx={{
            textAlign: 'center',
            py: 5,
            border: '2px dashed rgba(0,0,0,0.2)',
            backgroundColor: 'rgba(255, 69, 0, 0.03)',
          }}>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
              MORE IDEAS BREWING...
            </Typography>
            <Typography sx={{ opacity: 0.6, mb: 2, fontSize: '0.95rem' }}>
              3D printed prototypes, automation tools, and AI experiments.
            </Typography>
            <Button
              variant="outlined"
              href="mailto:rajeev@theideasandbox.com?subject=Ideas Lab - New Concept"
              sx={{
                borderColor: '#f5c542',
                color: '#f5c542',
                borderRadius: 0,
                fontWeight: 600,
                '&:hover': { borderColor: '#f5c542', backgroundColor: 'rgba(255, 69, 0, 0.08)' },
              }}
            >
              SUGGEST AN IDEA
            </Button>
          </Box>
        </TabPanel>
      </Box>

      <SocialSection />
    </Box>
  );
};

export default AI;
