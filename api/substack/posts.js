// Vercel Serverless Function for Substack RSS
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
    console.log('📡 Fetching Substack posts via RSS...');
    const feedUrl = 'https://thecuriousnobody.substack.com/feed';
    
    const response = await fetch(feedUrl);
    
    if (!response.ok) {
      throw new Error(`RSS fetch error: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log('✅ Fetched Substack RSS feed');
    
    // Send the raw XML - the frontend will parse it
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xmlText);
  } catch (error) {
    console.error('❌ Substack RSS error:', error);
    res.status(500).json({ error: 'Failed to fetch Substack posts' });
  }
}