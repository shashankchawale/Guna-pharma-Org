import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow requests to pass to Next.js page components where client-side and server-side RBAC guards verify the session
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
