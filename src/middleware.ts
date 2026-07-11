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
    
    if (request.nextUrl.pathname.startsWith('/dashboard/writer') && session.role !== 'WRITER') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return res || NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/posts/:path*'],
};
