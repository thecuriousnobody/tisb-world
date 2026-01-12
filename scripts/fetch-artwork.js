#!/usr/bin/env node
/**
 * Fetch artwork from Notion database and save to JSON
 *
 * This script fetches artwork/portfolio items from a Notion database
 * and saves them to a static JSON file that the website can read.
 *
 * Setup:
 * 1. Create a Notion database with these properties:
 *    - Title (title) - Artwork name
 *    - Behance URL (url) - Link to Behance project
 *    - Thumbnail (url) - Direct link to thumbnail image
 *    - Description (rich_text) - Description of the artwork
 *    - Tags (rich_text) - Comma-separated tags
 *
 * 2. Share the database with your Notion integration
 *
 * 3. Set environment variables:
 *    - NOTION_API_KEY: Your Notion integration token
 *    - NOTION_ARTWORK_DB: Your artwork database ID
 *
 * Usage:
 *   NOTION_API_KEY=xxx NOTION_ARTWORK_DB=xxx node scripts/fetch-artwork.js
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
 * Make HTTPS request to Notion API
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
 * Fetch all artwork from Notion database
 */
async function fetchArtwork() {
  console.log('Fetching artwork from Notion database...');

  const data = await notionRequest(`/v1/databases/${DATABASE_ID}/query`, 'POST', {
    sorts: [{ property: 'Created', direction: 'descending' }]
  });

  console.log(`Found ${data.results?.length || 0} artwork items`);

  const items = data.results.map((page, index) => {
    const props = page.properties;

    // Extract title
    const title = props.Title?.title?.[0]?.plain_text ||
                  props.Name?.title?.[0]?.plain_text ||
                  `Artwork ${index + 1}`;

    // Extract Behance URL
    const link = props['Behance URL']?.url ||
                 props.URL?.url ||
                 props.Link?.url ||
                 'https://www.behance.net/theideasandbox';

    // Extract thumbnail
    const thumbnail = props.Thumbnail?.url ||
                      props.Image?.url ||
                      props['Image URL']?.url ||
                      '';

    // Extract description
    const description = props.Description?.rich_text?.[0]?.plain_text ||
                        'Creative project by The Idea Sandbox';

    // Extract tags (can be rich_text or multi_select)
    let tags = ['digital art'];
    if (props.Tags?.rich_text?.[0]?.plain_text) {
      tags = props.Tags.rich_text[0].plain_text.split(',').map(t => t.trim()).filter(t => t);
    } else if (props.Tags?.multi_select) {
      tags = props.Tags.multi_select.map(t => t.name);
    }

    // Generate ID from title
    const id = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30) + '-' + new Date(page.created_time).getFullYear();

    return {
      id,
      title,
      description,
      link,
      publishedAt: page.created_time,
      platform: 'behance',
      thumbnail,
      author: 'The Idea Sandbox',
      tags
    };
  });

  return items;
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
    const items = await fetchArtwork();

    if (items.length === 0) {
      console.warn('Warning: No artwork found in database');
      console.warn('Make sure to share the database with your Notion integration');
    }

    // Create output object
    const output = {
      platform: 'Behance',
      items,
      lastUpdated: new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      updateMethod: 'notion_sync',
      note: 'Synced from Notion database'
    };

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log(`Saved ${items.length} artwork items to ${OUTPUT_PATH}`);

    // Print summary
    if (items.length > 0) {
      console.log('\nArtwork synced:');
      items.slice(0, 5).forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.title.substring(0, 40)}${item.title.length > 40 ? '...' : ''}`);
      });
      if (items.length > 5) {
        console.log(`  ... and ${items.length - 5} more`);
      }
    }

  } catch (error) {
    console.error('Error fetching artwork:', error.message);
    process.exit(1);
  }
}

main();
