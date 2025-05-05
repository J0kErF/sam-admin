import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// Define public (unauthenticated) routes
const isPublicRoute = createRouteMatcher([
  '/api(.*)',          // ✅ Allow all API routes
  '/sign-in(.*)',      // ✅ Allow sign-in
  '/sign-up(.*)',      // ✅ Allow sign-up
]);

// ✅ Correct usage: auth is passed in by clerkMiddleware
export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // 🔐 Protect non-API routes
  }
});

// ✅ Match all routes except static assets
export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|js|css|woff2?|ttf|map)).*)',
  ],
};
