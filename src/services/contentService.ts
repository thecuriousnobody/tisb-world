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
  private readonly STORAGE_PREFIX = 'tisb_content_';

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
      ContentService.instance.loadFromLocalStorage();
    }
    return ContentService.instance;
  }

  private loadFromLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.STORAGE_PREFIX));
      const now = Date.now();
      
      keys.forEach(key => {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Restore dates
          if (parsed.data && parsed.data.items) {
            parsed.data.items = parsed.data.items.map((item: any) => ({
              ...item,
              publishedAt: new Date(item.publishedAt),
            }));
            parsed.data.lastUpdated = new Date(parsed.data.lastUpdated);
          }
          
          // Only restore if not expired
          if (parsed.expiry > now) {
            const cacheKey = key.replace(this.STORAGE_PREFIX, '');
            this.cache.set(cacheKey, parsed);
          } else {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }

  private saveToLocalStorage(cacheKey: string, data: any): void {
    try {
      const storageKey = this.STORAGE_PREFIX + cacheKey;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      // Clear old data if storage is full
      this.clearOldStorageData();
    }
  }

  private clearOldStorageData(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.STORAGE_PREFIX));
    const now = Date.now();
    
    keys.forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.expiry < now) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        localStorage.removeItem(key);
      }
    });
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
      const cacheData = {
        data: data as any,
        expiry: now + this.CACHE_DURATION,
      };
      this.cache.set(cacheKey, cacheData);
      this.saveToLocalStorage(cacheKey, cacheData);
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
      // Try server proxy first, then fall back to direct RSS
      console.log('Fetching Substack posts...');
      
      try {
        // First try: Server-side proxy (avoids CORS issues)
        const response = await fetch('/api/substack/posts');
        if (response.ok) {
          const xmlText = await response.text();
          return this.parseSubstackXML(xmlText);
        }
      } catch (error) {
        console.warn('Server proxy failed, trying direct RSS...', error);
      }
      
      // Fallback to direct RSS with CORS proxies
      return this.getSubstackPostsRSS();
    });
  }

  private parseSubstackXML(xmlText: string): ContentFeed {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    const items = Array.from(doc.querySelectorAll('item'));

    const contentItems: ContentItem[] = items.slice(0, 20).map((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const content = item.querySelector('content\\:encoded')?.textContent || description;
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      
      // Try multiple methods to extract thumbnail
      let thumbnail = '';
      
      // Method 1: Check for enclosure tag (Substack often uses this)
      const enclosure = item.querySelector('enclosure');
      if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
        thumbnail = enclosure.getAttribute('url') || '';
      }
      
      // Method 2: Look for first img tag in content
      if (!thumbnail) {
        const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch && imgMatch[1]) {
          thumbnail = imgMatch[1];
        }
      }
      
      // Method 3: Look for figure img specifically (Substack often wraps images in figure tags)
      if (!thumbnail) {
        const figureImgMatch = content.match(/<figure[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>/);
        if (figureImgMatch && figureImgMatch[1]) {
          thumbnail = figureImgMatch[1];
        }
      }
      
      // Method 4: Look for a tag that starts with substack-post-media
      if (!thumbnail) {
        const substackImgMatch = content.match(/https:\/\/(?:substackcdn\.com|substack-post-media\.s3\.amazonaws\.com)[^"'\s>]+/);
        if (substackImgMatch) {
          thumbnail = substackImgMatch[0];
        }
      }
      
      const cleanContent = content.replace(/<[^>]*>/g, '').trim();
      const firstParagraph = cleanContent.split('\n\n')[0];
      const wordCount = cleanContent.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);
      
      // Clean up CDATA tags from title and description
      const cleanTitle = title.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim();
      const cleanDescription = description.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').replace(/<[^>]*>/g, '').trim();
      
      return {
        id: `substack-${index}`,
        title: cleanTitle,
        description: firstParagraph.length > 300 
          ? firstParagraph.substring(0, 300) + '...' 
          : firstParagraph || cleanDescription.substring(0, 300) + '...',
        link,
        publishedAt: new Date(pubDate),
        platform: 'substack' as const,
        author: 'The Curious Nobody',
        thumbnail,
        tags: [`${readingTime} min read`],
      };
    });

    return {
      platform: 'Substack',
      items: contentItems,
      lastUpdated: new Date(),
    };
  }

  private async getSubstackPostsRSS(): Promise<ContentFeed> {
    try {
      // Multiple CORS proxy options for reliability
      const proxyUrls = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://cors-anywhere.herokuapp.com/',
      ];
      const feedUrl = 'https://thecuriousnobody.substack.com/feed';
      
      let xmlText = '';
      let lastError: Error | null = null;
      
      // Try each proxy until one works
      for (const proxyUrl of proxyUrls) {
        try {
          console.log(`Trying Substack RSS with proxy: ${proxyUrl}`);
          const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          xmlText = await response.text();
          
          // Verify we got valid XML
          if (xmlText.includes('<rss') || xmlText.includes('<item')) {
            console.log('Successfully fetched Substack RSS');
            break;
          } else {
            throw new Error('Invalid XML response');
          }
        } catch (error) {
          console.warn(`Proxy ${proxyUrl} failed:`, error);
          lastError = error as Error;
          continue;
        }
      }
      
      if (!xmlText) {
        throw lastError || new Error('All CORS proxies failed');
      }
      
      return this.parseSubstackXML(xmlText);
    } catch (error) {
      console.error('Both Substack API and RSS failed:', error);
      return {
        platform: 'Substack',
        items: [],
        lastUpdated: new Date(),
      };
    }
  }

  async getYouTubeVideos(): Promise<ContentFeed> {
    return this.fetchWithCache('youtube', async () => {
      try {
        // Try server proxy first
        console.log('Fetching YouTube videos from server proxy...');
        const response = await fetch('/api/youtube/videos');
        
        if (response.ok) {
          const data = await response.json();
          
          const contentItems: ContentItem[] = data.items?.map((item: any, index: number) => {
            const videoId = item.id.videoId;
            const snippet = item.snippet;
            
            return {
              id: `youtube-${videoId}`,
              title: snippet.title,
              description: snippet.description.length > 300 
                ? snippet.description.substring(0, 300) + '...' 
                : snippet.description,
              link: `https://www.youtube.com/watch?v=${videoId}`,
              publishedAt: new Date(snippet.publishedAt),
              platform: 'youtube' as const,
              thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
              author: snippet.channelTitle,
            };
          }) || [];

          console.log(`Successfully fetched ${contentItems.length} videos from server proxy`);

          return {
            platform: 'YouTube',
            items: contentItems,
            lastUpdated: new Date(),
          };
        }
      } catch (error) {
        console.warn('Server proxy failed, falling back to RSS...', error);
      }
      
      // Fallback to RSS if server proxy fails
      return this.getYouTubeVideosRSS();
    });
  }

  private async getYouTubeVideosRSS(): Promise<ContentFeed> {
    try {
      const feedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_pKSnd_emg2JJMDGJpwZnQ';
      
      // Multiple CORS proxy options for reliability
      const proxyUrls = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest=',
      ];
      
      let xmlText = '';
      let lastError: Error | null = null;
      
      // Try each proxy until one works
      for (const proxyUrl of proxyUrls) {
        try {
          console.log(`Trying YouTube RSS with proxy: ${proxyUrl}`);
          const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          xmlText = await response.text();
          
          // Verify we got valid XML
          if (xmlText.includes('<feed') || xmlText.includes('<entry')) {
            console.log('Successfully fetched YouTube RSS');
            break;
          } else {
            throw new Error('Invalid XML response');
          }
        } catch (error) {
          console.warn(`Proxy ${proxyUrl} failed:`, error);
          lastError = error as Error;
          continue;
        }
      }
      
      if (!xmlText) {
        throw lastError || new Error('All CORS proxies failed');
      }
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'application/xml');
      const entries = Array.from(doc.querySelectorAll('entry'));

      // Get all available videos from RSS feed (usually 15-50)
      const contentItems: ContentItem[] = entries.map((entry, index) => {
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
          description: description.length > 300 ? description.substring(0, 300) + '...' : description,
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
    } catch (error) {
      console.error('YouTube RSS fetch error:', error);
      // Return empty feed if fetch fails
      return {
        platform: 'YouTube',
        items: [],
        lastUpdated: new Date(),
      };
    }
  }

  async getBehanceProjects(): Promise<ContentFeed> {
    return this.fetchWithCache('behance', async () => {
      try {
        // Load scraped data from GitHub Actions
        const response = await fetch('/data/behance-portfolio.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load Behance data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Convert to ContentItem format if needed
        const contentItems: ContentItem[] = data.items?.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          link: item.link,
          publishedAt: new Date(item.publishedAt),
          platform: 'behance' as const,
          thumbnail: item.thumbnail,
          author: item.author || 'The Idea Sandbox',
          tags: item.tags || ['art', 'design'],
        })) || [];

        console.log(`Successfully loaded ${contentItems.length} Behance projects from scraped data`);

        return {
          platform: 'Behance',
          items: contentItems,
          lastUpdated: new Date(data.lastUpdated || Date.now()),
        };
      } catch (error) {
        console.error('Behance data fetch error:', error);
        // Return empty feed if fetch fails
        return {
          platform: 'Behance',
          items: [],
          lastUpdated: new Date(),
        };
      }
    });
  }

  async getSpotifyContent(): Promise<ContentFeed> {
    return this.fetchWithCache('spotify', async () => {
      try {
        // Try server proxy first
        console.log('Fetching Spotify content from server proxy...');
        const response = await fetch('/api/spotify/releases');
        
        if (response.ok) {
          const albumsData = await response.json();
          
          const contentItems: ContentItem[] = albumsData.items?.map((album: any, index: number) => {
            return {
              id: `spotify-${album.id}`,
              title: album.name,
              description: `${album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1)} • ${album.total_tracks} track${album.total_tracks > 1 ? 's' : ''} • Released ${new Date(album.release_date).getFullYear()}`,
              link: album.external_urls.spotify,
              publishedAt: new Date(album.release_date),
              platform: 'spotify' as const,
              thumbnail: album.images[0]?.url || album.images[1]?.url || album.images[2]?.url,
              author: 'The Curious Nobody',
              tags: [album.album_type, `${album.total_tracks} tracks`],
            };
          }) || [];

          console.log(`Successfully fetched ${contentItems.length} releases from server proxy`);

          return {
            platform: 'Spotify',
            items: contentItems,
            lastUpdated: new Date(),
          };
        }
      } catch (error) {
        console.error('Spotify server proxy error:', error);
      }
      
      // Return empty feed if server proxy fails
      console.log('Server proxy failed, returning empty Spotify feed');
      return {
        platform: 'Spotify',
        items: [],
        lastUpdated: new Date(),
      };
    });
  }

  async getAllContent(): Promise<ContentItem[]> {
    try {
      const [substack, youtube, spotify, behance] = await Promise.all([
        this.getSubstackPosts(),
        this.getYouTubeVideos(),
        this.getSpotifyContent(),
        this.getBehanceProjects(),
      ]);

      const allItems = [...substack.items, ...youtube.items, ...spotify.items, ...behance.items];
      
      // Sort by publish date, newest first
      return allItems.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } catch (error) {
      console.error('Failed to fetch content:', error);
      return [];
    }
  }

  async getContentByPlatform(platform: 'substack' | 'youtube' | 'spotify' | 'behance'): Promise<ContentItem[]> {
    try {
      if (platform === 'substack') {
        const feed = await this.getSubstackPosts();
        return feed.items;
      } else if (platform === 'youtube') {
        const feed = await this.getYouTubeVideos();
        return feed.items;
      } else if (platform === 'spotify') {
        const feed = await this.getSpotifyContent();
        return feed.items;
      } else if (platform === 'behance') {
        const feed = await this.getBehanceProjects();
        return feed.items;
      }
      return [];
    } catch (error) {
      console.error(`Failed to fetch ${platform} content:`, error);
      return [];
    }
  }
}
