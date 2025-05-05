import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware just passes the request through
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Match all routes (optional, to be explicit)
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
