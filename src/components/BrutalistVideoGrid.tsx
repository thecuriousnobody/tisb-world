import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { ContentItem } from '../services/contentService';

interface BrutalistVideoGridProps {
  videos: ContentItem[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// Simplified patterns for wider cards
const GRID_PATTERNS = [
  { span: 'col-span-2 row-span-1', size: 'large' },   // Feature card
  { span: 'col-span-1 row-span-1', size: 'medium' },   // Standard card
  { span: 'col-span-1 row-span-1', size: 'medium' },    
  { span: 'col-span-2 row-span-1', size: 'large' },    // Wide card
  { span: 'col-span-1 row-span-1', size: 'medium' },
  { span: 'col-span-1 row-span-1', size: 'medium' },
];

const BrutalistVideoCard: React.FC<{ 
  video: ContentItem; 
  pattern: typeof GRID_PATTERNS[0];
  index: number;
}> = ({ video, pattern, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px', threshold: 0.01 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getThumbnailUrl = () => {
    const videoIdMatch = video.link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) return video.thumbnail || '';
    
    const videoId = videoIdMatch[1];
    const quality = pattern.size === 'large' ? 'maxresdefault' : 'hqdefault';
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  };

  // Brutalist color variations
  const colorSchemes = [
    { bg: '#000000', accent: '#FF4500' },
    { bg: '#1a1a1a', accent: '#FF6B35' },
    { bg: '#0a0a0a', accent: '#FF5722' },
  ];
  const colorScheme = colorSchemes[index % colorSchemes.length];

  return (
    <Box
      ref={cardRef}
      className={pattern.span}
      onClick={() => window.open(video.link, '_blank')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        backgroundColor: colorScheme.bg,
        border: `3px solid ${isHovered ? colorScheme.accent : '#000000'}`,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translate(-4px, -4px)' : 'none',
        boxShadow: isHovered 
          ? `8px 8px 0px ${colorScheme.accent}` 
          : '4px 4px 0px #000000',
        minHeight: '400px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${colorScheme.accent}08 2px,
            ${colorScheme.accent}08 4px
          )`,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        },
      }}
    >
      {/* Image with brutalist loading state */}
      {isVisible ? (
        <>
          {!imageLoaded && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: colorScheme.bg,
                '&::after': {
                  content: '"LOADING"',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: colorScheme.accent,
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em',
                },
              }}
            />
          )}
          
          <Box
            component="img"
            src={getThumbnailUrl()}
            onLoad={() => setImageLoaded(true)}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.2) brightness(0.7)',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        </>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::before': {
              content: `"${index + 1}"`,
              fontSize: '4rem',
              fontWeight: 900,
              color: '#111111',
              fontFamily: 'monospace',
            },
          }}
        />
      )}

      {/* Content Overlay - Redesigned for better readability */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        {/* Top section with video number and play icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box
            sx={{
              backgroundColor: colorScheme.accent,
              color: '#000000',
              px: 2,
              py: 1,
              fontSize: '1rem',
              fontWeight: 900,
              fontFamily: 'monospace',
            }}
          >
            #{String(index + 1).padStart(2, '0')}
          </Box>

          {/* Play button icon */}
          <Box
            sx={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `3px solid ${colorScheme.accent}`,
              transition: 'all 0.2s ease',
              opacity: isHovered ? 1 : 0.8,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <PlayArrowIcon 
              sx={{ 
                fontSize: '2rem', 
                color: '#FFFFFF',
                ml: 0.5,
              }} 
            />
          </Box>
        </Box>

        {/* Bottom section with title and metadata */}
        <Box
          sx={{
            backgroundColor: 'rgba(0,0,0,0.95)',
            p: 2.5,
            border: `2px solid ${colorScheme.accent}`,
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Title with better sizing */}
          <Typography
            sx={{
              color: '#FFFFFF',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 2,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: pattern.size === 'large' ? 3 : 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {video.title}
          </Typography>

          {/* Metadata row with icons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Date with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: '1rem', color: colorScheme.accent }} />
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                {video.publishedAt.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>

            {/* Watch indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: '1rem', color: colorScheme.accent }} />
              <Typography
                sx={{
                  color: colorScheme.accent,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Watch
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

const BrutalistVideoGrid: React.FC<BrutalistVideoGridProps> = ({ 
  videos, 
  onLoadMore, 
  hasMore 
}) => {
  return (
    <Box>
      {/* CSS Grid container with brutalist styling */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)'
          },
          gap: 4,
          mb: 6,
          '& .col-span-2': {
            gridColumn: { xs: 'span 2', md: 'span 2' }
          },
          '& .col-span-1': {
            gridColumn: 'span 1'
          },
          '& .row-span-2': {
            gridRow: { xs: 'span 1', md: 'span 2' }
          },
          '& .row-span-1': {
            gridRow: 'span 1'
          },
        }}
      >
        {videos.map((video, index) => (
          <BrutalistVideoCard
            key={video.id}
            video={video}
            pattern={GRID_PATTERNS[index % GRID_PATTERNS.length]}
            index={index}
          />
        ))}
      </Box>

      {/* Load More Button - Brutalist style */}
      {hasMore && onLoadMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            component="button"
            onClick={onLoadMore}
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
            LOAD MORE
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BrutalistVideoGrid;