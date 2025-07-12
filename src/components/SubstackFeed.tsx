import { useState, useEffect } from 'react'
import { Typography, Box, Card, CardContent, CardMedia } from '@mui/material'

interface SubstackPost {
  title: string
  link: string
  description: string
  content: string
  pubDate: string
  guid: string
}

interface SubstackData {
  status: string
  feed: {
    url: string
    title: string
    link: string
    description: string
  }
  items: SubstackPost[]
}

export default function SubstackFeed() {
  const [posts, setPosts] = useState<SubstackPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Replace this with your actual Substack URL
  const SUBSTACK_URL = 'thecuriousnobody.substack.com'  // Your actual Substack URL
  const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2F${SUBSTACK_URL}%2Ffeed`

  const extractImageFromContent = (content: string): string | null => {
    const imageUrlMatch = content.match(/<img[^>]+src="([^"]+)"/i)
    return imageUrlMatch ? imageUrlMatch[1] : null
  }

  const stripHtmlTags = (html: string): string => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  const fetchLatestPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(feedUrl)
      
      if (!response.ok) {
        throw new Error('Failed to fetch RSS feed')
      }

      const data: SubstackData = await response.json()
      
      if (data.status !== 'ok') {
        throw new Error('RSS feed returned error status')
      }

      // Get up to 20 latest posts (increased from 3)
      const latestPosts = (data.items || []).slice(0, 20)
      setPosts(latestPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      console.error('Error fetching Substack RSS feed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestPosts()
  }, [])

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          LOADING LATEST THOUGHTS...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
          FAILED TO LOAD POSTS
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {error}
        </Typography>
      </Box>
    )
  }

  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          NO POSTS AVAILABLE
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      {/* Section Header */}
      <Box sx={{ 
        width: '100%', 
        overflow: 'hidden',
        mb: 6,
        textAlign: 'center',
      }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
            fontWeight: 800,
            overflow: 'hidden',
            mb: 2,
          }}
        >
          LATEST THOUGHTS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'text.secondary',
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Direct from the Substack feed
        </Typography>
      </Box>

      {/* Posts Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 4,
        px: { xs: 2, md: 8 },
      }}>
        {posts.map((post, index) => {
          const imageUrl = extractImageFromContent(post.content)
          const cleanDescription = stripHtmlTags(post.description).slice(0, 150) + '...'
          
          return (
            <Card
              key={post.guid || index}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                height: '300px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  '& .post-image': {
                    filter: 'brightness(60%)',
                  },
                },
              }}
              onClick={() => window.open(post.link, '_blank')}
            >
              {/* Background Image or Color */}
              {imageUrl ? (
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={post.title}
                  className="post-image"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(40%)',
                    transition: 'filter 0.3s ease',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'secondary.main', // Orange background
                  }}
                />
              )}

              {/* Content Overlay */}
              <CardContent
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 3,
                  background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.7) 100%)',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.2,
                    mb: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    opacity: 0.8,
                    fontSize: '0.9rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {cleanDescription}
                </Typography>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}
