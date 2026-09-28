import { verifyEditor } from '../dropzone/_lib/auth.js';

/*
 * Video Production Tracker backend. Every method requires a Google sign-in
 * from someone on the editor allow-list — this endpoint used to be fully
 * public (anyone could read, edit or archive rows). Same-origin only: no
 * CORS headers, since only tisb.world's own /admin UI calls it.
 */
export default async function handler(req, res) {
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const editor = await verifyEditor(req, res);
  if (!editor) return; // verifyEditor already sent 401/403

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


  const normalize = (id) => String(id || '').replace(/-/g, '').toLowerCase();
  const belongsToTracker = async (id) => {
    if (!/^[0-9a-f-]{32,36}$/i.test(String(id || ''))) return false;
    const r = await fetch(`https://api.notion.com/v1/pages/${id}`, { headers });
    if (!r.ok) return false;
    const page = await r.json();
    return normalize(page.parent?.database_id) === normalize(DATABASE_ID);
  };

  try {
    if (req.method === 'GET') {
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
          'In Process': 'in_progress',
          'Completed': 'done'
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

    } else if (req.method === 'POST') {
      console.log('📝 Creating new video in Notion...');
      const { title, riversideLink, status, sentiment, notes } = req.body;

      const statusMap = {
        'not_started': 'Not Started',
        'in_progress': 'In Process',
        'done': 'Completed'
      };

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

    } else if (req.method === 'PATCH') {
      console.log('✏️ Updating video in Notion...');
      const { id, title, riversideLink, status, sentiment, notes } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Video ID required' });
      }
      if (!(await belongsToTracker(id))) {
        return res.status(403).json({ error: 'That page is not part of the video tracker.' });
      }

      const statusMap = {
        'not_started': 'Not Started',
        'in_progress': 'In Process',
        'done': 'Completed'
      };

      const properties = {};
      if (title !== undefined) properties.Title = { title: [{ text: { content: title } }] };
      if (riversideLink !== undefined) properties['Video Link'] = { url: riversideLink || null };
      if (status !== undefined) properties.Status = { status: { name: statusMap[status] || 'Not Started' } };
      if (sentiment !== undefined) properties.Sentiment = { rich_text: sentiment ? [{ text: { content: sentiment } }] : [] };
      if (notes !== undefined) properties.Comments = { rich_text: notes ? [{ text: { content: notes } }] : [] };

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

    } else if (req.method === 'DELETE') {
      console.log('🗑️ Archiving video in Notion...');
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Video ID required' });
      }
      if (!(await belongsToTracker(id))) {
        return res.status(403).json({ error: 'That page is not part of the video tracker.' });
      }

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

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('❌ Notion API error:', error);
    res.status(500).json({ error: error.message || 'Failed to interact with Notion' });
  }
}
