import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Grid
} from '@mui/material';

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
    title: 'Project 227171655',
    embedSrc: 'https://www.behance.net/embed/project/227171655?ilo0=1',
    behanceUrl: 'https://www.behance.net/gallery/227171655',
    description: 'Creative exploration in visual design and digital art.'
  },
  {
    id: '3',
    title: 'Project 228140981',
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Art
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Visual explorations at the intersection of technology, consciousness, and creativity.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4 
        }}>
          {artProjects.map((project) => (
            <Card key={project.id} sx={{ overflow: 'visible' }}>
              <Box sx={{ 
                position: 'relative', 
                paddingBottom: '78%', // Maintain Behance's 404x316 aspect ratio
                height: 0 
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
              
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {project.title}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  {project.description}
                </Typography>
                
                <Typography variant="body2" color="primary">
                  <a 
                    href={project.behanceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    View full project →
                  </a>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Art;
