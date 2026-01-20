import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logSelection } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const cookieStore = await cookies();
    const auth = cookieStore.get('tisb_auth');
    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { outputId, agentType, selectedOption, finalText } = await request.json();

    if (!outputId || !agentType || selectedOption === undefined || !finalText) {
      return NextResponse.json(
        { error: 'Missing required fields: outputId, agentType, selectedOption, finalText' },
        { status: 400 }
      );
    }

    await logSelection(outputId, agentType, selectedOption, finalText);

    return NextResponse.json({
      success: true,
      message: 'Selection logged successfully',
    });
  } catch (error) {
    console.error('Select error:', error);
    return NextResponse.json(
      { error: 'Failed to log selection', details: String(error) },
      { status: 500 }
    );
  }
}
