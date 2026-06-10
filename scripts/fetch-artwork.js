#!/usr/bin/env node
/**
 * Fetch artwork from Behance profile using a headless browser (Puppeteer).
 *
 * WHY PUPPETEER?
 * Behance is a JavaScript SPA – plain HTTP requests only get a minimal HTML
 * shell with <title>Behance</title> and no og:image tags. A headless browser
 * renders the JS, giving us real titles, thumbnails, and descriptions.
 *
 * WORKFLOW:
 * 1. Launch headless Chrome
 * 2. Visit https://www.behance.net/theideasandbox
 * 3. Scroll to load all projects
 * 4. Extract project cards (title, thumbnail, link)
 * 5. Optionally enrich with Notion database tags
 * 6. Write public/data/behance-portfolio.json
 *
 * Environment Variables (all optional now):
 * - NOTION_API_KEY:    Notion integration token (for custom tags)
 * - NOTION_ARTWORK_DB: Artwork database ID     (for custom tags)
 *
 * Usage:
 *   node scripts/fetch-artwork.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'behance-portfolio.json');
const BEHANCE_PROFILE = 'https://www.behance.net/theideasandbox';

const NOTION_TOKEN = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_ARTWORK_DB;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract a human-readable title from a Behance gallery URL slug */
function titleFromSlug(url) {
  const m = url.match(/\/gallery\/\d+\/([^/?#]+)/);
  if (!m) return 'Untitled';
  return decodeURIComponent(m[1])
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Scroll the page to trigger lazy-loaded project cards */
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 600;
      const maxHeight = 20000; // safety cap
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight || totalHeight >= maxHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 250);
    });
  });
  // Give lazy-loaded images a moment to appear
  await new Promise((r) => setTimeout(r, 3000));
}

// ---------------------------------------------------------------------------
// Primary: Scrape profile page with Puppeteer
// ---------------------------------------------------------------------------

async function scrapeProfileWithBrowser() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    console.error('Puppeteer not installed – falling back to URL-slug extraction');
    return null;
  }

  console.log('Launching headless browser…');
  const browser = await puppeteer.default.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );
    // Block unnecessary resources to speed things up
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['font', 'stylesheet', 'media'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`Navigating to ${BEHANCE_PROFILE}…`);
    await page.goto(BEHANCE_PROFILE, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for project cards to render
    try {
      await page.waitForSelector('a[href*="/gallery/"] img', { timeout: 15000 });
      console.log('Project cards detected, scrolling to load more…');
    } catch {
      console.warn('⚠ Could not detect project card images – page layout may have changed');
    }

    await autoScroll(page);

    // Extract projects from rendered DOM
    const projects = await page.evaluate(() => {
      const items = [];
      const seen = new Set();

      // Behance renders project cards as <a> tags linking to /gallery/{id}/…
      document.querySelectorAll('a[href*="/gallery/"]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (!href) return;

        const fullUrl = href.startsWith('http') ? href : `https://www.behance.net${href}`;
        const idMatch = fullUrl.match(/\/gallery\/(\d+)/);
        if (!idMatch) return;

        const projectId = idMatch[1];
        if (seen.has(projectId)) return;
        seen.add(projectId);

        // Thumbnail: first <img> inside the anchor (cover image)
        const img = anchor.querySelector('img');
        let thumbnail = '';
        if (img) {
          thumbnail = img.src || img.getAttribute('data-src') || img.getAttribute('srcset')?.split(' ')[0] || '';
        }

        // Title: look for text nodes near the anchor
        // Behance typically has the title in a sibling or child element
        let title = '';
        const titleEl =
          anchor.querySelector('[class*="Title"]') ||
          anchor.querySelector('[class*="title"]') ||
          anchor.closest('[class*="ProjectCover"]')?.querySelector('[class*="Title"]');
        if (titleEl) {
          title = titleEl.textContent?.trim() || '';
        }

        // Also check aria-label or alt text
        if (!title && img?.alt) {
          title = img.alt;
        }

        items.push({ projectId, link: fullUrl, title, thumbnail });
      });

      return items;
    });

    console.log(`✓ Found ${projects.length} projects on profile page`);
    return projects;
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------------------
// Fallback: Scrape individual project pages with Puppeteer
// ---------------------------------------------------------------------------

async function scrapeIndividualPages(urls) {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    return null;
  }

  console.log('Falling back to individual page scraping…');
  const browser = await puppeteer.default.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const results = [];
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['font', 'stylesheet', 'media'].includes(type)) req.abort();
      else req.continue();
    });

    for (const url of urls) {
      console.log(`  Fetching: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const meta = await page.evaluate(() => {
          const og = (prop) =>
            document.querySelector(`meta[property="og:${prop}"]`)?.getAttribute('content') || '';
          const title =
            og('title') ||
            document.querySelector('title')?.textContent?.replace(/\s*[-|:]\s*Behance\s*$/i, '').trim() ||
            '';
          const thumbnail = og('image');
          const description = og('description');
          return { title, thumbnail, description };
        });

        const idMatch = url.match(/\/gallery\/(\d+)/);
        results.push({
          projectId: idMatch ? idMatch[1] : Date.now().toString(),
          link: url,
          title: meta.title || titleFromSlug(url),
          thumbnail: meta.thumbnail,
          description: meta.description,
        });
        console.log(`    ✓ ${meta.title || '(title from slug)'}`);
      } catch (err) {
        console.error(`    ✗ ${err.message}`);
        const idMatch = url.match(/\/gallery\/(\d+)/);
        results.push({
          projectId: idMatch ? idMatch[1] : Date.now().toString(),
          link: url,
          title: titleFromSlug(url),
          thumbnail: '',
          description: '',
        });
      }
      // Be polite
      await new Promise((r) => setTimeout(r, 1000));
    }
  } finally {
    await browser.close();
  }

  return results;
}

// ---------------------------------------------------------------------------
// Notion helpers (for custom tags – optional)
// ---------------------------------------------------------------------------

function notionRequest(endpoint, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: endpoint,
      method,
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) reject(new Error(`Notion ${res.statusCode}: ${parsed.message || data}`));
          else resolve(parsed);
        } catch {
          reject(new Error(`Notion parse error: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/** Returns a Map of behanceUrl → { tags } from the Notion database */
async function fetchNotionTags() {
  if (!NOTION_TOKEN || !DATABASE_ID) return new Map();

  try {
    console.log('Fetching tags from Notion…');
    const data = await notionRequest(`/v1/databases/${DATABASE_ID}/query`, 'POST', {
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    });

    const tagMap = new Map();
    for (const page of data.results || []) {
      const props = page.properties;

      // Find Behance URL
      let url = null;
      for (const key of Object.keys(props)) {
        if (props[key].type === 'url' && props[key].url?.includes('behance.net')) {
          url = props[key].url;
          break;
        }
        if (props[key].type === 'rich_text' && props[key].rich_text?.[0]?.plain_text?.includes('behance.net')) {
          url = props[key].rich_text[0].plain_text;
          break;
        }
      }
      if (!url) continue;

      // Get tags
      let tags = ['digital art'];
      if (props.Tags?.rich_text?.[0]?.plain_text) {
        tags = props.Tags.rich_text[0].plain_text.split(',').map((t) => t.trim()).filter(Boolean);
      } else if (props.Tags?.multi_select) {
        tags = props.Tags.multi_select.map((t) => t.name);
      }

      // Normalize URL for matching (strip trailing slashes, etc.)
      const normalized = url.replace(/\/+$/, '').toLowerCase();
      tagMap.set(normalized, { tags, createdTime: page.created_time });
    }

    console.log(`  Found tags for ${tagMap.size} entries`);
    return tagMap;
  } catch (err) {
    console.warn(`  ⚠ Notion tags unavailable: ${err.message}`);
    return new Map();
  }
}

/** Get Behance URLs from Notion (used when profile scraping fails) */
async function fetchNotionUrls() {
  if (!NOTION_TOKEN || !DATABASE_ID) return [];

  try {
    const data = await notionRequest(`/v1/databases/${DATABASE_ID}/query`, 'POST', {
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    });

    const urls = [];
    for (const page of data.results || []) {
      const props = page.properties;
      for (const key of Object.keys(props)) {
        if (props[key].type === 'url' && props[key].url?.includes('behance.net/gallery/')) {
          urls.push(props[key].url);
          break;
        }
        if (
          props[key].type === 'rich_text' &&
          props[key].rich_text?.[0]?.plain_text?.includes('behance.net/gallery/')
        ) {
          urls.push(props[key].rich_text[0].plain_text);
          break;
        }
      }
    }
    return urls;
  } catch (err) {
    console.warn(`  ⚠ Could not fetch Notion URLs: ${err.message}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Behance Artwork Sync ===\n');

  // 1. Try scraping the profile page (best: one page load gets everything)
  let rawProjects = await scrapeProfileWithBrowser();

  // 2. If profile scrape failed or got nothing, try individual pages from Notion
  if (!rawProjects || rawProjects.length === 0) {
    console.log('\nProfile scrape returned no results.');
    const notionUrls = await fetchNotionUrls();

    if (notionUrls.length > 0) {
      console.log(`Got ${notionUrls.length} URLs from Notion, trying individual pages…\n`);
      rawProjects = await scrapeIndividualPages(notionUrls);
    }
  }

  // 3. If still nothing, fall back to URL-slug extraction from Notion
  if (!rawProjects || rawProjects.length === 0) {
    console.log('\nBrowser scraping unavailable. Extracting titles from URL slugs…');
    const notionUrls = await fetchNotionUrls();

    if (notionUrls.length === 0) {
      console.error('No Notion URLs and no browser – cannot proceed.');
      console.error('Set NOTION_API_KEY + NOTION_ARTWORK_DB, or install puppeteer.');
      process.exit(1);
    }

    rawProjects = notionUrls.map((url) => {
      const idMatch = url.match(/\/gallery\/(\d+)/);
      return {
        projectId: idMatch ? idMatch[1] : Date.now().toString(),
        link: url,
        title: titleFromSlug(url),
        thumbnail: '',
        description: '',
      };
    });
    console.log(`  Extracted ${rawProjects.length} projects from URL slugs`);
  }

  // 4. Fetch Notion tags for enrichment
  const notionTags = await fetchNotionTags();

  // 5. Build final items
  const items = rawProjects.map((p) => {
    const normalized = p.link.replace(/\/+$/, '').toLowerCase();
    const notionEntry = notionTags.get(normalized);

    return {
      id: `behance-${p.projectId}`,
      title: p.title || titleFromSlug(p.link),
      description: p.description || `Creative artwork by The Idea Sandbox`,
      link: p.link,
      publishedAt: notionEntry?.createdTime || new Date().toISOString(),
      platform: 'behance',
      thumbnail: p.thumbnail || '',
      author: 'The Idea Sandbox',
      tags: notionEntry?.tags || ['digital art'],
    };
  });

  // Filter out any with generic "Behance" title (sign of failed extraction)
  for (const item of items) {
    if (item.title === 'Behance' || !item.title) {
      item.title = titleFromSlug(item.link);
    }
  }

  console.log(`\n✓ ${items.length} artwork items ready`);

  // 6. Write output
  const output = {
    platform: 'Behance',
    items,
    lastUpdated: new Date().toISOString(),
    scrapedAt: new Date().toISOString(),
    updateMethod: 'puppeteer_profile_scrape',
    note: 'Scraped from Behance profile with headless browser',
  };

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Saved to ${OUTPUT_PATH}\n`);

  // Quick summary
  const withThumbs = items.filter((i) => i.thumbnail).length;
  const withTitles = items.filter((i) => i.title && i.title !== 'Untitled').length;
  console.log(`Summary: ${items.length} projects, ${withThumbs} with thumbnails, ${withTitles} with titles`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
