// Simple in-memory storage for demo purposes
// In production, use a proper database
let feedbackStore = [];

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { responses } = request.body;
    
    if (!responses || !Array.isArray(responses)) {
      return response.status(400).json({ error: 'Invalid responses data' });
    }

    const feedbackEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      responses,
      questions: [
        "How useful would an AI-powered tool be for finding podcast guests in your niche?",
        "What would you expect to pay monthly for this service?",
        "What was your biggest challenge or frustration with PodcastBots?",
        "What one feature would make this 10x better?",
        "Would you recommend this to a fellow podcaster?"
      ]
    };

    // Store in memory for demo
    feedbackStore.push(feedbackEntry);

    // Also store globally so admin endpoint can access it
    if (!global.feedbackStore) {
      global.feedbackStore = [];
    }
    global.feedbackStore.push(feedbackEntry);

    // Log for debugging
    console.log('New feedback submitted:', {
      id: feedbackEntry.id,
      timestamp: feedbackEntry.timestamp,
      responseCount: responses.length
    });
    
    return response.json({ 
      status: 'success',
      message: 'Feedback submitted successfully',
      id: feedbackEntry.id
    });
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    return response.status(500).json({ 
      error: 'Failed to submit feedback',
      status: 'error' 
    });
  }
}
