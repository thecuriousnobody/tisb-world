import { useState, useCallback } from 'react';
import type { ContentItem } from '../services/contentService';

interface UseVideoLoadMoreOptions {
  initialCount?: number;
  increment?: number;
}

export const useVideoLoadMore = (
  videos: ContentItem[], 
  options: UseVideoLoadMoreOptions = {}
) => {
  const { initialCount = 8, increment = 8 } = options;
  const [displayCount, setDisplayCount] = useState(initialCount);

  const loadMore = useCallback(() => {
    setDisplayCount(prev => Math.min(prev + increment, videos.length));
  }, [increment, videos.length]);

  const hasMore = displayCount < videos.length;
  const displayedVideos = videos.slice(0, displayCount);

  return {
    displayedVideos,
    loadMore,
    hasMore,
    totalCount: videos.length,
    displayedCount: displayCount
  };
};