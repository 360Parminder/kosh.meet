import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
}

export const DEMO_USER: AuthUser = {
  id: 'usr_parminder_1',
  name: 'Parminder Singh',
  email: 'parminder@kosh.com',
  username: 'parminder',
  avatar: 'https://res.cloudinary.com/dvo4tvvgb/image/upload/v1737770516/Profile/image.jpg',
};

const SESSION_COOKIE_NAME = 'kosh_meet_session';

/**
 * Encodes a user object into a base64 session token
 */
export function encodeSession(user: AuthUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Decodes and validates a session token
 */
export function decodeSession(token: string): AuthUser | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.exp && parsed.exp < Date.now()) {
      return null;
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      username: parsed.username,
      avatar: parsed.avatar,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Gets the current authenticated user from request cookies (Server Components / Route Handlers)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  return decodeSession(sessionCookie.value);
}

/**
 * Sets the session cookie on a NextResponse
 */
export function setSessionCookie(response: NextResponse, user: AuthUser): void {
  const token = encodeSession(user);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clears the session cookie on a NextResponse
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
}
