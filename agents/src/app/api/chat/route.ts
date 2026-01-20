import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { chat } from '@/lib/agents';
import { trackTokenUsage, getDailyUsage } from '@/lib/db';

const DAILY_LIMIT = 100000;

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const cookieStore = await cookies();
    const auth = cookieStore.get('tisb_auth');
    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit
    const currentUsage = await getDailyUsage();
    if (currentUsage >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: 'Daily token limit exceeded. Try again tomorrow.' },
        { status: 429 }
      );
    }

    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!context?.transcript) {
      return NextResponse.json(
        { error: 'Context with transcript is required' },
        { status: 400 }
      );
    }

    // Chat with agent
    const result = await chat(message, {
      transcript: context.transcript,
      previousOutputs: context.previousOutputs || {},
      conversationHistory: context.conversationHistory || [],
    });

    // Track usage
    await trackTokenUsage(result.tokensUsed, '/api/chat');

    return NextResponse.json({
      success: true,
      response: result.response,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Chat failed', details: String(error) },
      { status: 500 }
    );
  }
}
