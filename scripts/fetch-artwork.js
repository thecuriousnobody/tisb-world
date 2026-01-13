#!/usr/bin/env node
/**
 * Fetch artwork from Notion database and auto-extract Behance metadata
 *
 * SIMPLE WORKFLOW:
 * 1. Paste a Behance URL into your Notion database
 * 2. Run this script (manually or via GitHub Actions)
 * 3. Title, thumbnail, etc. are automatically extracted!
 *
 * Notion Database Setup:
 * - Just need ONE column: "Behance URL" (type: URL)
 * - Optional: "Tags" column (type: Text) for custom tags
 *
 * Environment Variables:
 * - NOTION_API_KEY: Your Notion integration token
 * - NOTION_ARTWORK_DB: Your artwork database ID
 *
 * Usage:
 *   node scripts/fetch-artwork.js
 *
 * Output:
 *   public/data/behance-portfolio.json
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'behance-portfolio.json');

const NOTION_TOKEN = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_ARTWORK_DB;

/**
 * Make HTTPS request
 */
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location, headers).then(resolve).catch(reject);
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Make Notion API request
 */
function notionRequest(endpoint, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: endpoint,
      method,
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`Notion API error: ${res.statusCode} - ${parsed.message || data}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Extract metadata from a Behance URL
 */
async function fetchBehanceMetadata(url) {
  console.log(`  Fetching: ${url}`);

  try {
    const html = await httpsGet(url);

    // Extract title from <title> tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].replace(/\s*::\s*Behance\s*$/i, '').trim() : 'Untitled';

    // Extract thumbnail - try multiple patterns
    let thumbnail = '';

    // Method 1: og:image meta tag (various formats)
    const ogImagePatterns = [
      /<meta\s+property="og:image"\s+content="([^"]+)"/i,
      /<meta\s+content="([^"]+)"\s+property="og:image"/i,
      /property="og:image"[^>]+content="([^"]+)"/i,
      /content="([^"]+)"[^>]+property="og:image"/i,
    ];

    for (const pattern of ogImagePatterns) {
      const match = html.match(pattern);
      if (match && match[1].includes('behance.net')) {
        thumbnail = match[1];
        break;
      }
    }

    // Method 2: twitter:image
    if (!thumbnail) {
      const twitterMatch = html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);
      if (twitterMatch) {
        thumbnail = twitterMatch[1];
      }
    }

    // Method 3: Look for Behance CDN project images
    if (!thumbnail) {
      const cdnMatch = html.match(/https:\/\/mir-s3-cdn-cf\.behance\.net\/projects\/[^"'\s]+/);
      if (cdnMatch) {
        thumbnail = cdnMatch[0];
      }
    }

    // Method 4: JSON-LD structured data
    if (!thumbnail) {
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
      if (jsonLdMatch) {
        try {
          const jsonLd = JSON.parse(jsonLdMatch[1]);
          if (jsonLd.image) {
            thumbnail = jsonLd.image;
          }
        } catch (e) {}
      }
    }

    // Extract description - try JSON-LD first for richer content
    let description = '';
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
    if (jsonLdMatch) {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1]);
        if (jsonLd.description) {
          // Clean up the description
          description = jsonLd.description
            .replace(/\\n/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, ' ')
            .trim();
        }
        // Also get title from JSON-LD if available (more reliable)
        if (jsonLd.name && jsonLd.name !== 'Behance') {
          title = jsonLd.name;
        }
      } catch (e) {}
    }

    if (!description) {
      description = `Creative artwork by The Idea Sandbox`;
    }

    // Extract project ID from URL for unique ID
    const idMatch = url.match(/gallery\/(\d+)/);
    const projectId = idMatch ? idMatch[1] : Date.now().toString();

    console.log(`    ✓ Title: ${title}`);
    console.log(`    ✓ Thumbnail: ${thumbnail ? 'Found' : 'Not found'}`);
    console.log(`    ✓ Description: ${description.substring(0, 50)}...`);

    return {
      id: `behance-${projectId}`,
      title,
      description: description.length > 300 ? description.substring(0, 300) + '...' : description,
      thumbnail,
      projectId
    };

  } catch (error) {
    console.error(`    ✗ Error: ${error.message}`);
    return null;
  }
}

/**
 * Fetch Behance URLs from Notion database
 */
async function fetchNotionEntries() {
  console.log('Fetching entries from Notion database...');

  const data = await notionRequest(`/v1/databases/${DATABASE_ID}/query`, 'POST', {
    sorts: [{ timestamp: 'created_time', direction: 'descending' }]
  });

  console.log(`Found ${data.results?.length || 0} entries in Notion\n`);

  const entries = [];

  for (const page of data.results) {
    const props = page.properties;

    // Find the Behance URL - check common column names
    let behanceUrl = props['Behance URL']?.url ||
                     props['URL']?.url ||
                     props['Link']?.url ||
                     props['Behance']?.url ||
                     null;

    // Also check if URL is in a rich_text field
    if (!behanceUrl) {
      for (const key of Object.keys(props)) {
        if (props[key].type === 'url' && props[key].url?.includes('behance.net')) {
          behanceUrl = props[key].url;
          break;
        }
        if (props[key].type === 'rich_text' && props[key].rich_text?.[0]?.plain_text?.includes('behance.net')) {
          behanceUrl = props[key].rich_text[0].plain_text;
          break;
        }
      }
    }

    if (!behanceUrl || !behanceUrl.includes('behance.net/gallery/')) {
      console.log(`  Skipping entry (no valid Behance URL found)`);
      continue;
    }

    // Get optional tags
    let tags = ['digital art'];
    if (props.Tags?.rich_text?.[0]?.plain_text) {
      tags = props.Tags.rich_text[0].plain_text.split(',').map(t => t.trim()).filter(t => t);
    } else if (props.Tags?.multi_select) {
      tags = props.Tags.multi_select.map(t => t.name);
    }

    entries.push({
      behanceUrl,
      tags,
      createdTime: page.created_time
    });
  }

  return entries;
}

/**
 * Main function
 */
async function main() {
  // Check for required environment variables
  if (!NOTION_TOKEN) {
    console.error('Error: NOTION_API_KEY environment variable is required');
    console.error('Get your integration token from https://www.notion.so/my-integrations');
    process.exit(1);
  }

  if (!DATABASE_ID) {
    console.error('Error: NOTION_ARTWORK_DB environment variable is required');
    console.error('This is the ID of your Notion artwork database');
    console.error('You can find it in the database URL: notion.so/[DATABASE_ID]?v=...');
    process.exit(1);
  }

  try {
    // Get Behance URLs from Notion
    const entries = await fetchNotionEntries();

    if (entries.length === 0) {
      console.warn('\nNo valid Behance URLs found in Notion database');
      console.warn('Make sure to:');
      console.warn('1. Add entries with Behance gallery URLs');
      console.warn('2. Share the database with your Notion integration');
      process.exit(0);
    }

    console.log(`\nFetching metadata for ${entries.length} Behance projects...\n`);

    // Fetch metadata for each Behance URL
    const items = [];
    for (const entry of entries) {
      const metadata = await fetchBehanceMetadata(entry.behanceUrl);

      if (metadata) {
        items.push({
          id: metadata.id,
          title: metadata.title,
          description: metadata.description,
          link: entry.behanceUrl,
          publishedAt: entry.createdTime,
          platform: 'behance',
          thumbnail: metadata.thumbnail,
          author: 'The Idea Sandbox',
          tags: entry.tags
        });
      }

      // Small delay to be nice to Behance servers
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\nSuccessfully processed ${items.length} artwork items`);

    // Create output object
    const output = {
      platform: 'Behance',
      items,
      lastUpdated: new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      updateMethod: 'notion_behance_sync',
      note: 'Auto-synced from Notion with Behance metadata extraction'
    };

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log(`\nSaved to ${OUTPUT_PATH}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
