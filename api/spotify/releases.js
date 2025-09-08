// Vercel Serverless Function for Spotify API
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
    
    res.status(200).json(albumsData);
  } catch (error) {
    console.error('❌ Spotify error:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify releases' });
  }
}