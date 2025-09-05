#!/usr/bin/env node

import axios from 'axios';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BEHANCE_URL = 'https://www.behance.net/theideasandbox';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'behance-portfolio.json');

async function scrapeBehance() {
  console.log('🎨 Starting Behance portfolio scrape...');
  
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    console.log(`📱 Fetching: ${BEHANCE_URL}`);
    
    const response = await axios.get(BEHANCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const projects = [];
    
    // Look for project containers - Behance uses various selectors
    const projectSelectors = [
      '[data-project-id]',
      '.project-cover',
      '.rf-project-cover',
      '.js-project-cover',
      'a[href*="/gallery/"]'
    ];
    
    for (const selector of projectSelectors) {
      const elements = $(selector);
      console.log(`🔍 Found ${elements.length} elements with selector: ${selector}`);
      
      if (elements.length > 0) {
        elements.each((i, element) => {
          try {
            const $el = $(element);
            const $link = $el.is('a') ? $el : $el.find('a').first();
            const href = $link.attr('href');
            
            if (!href || !href.includes('/gallery/')) return;
            
            const title = $el.find('img').attr('alt') || 
                         $el.attr('title') || 
                         $el.text().trim() || 
                         `Project ${projects.length + 1}`;
            
            const image = $el.find('img').attr('src') || 
                         $el.find('img').attr('data-src') ||
                         '';
            
            const fullUrl = href.startsWith('http') ? href : `https://www.behance.net${href}`;
            
            // Avoid duplicates
            if (!projects.some(p => p.link === fullUrl)) {
              projects.push({
                id: `behance-${projects.length + 1}`,
                title: title.substring(0, 100),
                description: `Art project by The Idea Sandbox • View on Behance`,
                link: fullUrl,
                publishedAt: new Date().toISOString(), // We don't have exact date from scraping
                platform: 'behance',
                thumbnail: image.startsWith('http') ? image : (image ? `https:${image}` : ''),
                author: 'The Idea Sandbox',
                tags: ['art', 'design']
              });
            }
          } catch (err) {
            console.warn(`⚠️ Error processing element ${i}:`, err.message);
          }
        });
        
        if (projects.length > 0) break; // Found projects, no need to try other selectors
      }
    }
    
    // If no projects found with standard selectors, try a more generic approach
    if (projects.length === 0) {
      console.log('🔍 Trying generic image scraping...');
      
      $('img').each((i, img) => {
        const $img = $(img);
        const src = $img.attr('src') || $img.attr('data-src');
        const alt = $img.attr('alt') || '';
        
        // Look for images that seem like project thumbnails
        if (src && alt && (
          src.includes('behance.net') || 
          alt.toLowerCase().includes('project') ||
          $img.closest('a[href*="/gallery/"]').length > 0
        )) {
          const $link = $img.closest('a');
          const href = $link.attr('href');
          
          if (href && href.includes('/gallery/')) {
            const fullUrl = href.startsWith('http') ? href : `https://www.behance.net${href}`;
            
            if (!projects.some(p => p.link === fullUrl)) {
              projects.push({
                id: `behance-${projects.length + 1}`,
                title: alt.substring(0, 100) || `Project ${projects.length + 1}`,
                description: `Art project by The Idea Sandbox • View on Behance`,
                link: fullUrl,
                publishedAt: new Date().toISOString(),
                platform: 'behance',
                thumbnail: src.startsWith('http') ? src : (src ? `https:${src}` : ''),
                author: 'The Idea Sandbox',
                tags: ['art', 'design']
              });
            }
          }
        }
        
        // Limit to avoid too many false positives
        if (projects.length >= 20) return false;
      });
    }
    
    console.log(`✅ Scraped ${projects.length} projects from Behance`);
    
    // If no projects found, use manual fallback data
    if (projects.length === 0) {
      console.log('📝 Using manual fallback projects...');
      projects.push(
        {
          id: 'behance-1',
          title: 'Digital Art Collection',
          description: 'Explore my latest digital artworks and creative experiments • View on Behance',
          link: 'https://www.behance.net/theideasandbox',
          publishedAt: new Date().toISOString(),
          platform: 'behance',
          thumbnail: 'https://via.placeholder.com/400x300/000000/FF4500?text=Digital+Art',
          author: 'The Idea Sandbox',
          tags: ['digital art', 'creative']
        },
        {
          id: 'behance-2',
          title: 'Brutalist Design Experiments',
          description: 'Bold typography and experimental layout designs • View on Behance',
          link: 'https://www.behance.net/theideasandbox',
          publishedAt: new Date().toISOString(),
          platform: 'behance',
          thumbnail: 'https://via.placeholder.com/400x300/1a1a1a/00FF00?text=Brutalist+Design',
          author: 'The Idea Sandbox',
          tags: ['brutalism', 'typography']
        },
        {
          id: 'behance-3',
          title: 'AI-Generated Art Series',
          description: 'Exploring the intersection of AI and creative expression • View on Behance',
          link: 'https://www.behance.net/theideasandbox',
          publishedAt: new Date().toISOString(),
          platform: 'behance',
          thumbnail: 'https://via.placeholder.com/400x300/2a2a2a/FFD700?text=AI+Art',
          author: 'The Idea Sandbox',
          tags: ['ai art', 'experimental']
        }
      );
    }
    
    // Create the final portfolio object
    const portfolio = {
      platform: 'Behance',
      items: projects.slice(0, 12), // Limit to 12 most recent
      lastUpdated: new Date().toISOString(),
      scrapedAt: new Date().toISOString()
    };
    
    // Write to file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(portfolio, null, 2));
    
    console.log(`💾 Saved portfolio to: ${OUTPUT_FILE}`);
    console.log(`📊 Total projects: ${portfolio.items.length}`);
    
    // Log first project for verification
    if (portfolio.items.length > 0) {
      console.log('🎯 Sample project:', {
        title: portfolio.items[0].title,
        link: portfolio.items[0].link,
        thumbnail: portfolio.items[0].thumbnail ? 'Found' : 'Missing'
      });
    }
    
    return portfolio;
    
  } catch (error) {
    console.error('❌ Error scraping Behance:', error.message);
    
    // Create fallback data
    const fallback = {
      platform: 'Behance',
      items: [],
      lastUpdated: new Date().toISOString(),
      error: error.message,
      scrapedAt: new Date().toISOString()
    };
    
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(fallback, null, 2));
    console.log('💾 Saved fallback data');
    
    // Don't throw error - GitHub Actions should continue
    process.exit(0);
  }
}

// Run the scraper
scrapeBehance();