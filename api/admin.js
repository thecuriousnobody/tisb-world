export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Add basic authentication for admin access
    const authHeader = request.headers.authorization;
    const expectedAuth = `Basic ${Buffer.from('admin:' + (process.env.ADMIN_PASSWORD || 'password123')).toString('base64')}`;
    
    if (!authHeader || authHeader !== expectedAuth) {
      response.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
      return response.status(401).json({ error: 'Unauthorized' });
    }

    // Option 1: File-based feedback (for development)
    const fs = require('fs');
    const path = require('path');
    const feedbackDir = path.join(process.cwd(), 'feedback-data');
    
    let feedbackList = [];
    
    if (fs.existsSync(feedbackDir)) {
      const files = fs.readdirSync(feedbackDir).filter(file => file.endsWith('.json'));
      feedbackList = files.map(file => {
        const filePath = path.join(feedbackDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Option 2: Vercel KV (Redis) - Uncomment when using KV
    /*
    const { kv } = require('@vercel/kv');
    const feedbackIds = await kv.lrange('feedback:list', 0, -1);
    const feedbackList = await Promise.all(
      feedbackIds.map(id => kv.get(`feedback:${id}`))
    );
    */

    // Return HTML admin interface
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Beta Feedback Admin</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 20px; }
            .feedback-item { border: 1px solid #ddd; margin: 20px 0; padding: 20px; border-radius: 8px; }
            .timestamp { color: #666; font-size: 14px; }
            .question { font-weight: bold; margin-top: 15px; }
            .response { margin: 5px 0 15px 20px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
            .stats { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>PodcastBots.ai Beta Feedback</h1>
          <div class="stats">
            <h3>Statistics</h3>
            <p><strong>Total Responses:</strong> ${feedbackList.length}</p>
            <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          ${feedbackList.length === 0 ? 
            '<p>No feedback submitted yet.</p>' : 
            feedbackList.map(feedback => `
              <div class="feedback-item">
                <div class="timestamp">Submitted: ${new Date(feedback.timestamp).toLocaleString()}</div>
                ${feedback.responses.map((response, index) => `
                  <div class="question">Q${index + 1}: ${feedback.questions[index]}</div>
                  <div class="response">${response}</div>
                `).join('')}
              </div>
            `).join('')
          }
        </body>
      </html>
    `;

    response.setHeader('Content-Type', 'text/html');
    return response.send(html);
    
  } catch (error) {
    console.error('Admin access error:', error);
    return response.status(500).json({ 
      error: 'Failed to load feedback data',
      status: 'error' 
    });
  }
}
