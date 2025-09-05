export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simple authentication - you can replace this with proper auth
    const authKey = request.query.key;
    if (authKey !== process.env.ADMIN_KEY && authKey !== 'dev-key-123') {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    // Option 1: Vercel KV (Redis)
    /* 
    const { kv } = require('@vercel/kv');
    const feedbackIds = await kv.lrange('feedback:list', 0, -1);
    const feedbackEntries = await Promise.all(
      feedbackIds.map(id => kv.get(`feedback:${id}`))
    );
    */

    // Option 2: File system (for development)
    const fs = require('fs');
    const path = require('path');
    const feedbackDir = path.join(process.cwd(), 'feedback-data');
    
    let feedbackEntries = [];
    
    if (fs.existsSync(feedbackDir)) {
      const files = fs.readdirSync(feedbackDir);
      feedbackEntries = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const content = fs.readFileSync(path.join(feedbackDir, file), 'utf8');
          return JSON.parse(content);
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Return HTML dashboard for easy viewing
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PodcastBots.ai Beta Feedback Dashboard</title>
      <style>
        body { font-family: 'Space Grotesk', Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #333; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .feedback-item { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .timestamp { color: #666; font-size: 14px; margin-bottom: 15px; }
        .question { font-weight: bold; color: #333; margin-top: 15px; margin-bottom: 5px; }
        .response { background: #f9f9f9; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2em; font-weight: bold; color: #4caf50; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎙️ PodcastBots.ai Beta Feedback Dashboard</h1>
          <p>Real-time feedback from beta testers</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${feedbackEntries.length}</div>
            <div>Total Responses</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${feedbackEntries.filter(f => f.responses.length === 5).length}</div>
            <div>Complete Sessions</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${feedbackEntries.length > 0 ? Math.round(feedbackEntries.reduce((acc, f) => acc + f.responses.length, 0) / feedbackEntries.length) : 0}</div>
            <div>Avg Questions Answered</div>
          </div>
        </div>

        ${feedbackEntries.map((entry, index) => `
          <div class="feedback-item">
            <div class="timestamp">
              <strong>Feedback #${index + 1}</strong> - ${new Date(entry.timestamp).toLocaleString()}
            </div>
            ${entry.responses.map((response, qIndex) => 
              response ? `
                <div class="question">Q${qIndex + 1}: ${entry.questions[qIndex]}</div>
                <div class="response">${response}</div>
              ` : ''
            ).join('')}
          </div>
        `).join('')}
        
        ${feedbackEntries.length === 0 ? '<div class="feedback-item"><p>No feedback received yet.</p></div>' : ''}
      </div>
    </body>
    </html>
    `;

    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(html);
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return response.status(500).json({ 
      error: 'Failed to fetch feedback',
      status: 'error' 
    });
  }
}
