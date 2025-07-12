import { useState, useEffect } from 'react'
import { Typography, Box, Card, CardContent, CardMedia } from '@mui/material'

interface SubstackPost {
  title: string
  link: string
  description: string
  content: string
  pubDate: string
  guid: string
  thumbnail?: string
  enclosure?: {
    link: string
    type: string
  }
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
  
  // Try multiple RSS services for better data coverage
  const feedUrls = [
    `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2F${SUBSTACK_URL}%2Ffeed`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(`https://${SUBSTACK_URL}/feed`)}&format=json`,
  ]

  const extractImageFromContent = (post: SubstackPost): string => {
    // First, check if there's a thumbnail field
    if (post.thumbnail) {
      return post.thumbnail
    }
    
    // Check for enclosure (media attachments)
    if (post.enclosure && post.enclosure.type && post.enclosure.type.startsWith('image/')) {
      return post.enclosure.link
    }
    
    // Extract from content
    if (post.content) {
      const imageUrlMatch = post.content.match(/<img[^>]+src="([^"]+)"/i)
      if (imageUrlMatch) {
        return imageUrlMatch[1]
      }
    }
    
    // Extract from description as fallback
    if (post.description) {
      const imageUrlMatch = post.description.match(/<img[^>]+src="([^"]+)"/i)
      if (imageUrlMatch) {
        return imageUrlMatch[1]
      }
    }
    
    // Generate a placeholder based on post title
    return generatePlaceholderImage(post.title)
  }

  const generatePlaceholderImage = (title: string): string => {
    // Create a deterministic but varied placeholder
    const seed = title.replace(/\s+/g, '').toLowerCase()
    const hash = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    // Use a more reliable placeholder service or generate a data URL
    const colors = ['FF6B35', '2E3440', '5D4E37', 'D08C60', 'B48EAD']
    const colorIndex = Math.abs(hash) % colors.length
    const bgColor = colors[colorIndex]
    
    // Return a solid color data URL as fallback
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#${bgColor}"/>
        <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
              text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.8">
          ${title.slice(0, 20)}${title.length > 20 ? '...' : ''}
        </text>
      </svg>
    `)}`
  }

  const stripHtmlTags = (html: string): string => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  const fetchLatestPosts = async () => {
    try {
      setLoading(true)
      
      // Try the primary RSS service first
      let response = await fetch(feedUrls[0])
      
      if (!response.ok) {
        throw new Error('Failed to fetch RSS feed')
      }

      const data: SubstackData = await response.json()
      
      if (data.status !== 'ok') {
        throw new Error('RSS feed returned error status')
      }

      // Debug: Log the first post to see what data we're getting
      if (data.items && data.items.length > 0) {
        console.log('Sample Substack post data:', data.items[0])
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
          const imageUrl = extractImageFromContent(post)
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
                    filter: 'brightness(85%)', // Slightly brighter on hover
                  },
                },
              }}
              onClick={() => window.open(post.link, '_blank')}
            >
              {/* Background Image */}
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
                  filter: 'brightness(75%)', // Lighter tint for more vibrant visuals
                  transition: 'filter 0.3s ease',
                }}
                onError={(e) => {
                  // Fallback to generated placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = generatePlaceholderImage(post.title)
                }}
              />

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
                  background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.5) 100%)',
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
