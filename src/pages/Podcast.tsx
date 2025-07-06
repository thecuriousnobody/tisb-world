import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip,
  Stack
} from '@mui/material';

interface PodcastEpisode {
  id: string;
  youtubeId: string;
  tags: string[];
  publishDate: string;
}

const episodes: PodcastEpisode[] = [
  {
    id: '1',
    youtubeId: 'qAu_77ld41w',
    tags: ['AI', 'Creativity', 'Future of Work', 'Technology'],
    publishDate: '2024-12-15'
  },
  {
    id: '2',
    youtubeId: 'jGSlGG2aMzo',
    tags: ['Startups', 'Community', 'Transparency', 'Entrepreneurship'],
    publishDate: '2024-11-28'
  },
  {
    id: '3',
    youtubeId: 'UYVr9PhY9y4',
    tags: ['Music Production', 'Sound Design', 'Technology', 'Creative Process'],
    publishDate: '2024-10-20'
  }
];

const EpisodeCard: React.FC<{ episode: PodcastEpisode }> = ({ episode }) => {
  return (
    <Card sx={{ mb: 4, overflow: 'visible' }}>
      <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${episode.youtubeId}`}
          title={`YouTube video ${episode.youtubeId}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
      
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {episode.publishDate}
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {episode.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const Podcast: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Podcast
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Conversations about technology, creativity, and the future of making things.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </Box>
    </Container>
  );
};

export default Podcast;
