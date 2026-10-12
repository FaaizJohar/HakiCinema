import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin Routes at the Edge
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value;

    // If no session cookie is present, redirect to the login page immediately
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Full validation (Firebase token verification and role check) 
    // happens securely in the /admin layout Server Component since 
    // Firebase Admin SDK doesn't run on the Edge runtime.
  }

  return NextResponse.next();
}

// Only run middleware on admin routes to optimize performance
export const config = {
  matcher: ['/admin/:path*'],
};
