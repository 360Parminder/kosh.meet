import { NextRequest, NextResponse } from 'next/server';
import { AuthUser, DEMO_USER, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, username, password } = body;

    const identifier = (email || username || '').trim();

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'Email or username is required' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Determine user profile
    let user: AuthUser;

    if (
      identifier.toLowerCase() === 'parminder@kosh.com' ||
      identifier.toLowerCase() === 'parminder'
    ) {
      user = DEMO_USER;
    } else {
      const parts = identifier.split('@');
      const uname = parts[0];
      const name = uname
        .split(/[._-]/)
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');

      user = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        name: name || 'Google User',
        email: identifier.includes('@') ? identifier : `${uname}@kosh.com`,
        username: uname,
        avatar: DEMO_USER.avatar,
      };
    }

    const res = NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
    });

    setSessionCookie(res, user);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
