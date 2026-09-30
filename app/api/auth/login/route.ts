import { NextRequest, NextResponse } from 'next/server';
import { AuthUser, setSessionCookie } from '@/lib/auth';
import { prisma } from '@360parminder/db';
import bcrypt from 'bcryptjs';

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

    // Fetch user from DB
    const dbUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, dbUser.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (dbUser.is_banned) {
      return NextResponse.json(
        { success: false, error: 'This account has been banned' },
        { status: 403 }
      );
    }

    // Create session user object
    const user: AuthUser = {
      id: dbUser.id,
      name: dbUser.name || dbUser.username,
      email: dbUser.email || `${dbUser.username}@kosh.com`,
      username: dbUser.username,
      avatar: dbUser.avatar || 'https://res.cloudinary.com/dvo4tvvgb/image/upload/v1737770516/Profile/image.jpg',
    };

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
