import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@360parminder/auth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
}

const SESSION_COOKIE_NAME = 'token';

/**
 * Gets the current authenticated user from request cookies (Server Components / Route Handlers)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  const result = await verifyToken(sessionCookie.value);
  if (!result.valid || !result.user) return null;
  
  return {
    id: result.user.id,
    name: result.user.name || '',
    email: result.user.email || '',
    username: result.user.username || '',
    avatar: result.user.avatar || '',
  };
}

/**
 * Validates a session token string (for middleware)
 */
export async function validateSession(tokenStr: string): Promise<AuthUser | null> {
  const result = await verifyToken(tokenStr);
  if (!result.valid || !result.user) return null;
  
  return {
    id: result.user.id,
    name: result.user.name || '',
    email: result.user.email || '',
    username: result.user.username || '',
    avatar: result.user.avatar || '',
  };
}
