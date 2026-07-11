import { NextRequest, NextResponse } from 'next/server';
import { updateSession, getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Update session expiration if present
  const res = await updateSession(request);
  
  const session = await getSession();

  // Protect writer dashboard and API routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api/posts/create')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Any logged in user can access dashboard
  }

  // Auto logic: Redirect logged in users away from auth pages
  if (['/login', '/register'].includes(request.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard/writer', request.url));
    }
  }

  return res || NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/posts/:path*', '/login', '/register'],
};
