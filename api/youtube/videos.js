// Vercel Serverless Function for YouTube API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
    
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ YouTube error:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
}