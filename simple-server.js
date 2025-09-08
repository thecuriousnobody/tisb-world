import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4444;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Substack RSS proxy
app.get('/api/substack/posts', async (req, res) => {
  try {
    console.log('📡 Fetching Substack posts via RSS...');
    const feedUrl = 'https://thecuriousnobody.substack.com/feed';
    
    const response = await fetch(feedUrl);
    
    if (!response.ok) {
      throw new Error(`RSS fetch error: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log('✅ Fetched Substack RSS feed');
    
    // Send the raw XML - the frontend will parse it
    res.set('Content-Type', 'application/xml');
    res.send(xmlText);
  } catch (error) {
    console.error('❌ Substack RSS error:', error);
    res.status(500).json({ error: 'Failed to fetch Substack posts' });
  }
});

// YouTube API proxy
app.get('/api/youtube/videos', async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = 'UC_pKSnd_emg2JJMDGJpwZnQ';
    
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }
    
    console.log('📡 Fetching YouTube videos...');
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=50&type=video`);
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.items?.length || 0} YouTube videos`);
    
    res.json(data);
  } catch (error) {
    console.error('❌ YouTube error:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

// Spotify API proxy
app.get('/api/spotify/releases', async (req, res) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const artistId = '2fEAGWgz0y6MdIpvIywp1R';
    
    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Spotify credentials not configured' });
    }
    
    console.log('📡 Getting Spotify token...');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });
    
    const tokenData = await tokenResponse.json();
    
    console.log('📡 Fetching Spotify releases...');
    const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=20&include_groups=album,single&market=US`, {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });
    
    const albumsData = await albumsResponse.json();
    console.log(`✅ Fetched ${albumsData.items?.length || 0} Spotify releases`);
    
    res.json(albumsData);
  } catch (error) {
    console.error('❌ Spotify error:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify releases' });
  }
});

// Catch-all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
});