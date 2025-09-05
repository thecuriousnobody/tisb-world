export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simple authentication check
    const { authorization } = request.headers;
    const expectedAuth = `Bearer podcastbots2024`;
    
    if (authorization !== expectedAuth) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    // Get actual submitted feedback from global storage
    const actualFeedback = global.feedbackStore || [];
    
    // Add some mock data if no real feedback exists yet
    const mockFeedback = [
      {
        id: 'mock-1',
        timestamp: '2025-01-14T10:30:00Z',
        responses: [
          'Very useful! Would save me hours of manual research.',
          'Around $30-40 per month seems reasonable.',
          'Sometimes the guest suggestions were not in my exact niche.',
          'Better filtering by location and availability.',
          'Yes, definitely would recommend to other podcasters.'
        ],
        questions: [
          "How useful would an AI-powered tool be for finding podcast guests in your niche?",
          "What would you expect to pay monthly for this service?",
          "What was your biggest challenge or frustration with PodcastBots?",
          "What one feature would make this 10x better?",
          "Would you recommend this to a fellow podcaster?"
        ]
      }
    ];

    // Combine actual and mock feedback
    const allFeedback = [...actualFeedback, ...mockFeedback];
    
    return response.json({ 
      feedback: allFeedback,
      total: allFeedback.length,
      realSubmissions: actualFeedback.length
    });
    
  } catch (error) {
    console.error('Admin feedback error:', error);
    return response.status(500).json({ 
      error: 'Failed to retrieve feedback',
      status: 'error' 
    });
  }
}
