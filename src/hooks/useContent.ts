import { useState, useEffect } from 'react';
import type { ContentItem } from '../services/contentService';
import { ContentService } from '../services/contentService';

export function useContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const contentService = ContentService.getInstance();
        const items = await contentService.getAllContent();
        setContent(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
        console.error('Content fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading, error };
}

export function useSubstackPosts() {
  const [posts, setPosts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const contentService = ContentService.getInstance();
        const items = await contentService.getContentByPlatform('substack');
        setPosts(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Substack posts');
        console.error('Substack fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}

export function useYouTubeVideos() {
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const contentService = ContentService.getInstance();
        const items = await contentService.getContentByPlatform('youtube');
        setVideos(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch YouTube videos');
        console.error('YouTube fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
}
