import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { LinkedIn, X, Email } from '@mui/icons-material'
import { ventureCount } from '../data/ventures'

const chapters = [
  {
    title: 'THE IMMIGRANT BET',
    body: 'I came to this country with the same bet every immigrant founder makes: that agency beats circumstance. Nobody hands you a network, a playbook, or permission. You build all three.',
  },
  {
    title: 'THE CATERPILLAR YEARS',
    body: 'Running PMO at Caterpillar taught me how giant systems actually move — the discipline of shipping when a thousand things can go wrong. I took that operating rigor and pointed it at something smaller, faster, and mine.',
  },
  {
    title: 'BUILDING FROM CENTRAL ILLINOIS',
    body: `No Sand Hill Road. No accelerator cohort. Just ${ventureCount} companies being built from the middle of the country, using the same AI tools I'm building for everyone else. I'm my own first user — every product gets dogfooded here before it gets shipped.`,
  },
  {
    title: 'THE THESIS',
    body: 'Every human has agency. AI just removes the barriers. The tools I build — for founders, for small businesses, for creators — all exist to close the gap between having an idea and acting on it.',
  },
]

export default function About() {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: { xs: 4, md: 8 } }}>
        <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem' } }}>
          THE BUILDER
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '700px' }}>
          Immigrant founder. Systems thinker. {ventureCount} companies deep.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: { xs: 3, md: 4 },
          mb: { xs: 6, md: 10 },
        }}
      >
        {chapters.map((chapter) => (
          <Card key={chapter.title}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                variant="h5"
                sx={{ color: '#FF4500', fontWeight: 900, mb: 2 }}
              >
                {chapter.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'grey.300' }}>
                {chapter.body}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          backgroundColor: '#000000',
          p: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ color: '#ffffff', mb: 3, fontSize: { xs: '1.75rem', md: '3rem' } }}>
          FOLLOW THE BUILD
        </Typography>
        <Typography variant="body1" sx={{ color: 'grey.400', mb: 4, maxWidth: '600px', mx: 'auto' }}>
          The messy middle of building {ventureCount} startups at once, shared as it happens.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            startIcon={<LinkedIn />}
            component="a"
            href="https://www.linkedin.com/in/industrious1/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ backgroundColor: '#FF4500', color: '#000000', minHeight: 44, '&:hover': { backgroundColor: '#FF6A33' } }}
          >
            LinkedIn
          </Button>
          <Button
            variant="contained"
            startIcon={<X />}
            component="a"
            href="https://x.com/theideasandbox"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ backgroundColor: '#FF4500', color: '#000000', minHeight: 44, '&:hover': { backgroundColor: '#FF6A33' } }}
          >
            Follow on X
          </Button>
          <Button
            variant="contained"
            startIcon={<Email />}
            component="a"
            href="mailto:rajeev@theideasandbox.com"
            sx={{ backgroundColor: '#FF4500', color: '#000000', minHeight: 44, '&:hover': { backgroundColor: '#FF6A33' } }}
          >
            Email Me
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
