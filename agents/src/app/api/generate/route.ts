import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateContent, AgentType } from '@/lib/agents';
import { trackTokenUsage, getDailyUsage, saveAgentOutput } from '@/lib/db';
import crypto from 'crypto';

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

    const { type, transcript, guestName, title } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    if (!['titles', 'description', 'transitions', 'all'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be titles, description, transitions, or all' },
        { status: 400 }
      );
    }

    // Generate content
    const result = await generateContent(
      type as AgentType,
      transcript,
      guestName,
      title
    );

    // Track usage
    await trackTokenUsage(result.tokensUsed, `/api/generate/${type}`);

    // Save output for future training
    const inputHash = crypto
      .createHash('sha256')
      .update(transcript.substring(0, 1000))
      .digest('hex')
      .substring(0, 64);

    await saveAgentOutput(type, inputHash, {
      titles: result.titles,
      description: result.description,
      transitions: result.transitions,
    });

    return NextResponse.json({
      success: true,
      outputs: {
        titles: result.titles,
        description: result.description,
        transitions: result.transitions,
      },
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
