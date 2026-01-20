import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDailyUsage } from '@/lib/db';

const DAILY_LIMIT = 100000;

export async function GET() {
  try {
    // Check auth
    const cookieStore = await cookies();
    const auth = cookieStore.get('tisb_auth');
    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usage = await getDailyUsage();

    return NextResponse.json({
      success: true,
      usage,
      limit: DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - usage),
      percentUsed: Math.round((usage / DAILY_LIMIT) * 100),
    });
  } catch (error) {
    console.error('Usage error:', error);
    return NextResponse.json(
      { error: 'Failed to get usage', details: String(error) },
      { status: 500 }
    );
  }
}
