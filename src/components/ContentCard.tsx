import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Skeleton,
} from '@mui/material';
import {
  Article,
  PlayArrow,
  OpenInNew,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import type { ContentItem } from '../services/contentService';

interface ContentCardProps {
  item: ContentItem;
}

const platformConfig = {
  substack: {
    icon: <Article />,
    color: '#FF6719',
    label: 'Blog Post',
  },
  youtube: {
    icon: <PlayArrow />,
    color: '#FF0000',
    label: 'Video',
  },
  spotify: {
    icon: <PlayArrow />,
    color: '#1DB954',
    label: 'Track',
  },
  other: {
    icon: <Article />,
    color: '#666666',
    label: 'Content',
  },
};

export function ContentCard({ item }: ContentCardProps) {
  const config = platformConfig[item.platform];
  const timeAgo = formatDistanceToNow(item.publishedAt, { addSuffix: true });

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {item.thumbnail && (
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 aspect ratio
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
          }}
        >
          <img
            src={item.thumbnail}
            alt={item.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '16px',
              px: 1.5,
              py: 0.5,
            }}
          >
            <Box sx={{ mr: 0.5, fontSize: 16, color: config.color }}>
              {config.icon}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            >
              {config.label}
            </Typography>
          </Box>
        </Box>
      )}

      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          {!item.thumbnail && (
            <Box sx={{ mr: 2, color: config.color, fontSize: 24 }}>
              {config.icon}
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 500,
                mb: 1,
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label={item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.7rem',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem',
                }}
              >
                {timeAgo}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 3,
            flexGrow: 1,
            lineHeight: 1.5,
          }}
        >
          {item.description}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          endIcon={<OpenInNew />}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            alignSelf: 'flex-start',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {item.platform === 'youtube' ? 'Watch' : 'Read'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function ContentCardSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ paddingTop: '56.25%', position: 'relative' }}>
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
      <CardContent sx={{ p: 4, flexGrow: 1 }}>
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="text" width={100} height={24} />
        </Box>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="85%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" width={100} height={36} />
      </CardContent>
    </Card>
  );
}
