// Simple Express server to proxy API calls and avoid CORS issues
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy endpoint for Substack API
app.get('/api/substack/posts', async (req, res) => {
  try {
    console.log('Fetching Substack posts from server...');
    const response = await fetch('https://thecuriousnobody.substack.com/api/v1/posts?limit=20');
    
    if (!response.ok) {
      throw new Error(`Substack API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.length} posts from Substack`);
    
    res.json(data);
  } catch (error) {
    console.error('Substack API error:', error);
    res.status(500).json({ error: 'Failed to fetch Substack posts' });
  }
});

// Proxy endpoint for YouTube API
app.get('/api/youtube/videos', async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = 'UC_pKSnd_emg2JJMDGJpwZnQ';
    
    if (!apiKey) {
      throw new Error('YouTube API key not configured');
    }
    
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=50&type=video`);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

// Proxy endpoint for Spotify API
app.get('/api/spotify/releases', async (req, res) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const artistId = '2fEAGWgz0y6MdIpvIywp1R';
    
    if (!clientId || !clientSecret) {
      throw new Error('Spotify API credentials not configured');
    }
    
    // Get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });
    
    const tokenData = await tokenResponse.json();
    
    // Get albums
    const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=20&include_groups=album,single&market=US`, {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });
    
    const albumsData = await albumsResponse.json();
    res.json(albumsData);
  } catch (error) {
    console.error('Spotify API error:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify releases' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});