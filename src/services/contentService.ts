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
      try {
        // Use Substack's direct API instead of RSS - much faster!
        const apiUrl = 'https://thecuriousnobody.substack.com/api/v1/posts?limit=20';
        
        console.log('Fetching from Substack API...');
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Substack API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const contentItems: ContentItem[] = data.map((post: any, index: number) => {
          // Enhanced image extraction with fallbacks
          let thumbnail = '';
          
          // First priority: cover_image (main featured image)
          if (post.cover_image) {
            thumbnail = post.cover_image;
          } 
          // Second priority: first image from body_html content
          else if (post.body_html) {
            // Look for Substack-specific image patterns
            const substackImgMatch = post.body_html.match(/src="(https:\/\/substackcdn\.com[^"]+)"/);
            const regularImgMatch = post.body_html.match(/<img[^>]+src="([^"]+)"/);
            
            if (substackImgMatch && substackImgMatch[1]) {
              thumbnail = substackImgMatch[1];
            } else if (regularImgMatch && regularImgMatch[1]) {
              thumbnail = regularImgMatch[1];
            }
          }
          
          // Enhanced description extraction
          let description = '';
          
          // First priority: subtitle (clean, author-written)
          if (post.subtitle && post.subtitle.trim()) {
            description = post.subtitle;
          }
          // Second priority: clean first paragraph from body
          else if (post.body_html) {
            const cleanContent = post.body_html
              .replace(/<[^>]*>/g, '') // Remove HTML tags
              .replace(/\s+/g, ' ')    // Normalize whitespace  
              .trim();
            
            // Get first meaningful paragraph (skip very short ones)
            const paragraphs = cleanContent.split(/\n\s*\n|\. [A-Z]/);
            for (const para of paragraphs) {
              if (para.length > 50) { // Skip short fragments
                description = para.length > 300 ? para.substring(0, 300) + '...' : para;
                break;
              }
            }
          }
          
          // Fallback description
          if (!description) {
            description = 'Read the full post on Substack';
          }
          
          // Enhanced reading time calculation
          const wordCount = post.word_count || 0;
          const readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : 5;
          
          return {
            id: `substack-${post.id || index}`,
            title: post.title || `Post ${index + 1}`,
            description,
            link: `https://thecuriousnobody.substack.com/p/${post.slug}`,
            publishedAt: new Date(post.post_date || post.created_at),
            platform: 'substack' as const,
            author: 'The Curious Nobody',
            thumbnail,
            tags: [`${readingTime} min read`],
          };
        });

        console.log(`Successfully fetched ${contentItems.length} posts from Substack API`);

        return {
          platform: 'Substack',
          items: contentItems,
          lastUpdated: new Date(),
        };
      } catch (error) {
        console.error('Substack API failed, falling back to RSS:', error);
        
        // Fallback to RSS if API fails
        return this.getSubstackPostsRSS();
      }
    });
  }

  private async getSubstackPostsRSS(): Promise<ContentFeed> {
    try {
      // Fallback RSS method (the old slow way)
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const feedUrl = 'https://thecuriousnobody.substack.com/feed';
      
      const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);
      const xmlText = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'application/xml');
      const items = Array.from(doc.querySelectorAll('item'));

      const contentItems: ContentItem[] = items.map((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const content = item.querySelector('content\\:encoded')?.textContent || description;
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        
        let thumbnail = '';
        const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch && imgMatch[1]) {
          thumbnail = imgMatch[1];
        }
        
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        const firstParagraph = cleanContent.split('\n\n')[0];
        const wordCount = cleanContent.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        
        return {
          id: `substack-${index}`,
          title: title.replace('<![CDATA[', '').replace(']]>', ''),
          description: firstParagraph.length > 300 
            ? firstParagraph.substring(0, 300) + '...' 
            : firstParagraph || description.replace(/<[^>]*>/g, '').substring(0, 300) + '...',
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
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const channelId = 'UC_pKSnd_emg2JJMDGJpwZnQ';
        
        if (!apiKey) {
          console.error('YouTube API key not configured');
          throw new Error('YouTube API key not configured');
        }

        // Use YouTube Data API v3 for real-time data
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=50&type=video`;
        
        console.log('Fetching from YouTube Data API v3...');
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          console.error('YouTube API error:', data.error);
          throw new Error(`YouTube API error: ${data.error.message}`);
        }

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

        console.log(`Successfully fetched ${contentItems.length} videos from YouTube API`);

        return {
          platform: 'YouTube',
          items: contentItems,
          lastUpdated: new Date(),
        };
      } catch (error) {
        console.error('YouTube API fetch error:', error);
        
        // Fallback to RSS if API fails
        console.log('Falling back to RSS feed...');
        return this.getYouTubeVideosRSS();
      }
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
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        const artistId = '2fEAGWgz0y6MdIpvIywp1R'; // The Curious Nobody
        
        if (!clientId || !clientSecret) {
          console.error('Spotify API credentials not configured');
          throw new Error('Spotify API credentials not configured');
        }

        // Get access token using Client Credentials flow
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });

        if (!tokenResponse.ok) {
          throw new Error(`Token request failed: ${tokenResponse.status}`);
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch artist's albums and singles
        const albumsResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}/albums?limit=20&include_groups=album,single&market=US`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!albumsResponse.ok) {
          throw new Error(`Albums request failed: ${albumsResponse.status}`);
        }

        const albumsData = await albumsResponse.json();

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

        console.log(`Successfully fetched ${contentItems.length} releases from Spotify API`);

        return {
          platform: 'Spotify',
          items: contentItems,
          lastUpdated: new Date(),
        };
      } catch (error) {
        console.error('Spotify API fetch error:', error);
        // Return empty feed if fetch fails
        return {
          platform: 'Spotify',
          items: [],
          lastUpdated: new Date(),
        };
      }
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
