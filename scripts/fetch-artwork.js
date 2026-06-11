#!/usr/bin/env node
/**
 * Sync artwork from the Behance RSS feed.
 *
 * Behance blocks datacenter IPs from its profile pages (which killed the old
 * Puppeteer scraper), but the RSS feed is a sanctioned, structured endpoint
 * that works everywhere — and carries better data: real titles, the artist
 * statement as description, CDN thumbnails, and true publish dates.
 *
 * The feed only holds the latest ~12 projects, so each run MERGES into the
 * existing JSON (keyed by gallery ID) — once a piece is seen it never drops
 * off the art page.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'behance-portfolio.json');
const FEED_URL = 'https://www.behance.net/feeds/user?username=theideasandbox';

function cdata(block, tag) {
  const m = block.match(new RegExp(`<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`));
  if (m) return m[1].trim();
  const plain = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return plain ? plain[1].trim() : '';
}

function parseFeed(xml) {
  const items = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1];
    const link = cdata(block, 'link');
    const idMatch = link.match(/\/gallery\/(\d+)/);
    if (!idMatch) continue;

    const rawDesc = cdata(block, 'description');
    const thumbnail = rawDesc.match(/<img[^>]+src='([^']+)'/)?.[1] || '';
    const description = rawDesc
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const pubDate = cdata(block, 'pubDate');
    items.push({
      id: `behance-${idMatch[1]}`,
      title: cdata(block, 'title') || 'Untitled',
      description: description || 'Creative artwork by The Idea Sandbox',
      link,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      platform: 'behance',
      thumbnail,
      author: 'The Idea Sandbox',
      tags: ['digital art'],
    });
  }
  return items;
}

function loadExisting() {
  try {
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

async function main() {
  console.log('=== Behance Artwork Sync (RSS) ===');
  const res = await fetch(FEED_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
  });
  if (!res.ok) {
    console.error(`Feed request failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const feedItems = parseFeed(await res.text());
  if (feedItems.length === 0) {
    console.error('Feed parsed to 0 items — feed format may have changed. Refusing to overwrite.');
    process.exit(1);
  }
  console.log(`Feed: ${feedItems.length} projects`);

  // Merge: feed wins (fresher data), archived items that left the feed survive
  const merged = new Map();
  for (const item of loadExisting()) merged.set(item.id, item);
  let added = 0;
  for (const item of feedItems) {
    if (!merged.has(item.id)) added++;
    merged.set(item.id, item);
  }

  const items = [...merged.values()].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(
      {
        platform: 'Behance',
        items,
        lastUpdated: new Date().toISOString(),
        scrapedAt: new Date().toISOString(),
        updateMethod: 'rss_feed',
        note: 'Synced from Behance RSS; archive merged across runs',
      },
      null,
      2
    )
  );

  const withThumbs = items.filter((i) => i.thumbnail).length;
  console.log(`Saved ${items.length} items (${added} new, ${withThumbs} with thumbnails) → ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
