import { useState, useEffect } from 'react'
import { Typography, Box, Card, CardContent, CardMedia } from '@mui/material'

interface BehanceProject {
  title: string
  link: string
  description: string
  content: string
  pubDate: string
  guid: string
}

interface BehanceData {
  status: string
  feed: {
    url: string
    title: string
    link: string
    description: string
  }
  items: BehanceProject[]
}

export default function BehanceFeed() {
  const [projects, setProjects] = useState<BehanceProject[]>([])
  const [loading, setLoading] = useState(true)

  // Behance RSS feed for theideasandbox
  const BEHANCE_USERNAME = 'theideasandbox'
  const directFeedUrl = `https://www.behance.net/feeds/user?username=${BEHANCE_USERNAME}`
  const proxiedFeedUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(directFeedUrl)}`
  
  // Fallback projects from your recent work
  const fallbackProjects: BehanceProject[] = [
    {
      title: "Liminal Radiance",
      link: "https://www.behance.net/gallery/229744893/Liminal-Radiance",
      description: "Exploring the boundaries between dimensions through fluid, organic forms.",
      content: '<img src="https://mir-s3-cdn-cf.behance.net/projects/404/72595c229744893.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" />',
      pubDate: "Sun, 06 Jul 2025 16:08:25 +0000",
      guid: "https://www.behance.net/gallery/229744893/Liminal-Radiance"
    },
    {
      title: "Undulating Qualia",
      link: "https://www.behance.net/gallery/228140981/Undulating-Qualia",
      description: "Digital exploration of consciousness and perception.",
      content: '<img src="https://mir-s3-cdn-cf.behance.net/projects/404/4ce73b228140981.Y3JvcCwxMDgwLDg0NCwwLDE3MQ.png" />',
      pubDate: "Sat, 14 Jun 2025 14:55:52 +0000",
      guid: "https://www.behance.net/gallery/228140981/Undulating-Qualia"
    },
    {
      title: "Transcendent Currents",
      link: "https://www.behance.net/gallery/228111041/Transcendent-Currents",
      description: "Visual journey through energy and transformation.",
      content: '<img src="https://mir-s3-cdn-cf.behance.net/projects/404/cdebbf228111041.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" />',
      pubDate: "Sat, 14 Jun 2025 02:39:42 +0000",
      guid: "https://www.behance.net/gallery/228111041/Transcendent-Currents"
    },
    {
      title: "Primal Vibrations",
      link: "https://www.behance.net/gallery/227711897/Primal-Vibrations", 
      description: "A visual journey into the fundamental frequencies that shape our reality.",
      content: '<img src="https://mir-s3-cdn-cf.behance.net/projects/404/64e6ae227711897.Y3JvcCw4NjMsNjc1LDEwOCwyMDM.png" />',
      pubDate: "Sun, 08 Jun 2025 18:08:06 +0000",
      guid: "https://www.behance.net/gallery/227711897/Primal-Vibrations"
    },
    {
      title: "Possibility Blooms",
      link: "https://www.behance.net/gallery/227171655/Possibility-Blooms",
      description: "Creative exploration in visual design and digital art.",
      content: '<img src="https://mir-s3-cdn-cf.behance.net/projects/404/00a0d6227171655.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" />',
      pubDate: "Sat, 31 May 2025 15:50:58 +0000",
      guid: "https://www.behance.net/gallery/227171655/Possibility-Blooms"
    },
    {
      title: "Emergence",
      link: "https://www.behance.net/gallery/226776859/Emergence",
      description: "Digital emergence and organic forms.",
      content: '<img src="https://mir-s3-cdn-cf.behance.net/projects/404/e4fc05226776859.Y3JvcCwxMDgwLDg0NCwwLDE0OQ.png" />',
      pubDate: "Thu, 29 May 2025 15:37:34 +0000",
      guid: "https://www.behance.net/gallery/226776859/Emergence"
    },
    {
      title: "Radiant Odyssey",
      link: "https://www.behance.net/gallery/226134717/Radiant-Odyssey",
      description: "An exploration of light, energy, and transformation through digital art.",
      content: '<img src="https://mir-s3-cdn-cf.behance.net/projects/404/341bc4226134717.Y3JvcCwxMDgwLDg0NCwwLDQxMQ.png" />',
      pubDate: "Sun, 18 May 2025 06:17:24 +0000",
      guid: "https://www.behance.net/gallery/226134717/Radiant-Odyssey"
    },
    {
      title: "Fluid Consciousness",
      link: "https://www.behance.net/gallery/225558559/Fluid-Consciousness",
      description: "Exploration of consciousness through fluid digital forms.",
      content: '<img src="https://mir-s3-cdn-cf.behance.net/projects/404/e2b7b1225558559.Y3JvcCwxOTk5LDE1NjQsMCwyMTc.png" />',
      pubDate: "Sat, 10 May 2025 13:27:32 +0000",
      guid: "https://www.behance.net/gallery/225558559/Fluid-Consciousness"
    }
  ]

  const extractImageFromContent = (content: string): string | null => {
    const imageUrlMatch = content.match(/<img[^>]+src="([^"]+)"/i)
    return imageUrlMatch ? imageUrlMatch[1] : null
  }

  const stripHtmlTags = (html: string): string => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  const fetchLatestProjects = async () => {
    try {
      setLoading(true)
      
      // Try the rss2json proxy first
      try {
        const response = await fetch(proxiedFeedUrl)
        
        if (response.ok) {
          const data: BehanceData = await response.json()
          
          if (data.status === 'ok' && data.items && data.items.length > 0) {
            // Get up to 20 latest projects
            const latestProjects = data.items.slice(0, 20)
            setProjects(latestProjects)
            return
          }
        }
      } catch (proxyError) {
        console.log('RSS proxy failed, using fallback:', proxyError)
      }
      
      // If proxy fails, use fallback projects
      console.log('Using fallback projects from your recent Behance work')
      setProjects(fallbackProjects)
      
    } catch (err) {
      // If everything fails, still show fallback
      console.log('All methods failed, using fallback projects:', err)
      setProjects(fallbackProjects)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestProjects()
  }, [])

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          LOADING LATEST WORK...
        </Typography>
      </Box>
    )
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          NO PROJECTS AVAILABLE
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
          LATEST WORK
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
          Visual creations and design projects from Behance
        </Typography>
      </Box>

      {/* Projects Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 4,
        px: { xs: 2, md: 8 },
      }}>
        {projects.map((project, index) => {
          const imageUrl = extractImageFromContent(project.content)
          const cleanDescription = stripHtmlTags(project.description).slice(0, 150) + '...'
          
          return (
            <Card
              key={project.guid || index}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                height: '380px', // Increased from 350px to 380px for better aspect ratio
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  '& .project-image': {
                    filter: 'brightness(80%)',
                    transform: 'scale(1.05)',
                  },
                },
              }}
              onClick={() => window.open(project.link, '_blank')}
            >
              {/* Background Image or Color */}
              {imageUrl ? (
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={project.title}
                  className="project-image"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(60%)',
                    transition: 'all 0.3s ease',
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
                  {project.title}
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
