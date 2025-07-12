export interface ContentItem {
  id: string;
  title: string;
  description: string;
  link: string;
  publishedAt: Date;
  platform: 'substack' | 'youtube' | 'spotify' | 'behance' | 'other';
  thumbnail?: string;
  author?: string;
  duration?: string;
  tags?: string[];
}

export interface ContentFeed {
  platform: string;
  items: ContentItem[];
  lastUpdated: Date;
}

export class ContentService {
  private static instance: ContentService;
  private cache = new Map<string, { data: ContentFeed; expiry: number }>();
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  private async fetchWithCache<T>(
    cacheKey: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiry > now) {
      return cached.data as T;
    }

    try {
      const data = await fetcher();
      this.cache.set(cacheKey, {
        data: data as any,
        expiry: now + this.CACHE_DURATION,
      });
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${cacheKey}:`, error);
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data as T;
      }
      throw error;
    }
  }

  async getSubstackPosts(): Promise<ContentFeed> {
    return this.fetchWithCache('substack', async () => {
      // Since we're in a browser environment, we'll need to use a CORS proxy
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const feedUrl = 'https://thecuriousnobody.substack.com/feed';
      
      const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);
      const xmlText = await response.text();
      
      // Parse RSS XML
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'application/xml');
      const items = Array.from(doc.querySelectorAll('item'));

      const contentItems: ContentItem[] = items.slice(0, 5).map((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        
        return {
          id: `substack-${index}`,
          title: title.replace('<![CDATA[', '').replace(']]>', ''),
          description: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
          link,
          publishedAt: new Date(pubDate),
          platform: 'substack' as const,
          author: 'The Curious Nobody',
        };
      });

      return {
        platform: 'Substack',
        items: contentItems,
        lastUpdated: new Date(),
      };
    });
  }

  async getYouTubeVideos(): Promise<ContentFeed> {
    return this.fetchWithCache('youtube', async () => {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const feedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_pKSnd_emg2JJMDGJpwZnQ';
      
      const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);
      const xmlText = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'application/xml');
      const entries = Array.from(doc.querySelectorAll('entry'));

      const contentItems: ContentItem[] = entries.slice(0, 20).map((entry, index) => {
        const title = entry.querySelector('title')?.textContent || '';
        const link = entry.querySelector('link')?.getAttribute('href') || '';
        const description = entry.querySelector('media\\:description, description')?.textContent || '';
        const published = entry.querySelector('published')?.textContent || '';
        
        // Try multiple ways to get thumbnail
        let thumbnail = entry.querySelector('media\\:thumbnail')?.getAttribute('url') || 
                       entry.querySelector('media\\:group media\\:thumbnail')?.getAttribute('url') || '';
        
        // If no thumbnail found, generate from YouTube video ID
        if (!thumbnail && link) {
          const videoIdMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
          if (videoIdMatch) {
            thumbnail = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
          }
        }
        
        return {
          id: `youtube-${index}`,
          title,
          description: description.substring(0, 200) + '...',
          link,
          publishedAt: new Date(published),
          platform: 'youtube' as const,
          thumbnail,
          author: 'The Idea Sandbox',
        };
      });

      return {
        platform: 'YouTube',
        items: contentItems,
        lastUpdated: new Date(),
      };
    });
  }

  async getBehanceProjects(): Promise<ContentFeed> {
    // Note: Behance doesn't provide RSS feeds directly
    // Would need to use their API or implement web scraping
    // For now, returning empty feed
    return {
      platform: 'Behance',
      items: [],
      lastUpdated: new Date(),
    };
  }

  async getSpotifyContent(): Promise<ContentFeed> {
    // Note: Spotify doesn't provide RSS feeds
    // Would need to use Spotify Web API with OAuth authentication
    // This would require a backend service to handle tokens
    return {
      platform: 'Spotify',
      items: [],
      lastUpdated: new Date(),
    };
  }

  async getAllContent(): Promise<ContentItem[]> {
    try {
      const [substack, youtube] = await Promise.all([
        this.getSubstackPosts(),
        this.getYouTubeVideos(),
      ]);

      const allItems = [...substack.items, ...youtube.items];
      
      // Sort by publish date, newest first
      return allItems.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } catch (error) {
      console.error('Failed to fetch content:', error);
      return [];
    }
  }

  async getContentByPlatform(platform: 'substack' | 'youtube'): Promise<ContentItem[]> {
    try {
      if (platform === 'substack') {
        const feed = await this.getSubstackPosts();
        return feed.items;
      } else if (platform === 'youtube') {
        const feed = await this.getYouTubeVideos();
        return feed.items;
      }
      return [];
    } catch (error) {
      console.error(`Failed to fetch ${platform} content:`, error);
      return [];
    }
  }
}
