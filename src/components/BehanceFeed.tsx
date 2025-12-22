import { useState, useEffect } from 'react'
import { Typography, Box, Card, CardContent, CardMedia } from '@mui/material'

interface BehanceProject {
  id: string
  title: string
  link: string
  description: string
  thumbnail: string
  publishedAt: string
  platform: string
  author: string
  tags: string[]
}

interface ScrapedBehanceData {
  platform: string
  items: BehanceProject[]
  lastUpdated: string
  scrapedAt: string
  error?: string
}

// Legacy interface for fallback compatibility
interface LegacyBehanceProject {
  title: string
  link: string
  description: string
  content: string
  pubDate: string
  guid: string
}

export default function BehanceFeed() {
  const [projects, setProjects] = useState<BehanceProject[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<string>('local') // Track data source
  
  // Legacy fallback projects for when everything fails
  const legacyFallbackProjects: LegacyBehanceProject[] = [
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
      
      // First: Check localStorage for admin updates (highest priority)
      try {
        const localData = localStorage.getItem('tisb-artwork-portfolio')
        if (localData) {
          const data: ScrapedBehanceData = JSON.parse(localData)
          if (data.items && data.items.length > 0) {
            console.log(`✅ Loaded ${data.items.length} projects from admin updates`)
            setProjects(data.items)
            setDataSource('admin')
            return
          }
        }
      } catch (localError) {
        console.log('⚠️ Admin localStorage data invalid:', localError)
      }

      // Second: Try to load from local scraped data
      try {
        console.log('🎨 Loading artwork from local scraped data...')
        const response = await fetch('/data/behance-portfolio.json')
        
        if (response.ok) {
          const data: ScrapedBehanceData = await response.json()
          
          if (data.items && data.items.length > 0) {
            console.log(`✅ Loaded ${data.items.length} projects from scraped data`)
            setProjects(data.items)
            setDataSource('scraped')
            return
          }
        }
      } catch (scrapedError) {
        console.log('⚠️ Local scraped data failed:', scrapedError)
      }
      
      // Third: Try the RSS proxy (unreliable but sometimes works)
      try {
        console.log('📡 Trying RSS proxy as backup...')
        const BEHANCE_USERNAME = 'theideasandbox'
        const directFeedUrl = `https://www.behance.net/feeds/user?username=${BEHANCE_USERNAME}`
        const proxiedFeedUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(directFeedUrl)}`
        
        const response = await fetch(proxiedFeedUrl, { timeout: 5000 } as any)
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.status === 'ok' && data.items && data.items.length > 0) {
            // Convert RSS format to our format
            const convertedProjects: BehanceProject[] = data.items.slice(0, 12).map((item: any, index: number) => ({
              id: item.guid || `rss-${index}`,
              title: item.title,
              link: item.link,
              description: item.description || '',
              thumbnail: extractImageFromContent(item.content || '') || '',
              publishedAt: item.pubDate || new Date().toISOString(),
              platform: 'behance',
              author: 'The Idea Sandbox',
              tags: ['art', 'design']
            }))
            
            console.log(`✅ Loaded ${convertedProjects.length} projects from RSS proxy`)
            setProjects(convertedProjects)
            setDataSource('rss')
            return
          }
        }
      } catch (rssError) {
        console.log('⚠️ RSS proxy failed:', rssError)
      }
      
      // Fourth: Use legacy hardcoded fallback
      console.log('📝 Using legacy fallback projects...')
      const convertedFallback: BehanceProject[] = legacyFallbackProjects.map((item, index) => ({
        id: `fallback-${index}`,
        title: item.title,
        link: item.link,
        description: item.description,
        thumbnail: extractImageFromContent(item.content) || '',
        publishedAt: item.pubDate,
        platform: 'behance',
        author: 'The Idea Sandbox',
        tags: ['art', 'design']
      }))
      
      setProjects(convertedFallback)
      setDataSource('fallback')
      
    } catch (err) {
      console.error('❌ All data sources failed:', err)
      setProjects([])
      setDataSource('error')
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

      {/* Data Source Indicator */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="caption" sx={{ 
          color: dataSource === 'admin' ? 'success.main' : 
                dataSource === 'scraped' ? 'primary.main' :
                dataSource === 'fallback' ? 'warning.main' : 'info.main',
          fontSize: '0.8rem'
        }}>
          {dataSource === 'admin' && '✅ Latest updates from admin panel'}
          {dataSource === 'scraped' && '📁 Curated artwork collection'}
          {dataSource === 'rss' && '📡 Live data from RSS feed'}
          {dataSource === 'fallback' && '⚠️ Using cached artwork data'}
          {dataSource === 'error' && '❌ Unable to load artwork data'}
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
          const imageUrl = project.thumbnail || extractImageFromContent(project.description) || ''
          const cleanDescription = stripHtmlTags(project.description).slice(0, 150) + '...'
          
          return (
            <Card
              key={project.id || index}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                height: '380px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: dataSource === 'scraped' ? '2px solid' : '1px solid',
                borderColor: dataSource === 'scraped' ? 'success.main' : 'divider',
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
                    background: 'linear-gradient(45deg, #1a1a1a 0%, #ff4500 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ color: 'white', opacity: 0.7 }}>
                    🎨
                  </Typography>
                </Box>
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
                  background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.7) 100%)',
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
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {cleanDescription}
                </Typography>
                
                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Typography
                        key={tagIndex}
                        variant="caption"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          px: 1,
                          py: 0.2,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}
