import { Box, Typography } from '@mui/material'
import VentureCard from '../components/VentureCard'
import Seo from '../components/Seo'
import { sortedVentures, ventureCount } from '../data/ventures'

export default function Ventures() {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Seo
        title="Ventures"
        description="Seven AI startups, one builder: Stack Day, DeSilo, swych-box, podcastbots, Autonomy Labs, Golden Hour, and Neuronify. Each one removes a barrier between you and what you want to build."
        path="/ventures"
      />
      <Box sx={{ mb: { xs: 4, md: 8 } }}>
        <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem' } }}>
          VENTURES
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: 'text.secondary', maxWidth: '700px' }}
        >
          {ventureCount} companies. One builder. Every one of them removes a
          barrier between you and what you want to build.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: { xs: 3, md: 4 },
        }}
      >
        {sortedVentures.map((venture) => (
          <VentureCard key={venture.name} venture={venture} />
        ))}
      </Box>
    </Box>
  )
}
