import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, Typography } from '@mui/material';
import type { ContentItem } from '../services/contentService';

interface LazyVideoCardProps {
  video: ContentItem;
}

const LazyVideoCard: React.FC<LazyVideoCardProps> = ({ video }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getThumbnailUrl = (quality: 'low' | 'medium' | 'high' = 'medium') => {
    const videoIdMatch = video.link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) return video.thumbnail || '';
    
    const videoId = videoIdMatch[1];
    const qualityMap = {
      low: 'default',      // 120x90
      medium: 'hqdefault', // 480x360
      high: 'maxresdefault' // 1280x720
    };
    
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  };

  return (
    <Card 
      ref={cardRef}
      sx={{ 
        cursor: 'pointer',
        position: 'relative',
        height: '280px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        backgroundColor: '#000',
        '&:hover': {
          transform: 'translateY(-4px)',
          '& .video-thumbnail': {
            filter: 'brightness(80%)',
            transform: 'scale(1.05)',
          },
        },
      }}
      onClick={() => window.open(video.link, '_blank')}
    >
      {/* Thumbnail Background with Lazy Loading */}
      {isVisible && (
        <>
          {/* Low quality placeholder */}
          {!imageLoaded && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${getThumbnailUrl('low')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(5px) brightness(60%)',
              }}
            />
          )}
          
          {/* High quality image */}
          <Box
            component="img"
            className="video-thumbnail"
            src={getThumbnailUrl('medium')}
            onLoad={() => setImageLoaded(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(60%)',
              transition: 'all 0.3s ease',
              opacity: imageLoaded ? 1 : 0,
            }}
          />
        </>
      )}

      {/* Loading skeleton when not visible */}
      {!isVisible && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.6 },
              '50%': { opacity: 0.8 },
              '100%': { opacity: 0.6 },
            },
          }}
        />
      )}

      {/* Content Overlay */}
      <Box
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
          background: 'linear-gradient(transparent 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.85) 100%)',
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.3,
            mb: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {video.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: { xs: '0.75rem', md: '0.8rem' },
            lineHeight: 1.3,
            mb: 2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {video.description}
        </Typography>

        {/* Bottom row with date and play button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#FF4500',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            {video.publishedAt.toLocaleDateString()}
          </Typography>
          
          {/* Play Button */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#FF4500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '1rem', marginLeft: '1px' }}>▶</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default LazyVideoCard;