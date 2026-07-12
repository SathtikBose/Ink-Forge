import { NextRequest, NextResponse } from 'next/server';
import { updateSession, getSession } from '@/lib/auth';

// --- In-Memory Rate Limiter ---
// Note: In a true multi-server production environment (like serverless functions), 
// an external store like Redis is recommended. For a single instance/Render, 
// this in-memory Map works perfectly to prevent basic token exhaustion.

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_GENERAL_REQUESTS = 30; // 30 requests per minute for standard APIs
const MAX_AI_REQUESTS = 5; // 5 requests per minute for AI (Post creation / Comments)

interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

function checkRateLimit(ip: string, maxRequests: number): boolean {
  const now = Date.now();
  const windowData = rateLimitMap.get(ip);
  
  if (!windowData || now > windowData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (windowData.count >= maxRequests) {
    return false;
  }
  
  windowData.count += 1;
  return true;
}

export async function proxy(request: NextRequest) {
  // 1. Rate Limiting Check
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    
    // Stricter rate limits for endpoints that consume AI Tokens
    const isAiEndpoint = request.nextUrl.pathname === '/api/posts' && request.method === 'POST' || 
                         request.nextUrl.pathname === '/api/comments' && request.method === 'POST';
    
    const maxAllowed = isAiEndpoint ? MAX_AI_REQUESTS : MAX_GENERAL_REQUESTS;
    
    if (!checkRateLimit(`${ip}-${isAiEndpoint ? 'AI' : 'GEN'}`, maxAllowed)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' }, 
        { status: 429 }
      );
    }
  }

  // 2. Session Update
  const res = await updateSession(request);
  const session = await getSession();

  // 3. Protect writer dashboard and creation routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api/posts/create')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. Auto logic: Redirect logged-in users away from auth pages
  if (['/login', '/register'].includes(request.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard/writer', request.url));
    }
  }

  return res || NextResponse.next();
}

export const config = {
  // Apply middleware to APIs and pages that need protection/auth routing
  matcher: ['/api/:path*', '/dashboard/:path*', '/login', '/register'],
};
