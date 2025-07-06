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

interface BlogPost {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishDate: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Accidental Artist',
    url: 'https://thecuriousnobody.substack.com/p/the-accidental-artist?r=1b8vj5',
    excerpt: 'Exploring the unexpected journey into creativity and what it means to become an artist by accident.',
    publishDate: '2024-12-01',
    tags: ['Creativity', 'Art', 'Personal Journey', 'Self-Discovery']
  },
  {
    id: '2',
    title: "We're Gonna Have Our Bullshit Called",
    url: 'https://thecuriousnobody.substack.com/p/were-gonna-have-our-bullshit-called?r=1b8vj5',
    excerpt: 'A reflection on authenticity, accountability, and the inevitable moment when pretense meets reality.',
    publishDate: '2024-11-15',
    tags: ['Authenticity', 'Truth', 'Personal Growth', 'Reflection']
  },
  {
    id: '3',
    title: 'The Ganesha Chronicles: How a Cat...',
    url: 'https://thecuriousnobody.substack.com/p/the-ganesha-chronicles-how-a-cat?r=1b8vj5',
    excerpt: 'An unexpected story about wisdom, obstacles, and the unlikely teachers that appear in our lives.',
    publishDate: '2024-10-30',
    tags: ['Spirituality', 'Life Lessons', 'Storytelling', 'Wisdom']
  }
];

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <Card sx={{ mb: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent>
        <Typography variant="h5" component="h3" gutterBottom>
          <a 
            href={post.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none', 
              color: 'inherit'
            }}
          >
            {post.title}
          </a>
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {post.publishDate}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {post.excerpt}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {post.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>
        
        <Typography variant="body2" color="primary">
          <a 
            href={post.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Read on Substack →
          </a>
        </Typography>
      </CardContent>
    </Card>
  );
};

const Blog: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Blog
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Thoughts from "The Curious Nobody" - exploring creativity, authenticity, and the unexpected.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </Box>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body1" paragraph>
          Want to read more? Check out my full publication:
        </Typography>
        <Typography variant="h6" color="primary">
          <a 
            href="https://thecuriousnobody.substack.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            The Curious Nobody on Substack →
          </a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Blog;
