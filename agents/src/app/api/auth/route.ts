import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!process.env.APP_PASSWORD) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 500 }
      );
    }

    if (password === process.env.APP_PASSWORD) {
      // Set auth cookie
      const cookieStore = await cookies();
      cookieStore.set('tisb_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Logout - clear cookie
  const cookieStore = await cookies();
  cookieStore.delete('tisb_auth');
  return NextResponse.json({ success: true });
}
