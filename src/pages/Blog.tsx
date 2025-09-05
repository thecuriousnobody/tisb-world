import { Typography, Box } from '@mui/material'
import { useSubstackPosts } from '../hooks/useContent'
import { useVideoLoadMore } from '../hooks/useVideoLoadMore'
import BrutalistBlogGrid from '../components/BrutalistBlogGrid'
import SocialSection from '../components/SocialSection'

export default function Blog() {
  const { posts, loading, error } = useSubstackPosts();
  const { displayedVideos, loadMore, hasMore } = useVideoLoadMore(posts || [], {
    initialCount: 8,
    increment: 6
  });

  // Transform posts to match BrutalistBlogGrid format with actual reading time
  const blogPosts = displayedVideos?.map(post => ({
    ...post,
    readTime: post.tags?.[0] || '5 min read',
  })) || [];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      {/* Brutalist Blog Grid */}
      <BrutalistBlogGrid posts={blogPosts} loading={loading} error={error} />
      
      {/* Load More Button */}
      {hasMore && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
          <Box
            component="button"
            onClick={loadMore}
            sx={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: '3px solid #FF4500',
              px: 6,
              py: 2,
              fontSize: '1.25rem',
              fontWeight: 900,
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease',
              boxShadow: '4px 4px 0px #FF4500',
              '&:hover': {
                transform: 'translate(-4px, -4px)',
                boxShadow: '8px 8px 0px #FF4500',
                backgroundColor: '#FF4500',
                color: '#000000',
              },
              '&:active': {
                transform: 'translate(0, 0)',
                boxShadow: 'none',
              },
            }}
          >
            LOAD MORE POSTS
          </Box>
        </Box>
      )}

      {/* About Section */}
      <Box sx={{ 
        mt: 12,
        px: { xs: 2, md: 8 },
        borderTop: '2px solid #000000',
        pt: 8,
      }}>
        <Box
          sx={{
            backgroundColor: '#000000',
            color: 'white',
            borderRadius: '0px',
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            border: '2px solid #FF4500',
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 4,
              overflow: 'hidden',
            }}
          >
            ABOUT THE BLOG
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: '700px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.7,
              opacity: 0.9,
            }}
          >
            "The Curious Nobody" is my exploration of the spaces between technology and humanity, 
            creativity and logic, the known and the mysterious. Each post is an attempt to make 
            sense of our rapidly changing world through the lens of curiosity and wonder.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: { xs: '0.9rem', md: '1rem' },
              maxWidth: '700px',
              mx: 'auto',
              mb: 6,
              lineHeight: 1.7,
              opacity: 0.7,
              fontStyle: 'italic',
            }}
          >
            Questions, thoughts, or just want to continue the conversation? Reach out at{' '}
            <Box 
              component="a" 
              href="mailto:rajeev@theideasandbox.com"
              sx={{ 
                color: '#FFFFFF',
                textDecoration: 'underline',
                fontWeight: 600,
                '&:hover': { 
                  color: '#FF4500',
                  textDecoration: 'underline' 
                }
              }}
            >
              rajeev@theideasandbox.com
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Social Media Section */}
      <SocialSection />
    </Box>
  )
}
