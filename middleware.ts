
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // --- Security Headers ---

    // Prevent sensitive information from being cached
    // response.headers.set('Cache-Control', 'no-store'); // Too aggressive for static assets?

    // HSTS (HTTP Strict Transport Security) - Force HTTPS
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    // X-Frame-Options - Prevent Clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // X-Content-Type-Options - Prevent MIME Sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer-Policy - Control information sent to other sites
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions-Policy - Limit browser features
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
