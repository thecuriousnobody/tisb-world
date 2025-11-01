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
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Parse JSON bodies
app.use(express.json());

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

// Notion API proxy - GET videos
app.get('/api/notion/videos', async (req, res) => {
  try {
    const NOTION_TOKEN = process.env.NOTION_API_KEY;
    const DATABASE_ID = 'e6101ffb659249c09af07012d65ba65f';

    if (!NOTION_TOKEN) {
      return res.status(500).json({ error: 'Notion API key not configured' });
    }

    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };

    console.log('📡 Fetching videos from Notion database...');
    
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Notion API error:', errorData);
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} videos from Notion`);

    const videos = data.results.map(page => {
      const props = page.properties;
      const statusName = props.Status?.status?.name || 'Not Started';
      const statusMap = {
        'Not Started': 'not_started',
        'In Progress': 'in_progress',
        'Done': 'done'
      };
      
      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text || '',
        riversideLink: props['Video Link']?.url || '',
        status: statusMap[statusName] || 'not_started',
        sentiment: props.Sentiment?.rich_text?.[0]?.plain_text || '',
        notes: props.Comments?.rich_text?.[0]?.plain_text || '',
        createdAt: page.created_time,
        updatedAt: page.last_edited_time,
      };
    });

    res.json({ videos });
  } catch (error) {
    console.error('❌ Notion error:', error);
    res.status(500).json({ error: 'Failed to fetch videos from Notion' });
  }
});

// Notion API proxy - CREATE video
app.post('/api/notion/videos', async (req, res) => {
  try {
    const NOTION_TOKEN = process.env.NOTION_API_KEY;
    const DATABASE_ID = 'e6101ffb659249c09af07012d65ba65f';

    if (!NOTION_TOKEN) {
      return res.status(500).json({ error: 'Notion API key not configured' });
    }

    const { title, riversideLink, status, sentiment, notes } = req.body;

    const statusMap = {
      'not_started': 'Not Started',
      'in_progress': 'In Progress',
      'done': 'Done'
    };

    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };

    console.log('📝 Creating new video in Notion...');

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Title: { title: [{ text: { content: title } }] },
          'Video Link': { url: riversideLink || null },
          Status: { status: { name: statusMap[status] || 'Not Started' } },
          Sentiment: { rich_text: sentiment ? [{ text: { content: sentiment } }] : [] },
          Comments: { rich_text: notes ? [{ text: { content: notes } }] : [] }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Notion create error:', errorData);
      throw new Error(`Failed to create page: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Created video in Notion');
    res.json({ success: true, id: data.id });
  } catch (error) {
    console.error('❌ Notion error:', error);
    res.status(500).json({ error: 'Failed to create video in Notion' });
  }
});

// Notion API proxy - UPDATE video
app.patch('/api/notion/videos', async (req, res) => {
  try {
    const NOTION_TOKEN = process.env.NOTION_API_KEY;

    if (!NOTION_TOKEN) {
      return res.status(500).json({ error: 'Notion API key not configured' });
    }

    const { id, title, riversideLink, status, sentiment, notes } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Video ID required' });
    }

    const statusMap = {
      'not_started': 'Not Started',
      'in_progress': 'In Progress',
      'done': 'Done'
    };

    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };

    const properties = {};
    if (title !== undefined) properties.Title = { title: [{ text: { content: title } }] };
    if (riversideLink !== undefined) properties['Video Link'] = { url: riversideLink || null };
    if (status !== undefined) properties.Status = { status: { name: statusMap[status] || 'Not Started' } };
    if (sentiment !== undefined) properties.Sentiment = { rich_text: sentiment ? [{ text: { content: sentiment } }] : [] };
    if (notes !== undefined) properties.Comments = { rich_text: notes ? [{ text: { content: notes } }] : [] };

    console.log('✏️ Updating video in Notion...');

    const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ properties })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Notion update error:', errorData);
      throw new Error(`Failed to update page: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Updated video in Notion');
    res.json({ success: true, id: data.id });
  } catch (error) {
    console.error('❌ Notion error:', error);
    res.status(500).json({ error: 'Failed to update video in Notion' });
  }
});

// Notion API proxy - DELETE video
app.delete('/api/notion/videos', async (req, res) => {
  try {
    const NOTION_TOKEN = process.env.NOTION_API_KEY;

    if (!NOTION_TOKEN) {
      return res.status(500).json({ error: 'Notion API key not configured' });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Video ID required' });
    }

    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };

    console.log('🗑️ Archiving video in Notion...');

    const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ archived: true })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Notion delete error:', errorData);
      throw new Error(`Failed to archive page: ${response.status}`);
    }

    console.log('✅ Archived video in Notion');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Notion error:', error);
    res.status(500).json({ error: 'Failed to delete video in Notion' });
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