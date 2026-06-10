import { useState, useEffect } from 'react'
import { Typography, Box, Card, CardContent, Chip } from '@mui/material'
import { GitHub, Launch, Star, ForkRight, Lock } from '@mui/icons-material'

interface GitHubProject {
  id: string
  name: string
  fullName: string
  title: string
  description: string
  aiDescription: string
  url: string
  homepage: string
  language: string
  stars: number
  forks: number
  topics: string[]
  lastUpdated: string
  createdAt: string
  visibility: 'public' | 'private'
}

interface GitHubData {
  username: string
  items: GitHubProject[]
  lastUpdated: string
  generatedWith: string
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Ruby: '#701516',
  Dart: '#00B4AB',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  Various: '#888888',
}

export default function GitHubProjectsFeed() {
  const [projects, setProjects] = useState<GitHubProject[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/github-projects.json')
        if (res.ok) {
          const data: GitHubData = await res.json()
          if (data.items && data.items.length > 0) {
            setProjects(data.items)
          }
        }
      } catch (err) {
        console.error('Failed to load GitHub projects:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          LOADING PROJECTS...
        </Typography>
      </Box>
    )
  }

  if (projects.length === 0) {
    return (
      <Box sx={{
        textAlign: 'center',
        py: 8,
        border: '2px dashed #000',
        backgroundColor: 'rgba(255, 69, 0, 0.05)',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          PROJECTS SYNCING...
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          GitHub projects will appear here after the first automated sync runs.
          <br />
          Trigger it manually from GitHub Actions or wait for the next scheduled run.
        </Typography>
      </Box>
    )
  }

  const visible = showAll ? projects : projects.slice(0, 9)

  return (
    <Box>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 3,
      }}>
        {visible.map((project) => {
          const isPrivate = project.visibility === 'private'
          return (
          <Card
            key={project.id}
            sx={{
              border: isPrivate ? '2px solid #9c27b0' : '2px solid #000',
              borderRadius: 0,
              cursor: project.url ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: isPrivate ? '#9c27b0' : '#FF4500',
                boxShadow: isPrivate ? '4px 4px 0px #9c27b0' : '4px 4px 0px #FF4500',
              },
            }}
            onClick={() => project.url && window.open(project.url, '_blank')}
          >
            {/* Language bar */}
            <Box sx={{
              height: 4,
              backgroundColor: LANGUAGE_COLORS[project.language] || '#888',
            }} />

            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1, mr: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      lineHeight: 1.2,
                    }}>
                      {project.title}
                    </Typography>
                    {isPrivate && (
                      <Chip
                        icon={<Lock sx={{ fontSize: '0.7rem !important' }} />}
                        label="PRIVATE"
                        size="small"
                        sx={{
                          height: 20,
                          backgroundColor: '#9c27b0',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.6rem',
                          borderRadius: 0,
                          '& .MuiChip-icon': { color: '#fff' },
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexShrink: 0 }}>
                  {project.stars > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <Star sx={{ fontSize: 16, color: '#f1c40f' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {project.stars}
                      </Typography>
                    </Box>
                  )}
                  {project.forks > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, ml: 1 }}>
                      <ForkRight sx={{ fontSize: 16, opacity: 0.6 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {project.forks}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* AI Description */}
              <Typography variant="body2" sx={{
                mb: 2,
                lineHeight: 1.6,
                flex: 1,
                fontSize: '0.9rem',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
              }}>
                {project.aiDescription}
              </Typography>

              {/* Language + Topics */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                <Chip
                  label={project.language}
                  size="small"
                  sx={{
                    backgroundColor: LANGUAGE_COLORS[project.language] || '#888',
                    color: ['JavaScript', '#f1e05a'].includes(project.language) ? '#000' : '#fff',
                    fontWeight: 700,
                    borderRadius: 0,
                    fontSize: '0.7rem',
                  }}
                />
                {project.topics.slice(0, 3).map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 0,
                      fontSize: '0.65rem',
                      borderColor: '#999',
                    }}
                  />
                ))}
              </Box>

              {/* Footer */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: 1,
                borderTop: '1px solid #eee',
              }}>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                  Updated {new Date(project.lastUpdated).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {!isPrivate && <GitHub sx={{ fontSize: 18, opacity: 0.6 }} />}
                  {isPrivate && <Lock sx={{ fontSize: 18, opacity: 0.4 }} />}
                  {project.homepage && (
                    <Launch
                      sx={{ fontSize: 18, opacity: 0.6 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(project.homepage, '_blank')
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
          )
        })}
      </Box>

      {/* Show More / Show Less */}
      {projects.length > 9 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Box
            component="button"
            onClick={() => setShowAll(!showAll)}
            sx={{
              background: 'none',
              border: '2px solid #000',
              borderRadius: 0,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#FF4500',
                borderColor: '#FF4500',
                color: '#fff',
              },
            }}
          >
            {showAll ? 'SHOW LESS' : `SHOW ALL ${projects.length} PROJECTS`}
          </Box>
        </Box>
      )}
    </Box>
  )
}
