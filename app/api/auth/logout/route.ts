import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
  clearSessionCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  clearSessionCookie(res);
  return res;
}
