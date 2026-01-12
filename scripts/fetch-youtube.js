#!/usr/bin/env node
/**
 * Fetch YouTube videos from RSS feed and save to JSON
 *
 * This script fetches videos from The Idea Sandbox YouTube channel
 * using the free RSS feed (no API quota needed) and saves them
 * to a static JSON file that the website can read.
 *
 * Usage:
 *   node scripts/fetch-youtube.js
 *
 * Output:
 *   public/data/youtube-videos.json
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHANNEL_ID = 'UC_pKSnd_emg2JJMDGJpwZnQ';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'youtube-videos.json');

/**
 * Fetch URL content
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Parse YouTube RSS XML and extract video data
 */
function parseYouTubeRSS(xml) {
  const videos = [];

  // Extract channel title
  const channelTitleMatch = xml.match(/<title>([^<]+)<\/title>/);
  const channelTitle = channelTitleMatch ? channelTitleMatch[1] : 'The Idea Sandbox';

  // Find all entry blocks
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    // Extract video ID
    const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) continue;

    // Extract title
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1] : '';

    // Extract published date
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
    const publishedAt = publishedMatch ? publishedMatch[1] : new Date().toISOString();

    // Extract description from media:description
    const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
    let description = descMatch ? descMatch[1].trim() : '';

    // Truncate description if too long
    if (description.length > 500) {
      description = description.substring(0, 500) + '...';
    }

    // Extract view count if available
    const viewsMatch = entry.match(/<media:statistics views="(\d+)"/);
    const views = viewsMatch ? parseInt(viewsMatch[1], 10) : 0;

    // Generate thumbnail URL (maxresdefault with fallback)
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const thumbnailFallback = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    videos.push({
      id: `youtube-${videoId}`,
      videoId,
      title,
      description,
      link: `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt,
      platform: 'youtube',
      thumbnail,
      thumbnailFallback,
      author: channelTitle,
      views
    });
  }

  return videos;
}

/**
 * Main function
 */
async function main() {
  console.log('Fetching YouTube RSS feed...');
  console.log(`URL: ${RSS_URL}`);

  try {
    const xml = await fetchUrl(RSS_URL);
    console.log(`Received ${xml.length} bytes`);

    const videos = parseYouTubeRSS(xml);
    console.log(`Parsed ${videos.length} videos`);

    if (videos.length === 0) {
      console.error('No videos found! Check if the RSS feed is valid.');
      process.exit(1);
    }

    // Create output object
    const output = {
      platform: 'YouTube',
      channelId: CHANNEL_ID,
      channelName: 'The Idea Sandbox',
      items: videos,
      lastUpdated: new Date().toISOString(),
      fetchMethod: 'rss_feed',
      note: 'Fetched from YouTube RSS feed - no API quota used'
    };

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log(`Saved to ${OUTPUT_PATH}`);

    // Print summary
    console.log('\nVideos fetched:');
    videos.slice(0, 5).forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.title.substring(0, 50)}...`);
    });
    if (videos.length > 5) {
      console.log(`  ... and ${videos.length - 5} more`);
    }

  } catch (error) {
    console.error('Error fetching YouTube videos:', error.message);
    process.exit(1);
  }
}

main();
