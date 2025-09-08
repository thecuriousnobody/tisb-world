import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  link: string;
  publishedAt: Date;
  thumbnail?: string;
  readTime?: string;
}

interface BrutalistBlogGridProps {
  posts: BlogPost[];
  loading?: boolean;
  error?: string | null;
}

// Grid patterns for blog posts
const BLOG_PATTERNS = [
  { span: 'col-span-2 row-span-1', size: 'featured' },   // Featured post
  { span: 'col-span-1 row-span-1', size: 'standard' },   
  { span: 'col-span-1 row-span-1', size: 'standard' },
  { span: 'col-span-1 row-span-1', size: 'standard' },
  { span: 'col-span-1 row-span-1', size: 'standard' },
  { span: 'col-span-2 row-span-1', size: 'featured' },
];

const BrutalistBlogCard: React.FC<{ 
  post: BlogPost; 
  pattern: typeof BLOG_PATTERNS[0];
  index: number;
}> = ({ post, pattern, index }) => {
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

  // Brutalist color schemes
  const colorSchemes = [
    { bg: '#000000', accent: '#FF4500', text: '#FFFFFF' },
    { bg: '#1a1a1a', accent: '#00FF00', text: '#FFFFFF' },
    { bg: '#0a0a0a', accent: '#FFD700', text: '#FFFFFF' },
    { bg: '#2a2a2a', accent: '#FF1493', text: '#FFFFFF' },
  ];
  const colorScheme = colorSchemes[index % colorSchemes.length];

  // Extract image or generate placeholder
  const getThumbnail = () => {
    if (post.thumbnail) return post.thumbnail;
    
    // Generate abstract pattern for posts without images
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="${colorScheme.bg}"/>
        <pattern id="pattern-${index}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="20" height="20" fill="${colorScheme.accent}" opacity="0.3"/>
          <rect x="20" y="20" width="20" height="20" fill="${colorScheme.accent}" opacity="0.3"/>
        </pattern>
        <rect width="800" height="600" fill="url(#pattern-${index})"/>
        <text x="400" y="300" font-family="monospace" font-size="48" font-weight="bold" 
              text-anchor="middle" dominant-baseline="middle" fill="${colorScheme.accent}" opacity="0.5">
          ${post.title.charAt(0).toUpperCase()}
        </text>
      </svg>
    `)}`;
  };

  const stripHtml = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const cleanDescription = stripHtml(post.description);

  return (
    <Box
      ref={cardRef}
      className={pattern.span}
      onClick={() => window.open(post.link, '_blank')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        backgroundColor: colorScheme.bg,
        border: `4px solid ${isHovered ? colorScheme.accent : '#000000'}`,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translate(-6px, -6px)' : 'none',
        boxShadow: isHovered 
          ? `12px 12px 0px ${colorScheme.accent}` 
          : '6px 6px 0px #000000',
        minHeight: pattern.size === 'featured' ? '450px' : '400px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background with loading state */}
      {isVisible ? (
        <>
          {!imageLoaded && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: colorScheme.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&::after': {
                  content: '"LOADING POST"',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: colorScheme.accent,
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.4 },
                    '50%': { opacity: 1 },
                  },
                },
              }}
            />
          )}
          
          <Box
            component="img"
            src={getThumbnail()}
            onLoad={() => setImageLoaded(true)}
            alt={post.title}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: post.thumbnail 
                ? 'contrast(1.2) brightness(0.9) saturate(1.2)' 
                : 'contrast(1.1) brightness(0.8) grayscale(0.2)',
              opacity: imageLoaded ? (post.thumbnail ? 0.7 : 0.3) : 0,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                filter: post.thumbnail 
                  ? 'contrast(1.3) brightness(1) saturate(1.3)' 
                  : 'contrast(1.1) brightness(0.8) grayscale(0.2)',
              }
            }}
          />
        </>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000000',
            '&::before': {
              content: `"POST #${index + 1}"`,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '3rem',
              fontWeight: 900,
              color: '#111111',
              fontFamily: 'monospace',
            },
          }}
        />
      )}

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          zIndex: 1,
        }}
      >
        {/* Top badges */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {/* Issue number */}
          <Box
            sx={{
              backgroundColor: colorScheme.accent,
              color: '#000000',
              px: 2,
              py: 0.5,
              fontSize: '0.875rem',
              fontWeight: 900,
              fontFamily: 'monospace',
              transform: 'skewX(-10deg)',
            }}
          >
            <span style={{ transform: 'skewX(10deg)', display: 'inline-block' }}>
              ISSUE #{String(index + 1).padStart(3, '0')}
            </span>
          </Box>

          {/* Reading time indicator */}
          {post.readTime && (
            <Box
              sx={{
                backgroundColor: '#000000',
                color: colorScheme.accent,
                border: `2px solid ${colorScheme.accent}`,
                px: 2,
                py: 0.5,
                fontSize: '0.875rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: '1rem' }} />
              {post.readTime.toUpperCase()}
            </Box>
          )}
        </Box>

        {/* Title */}
        <Typography
          sx={{
            color: colorScheme.text,
            fontSize: pattern.size === 'featured' ? { xs: '1.75rem', md: '2rem' } : { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 900,
            lineHeight: 1.1,
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: pattern.size === 'featured' ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            textShadow: `2px 2px 0px ${colorScheme.bg}`,
          }}
        >
          {post.title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            color: colorScheme.text,
            fontSize: pattern.size === 'featured' ? '1rem' : '0.875rem',
            lineHeight: 1.4,
            mb: 'auto',
            opacity: 0.8,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: pattern.size === 'featured' ? 4 : 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {cleanDescription}
        </Typography>

        {/* Bottom metadata */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 3,
            pt: 2,
            borderTop: `2px solid ${colorScheme.accent}40`,
          }}
        >
          {/* Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: '1rem', color: colorScheme.accent }} />
            <Typography
              sx={{
                color: colorScheme.accent,
                fontSize: '0.875rem',
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {post.publishedAt.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              }).toUpperCase()}
            </Typography>
          </Box>

          {/* Read arrow */}
          <Box
            sx={{
              backgroundColor: colorScheme.accent,
              color: '#000000',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              transform: isHovered ? 'translateX(4px)' : 'none',
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: '1.25rem' }} />
          </Box>
        </Box>
      </Box>

      {/* Hover effect overlay */}
      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: colorScheme.accent,
            color: '#000000',
            px: 3,
            py: 1,
            fontSize: '1rem',
            fontWeight: 900,
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            transform: 'translateY(-100%)',
            animation: 'slideDown 0.2s ease forwards',
            '@keyframes slideDown': {
              to: { transform: 'translateY(0)' },
            },
          }}
        >
          READ NOW →
        </Box>
      )}
    </Box>
  );
};

const BrutalistBlogGrid: React.FC<BrutalistBlogGridProps> = ({ posts, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.4 },
              '50%': { opacity: 1 },
            },
          }}
        >
          LOADING THOUGHTS...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900, 
            color: '#FF4500',
            textTransform: 'uppercase',
            mb: 2,
          }}
        >
          ERROR LOADING POSTS
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900,
            textTransform: 'uppercase',
          }}
        >
          NO POSTS AVAILABLE
        </Typography>
      </Box>
    );
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
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            mb: 2,
          }}
        >
          THE CURIOUS NOBODY
        </Typography>
        <Box
          sx={{
            display: 'inline-block',
            backgroundColor: '#FF4500',
            color: '#000000',
            px: 3,
            py: 1,
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontWeight: 700,
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            transform: 'skewX(-10deg)',
          }}
        >
          <span style={{ transform: 'skewX(10deg)', display: 'inline-block' }}>
            DIRECT FROM SUBSTACK
          </span>
        </Box>
      </Box>

      {/* Posts Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)'
          },
          gap: 4,
          px: { xs: 2, md: 8 },
          mb: 6,
          '& .col-span-2': {
            gridColumn: { xs: 'span 1', md: 'span 2' }
          },
          '& .col-span-1': {
            gridColumn: 'span 1'
          },
        }}
      >
        {posts.map((post, index) => (
          <BrutalistBlogCard
            key={post.id}
            post={post}
            pattern={BLOG_PATTERNS[index % BLOG_PATTERNS.length]}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};

export default BrutalistBlogGrid;