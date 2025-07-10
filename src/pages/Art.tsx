import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button
} from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

interface ArtProject {
  id: string;
  title: string;
  embedSrc: string;
  behanceUrl: string;
  description: string;
}

const artProjects: ArtProject[] = [
  {
    id: '1',
    title: 'Liminal Curvatures',
    embedSrc: 'https://www.behance.net/embed/project/229744893?ilo0=1',
    behanceUrl: 'https://www.behance.net/gallery/229744893/Liminal-Curvatures',
    description: 'Exploring the boundaries between dimensions through fluid, organic forms.'
  },
  {
    id: '2',
    title: 'Creative Exploration',
    embedSrc: 'https://www.behance.net/embed/project/227171655?ilo0=1',
    behanceUrl: 'https://www.behance.net/gallery/227171655',
    description: 'Creative exploration in visual design and digital art.'
  },
  {
    id: '3',
    title: 'Digital Storytelling',
    embedSrc: 'https://www.behance.net/embed/project/228140981?ilo0=1',
    behanceUrl: 'https://www.behance.net/gallery/228140981',
    description: 'Innovative approach to digital creativity and visual storytelling.'
  },
  {
    id: '4', 
    title: 'Primal Vibrations',
    embedSrc: 'https://www.behance.net/embed/project/227711897?ilo0=1',
    behanceUrl: 'https://www.behance.net/gallery/227711897/Primal-Vibrations',
    description: 'A visual journey into the fundamental frequencies that shape our reality.'
  },
  {
    id: '5',
    title: 'Radiant Odyssey', 
    embedSrc: 'https://www.behance.net/embed/project/226134717?ilo0=1',
    behanceUrl: 'https://www.behance.net/gallery/226134717/Radiant-Odyssey',
    description: 'An exploration of light, energy, and transformation through digital art.'
  }
];

const Art: React.FC = () => {
  return (
    <Box sx={{ 
      maxWidth: '1200px', 
      mx: 'auto',
      px: { xs: 2, md: 4 },
      py: { xs: 4, md: 8 }
    }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            mb: 3,
            color: 'text.primary',
          }}
        >
          Art
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            maxWidth: '600px',
            mx: 'auto',
            fontWeight: 300,
          }}
        >
          Visual explorations at the intersection of technology, consciousness, and creativity
        </Typography>
      </Box>
      
      {/* Art Projects Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          lg: 'repeat(2, 1fr)'
        },
        gap: 6,
        mb: 8
      }}>
        {artProjects.map((project) => (
          <Card 
            key={project.id}
            sx={{ 
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Box sx={{ 
              position: 'relative', 
              paddingBottom: '60%', // 16:9.6 aspect ratio for better display
              height: 0,
              backgroundColor: '#f5f5f5',
            }}>
              <iframe
                src={project.embedSrc}
                title={project.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
                allow="clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </Box>
            
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 400 }}>
                {project.title}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.6,
                }}
              >
                {project.description}
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<OpenInNew />}
                href={project.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                View Full Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Artist Statement */}
      <Card>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: 300 }}>
            Artistic Philosophy
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '700px',
              mx: 'auto',
              mb: 4,
              fontSize: '1.1rem',
              lineHeight: 1.7,
            }}
          >
            My visual work explores the liminal spaces where technology and consciousness intersect. 
            Each piece is an investigation into the digital sublime, seeking to capture moments of 
            transcendence within algorithmic processes and computational aesthetics.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontStyle: 'italic',
            }}
          >
            "In the marriage of code and creativity, new forms of beauty emerge."
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Art;
