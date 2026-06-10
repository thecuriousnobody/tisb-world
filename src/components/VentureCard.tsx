import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import { ArrowOutward } from '@mui/icons-material'
import type { Venture } from '../data/ventures'

const STATUS_LABEL: Record<Venture['status'], string> = {
  shipped: 'SHIPPED',
  beta: 'BETA',
  building: 'BUILDING',
}

interface VentureCardProps {
  venture: Venture
}

export default function VentureCard({ venture }: VentureCardProps) {
  const linked = venture.url.length > 0

  return (
    <Card
      component={linked ? 'a' : 'div'}
      {...(linked
        ? { href: venture.url, target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      sx={{
        textDecoration: 'none',
        position: 'relative',
        height: '100%',
        minHeight: { xs: 180, md: 220 },
        borderTop: `4px solid ${venture.accentColor}`,
        cursor: linked ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        '&:hover': linked
          ? {
              transform: 'translateY(-6px)',
              '& .venture-arrow': { opacity: 1 },
            }
          : {},
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              backgroundColor: venture.accentColor,
              mt: 1,
            }}
          />
          <Chip
            label={STATUS_LABEL[venture.status]}
            size="small"
            sx={{
              backgroundColor: venture.status === 'shipped' ? '#FF4500' : 'transparent',
              color: venture.status === 'shipped' ? '#000000' : '#ffffff',
              border: venture.status === 'shipped' ? 'none' : '1px solid #ffffff',
              fontWeight: 700,
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            color: '#ffffff',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            mb: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {venture.name}
        </Typography>

        <Typography variant="body2" sx={{ color: 'grey.400', flexGrow: 1 }}>
          {venture.tagline}
        </Typography>

        {linked && (
          <Box
            className="venture-arrow"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 2,
              color: '#FF4500',
              opacity: 0.6,
              transition: 'opacity 0.2s ease',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Visit
            </Typography>
            <ArrowOutward fontSize="small" />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
