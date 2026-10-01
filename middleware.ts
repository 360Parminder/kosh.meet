import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// We can't import verifyToken directly in middleware due to Prisma/Node.js dependencies
// (Next.js middleware runs on Edge runtime), so we just check for cookie presence 
// and do full validation in Route Handlers / Server Components.
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const path = request.nextUrl.pathname;

  // Skip static files and api routes
  if (
    path.startsWith('/_next') || 
    path.startsWith('/api') || 
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // If user is already logged in and visits the home page, redirect to dashboard
  if (path === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Define protected routes pattern if needed. Here we assume /rooms/ is protected.
  if (path.startsWith('/rooms') && !token) {
    // Redirect to kosh login or return 401
    const loginUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/login' 
      : 'https://kosh.uno/login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }
  
  return NextResponse.next();
}
