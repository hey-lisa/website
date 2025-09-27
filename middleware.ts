import { NextRequest, NextResponse } from "next/server";
import { getLocale, pathnameHasLocale } from "./lib/locale";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Skip system paths and static files
    if (
        pathname.startsWith('/.well-known') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') || // Any file extension
        pathname === '/favicon.ico'
    ) {
        return;
    }
    
    const hasLocale = pathnameHasLocale(pathname);
    if (hasLocale) return;

    // Redirect if there is no locale
    const locale = getLocale(pathname);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // incoming request is /docs/get-started
    // The new URL is now /en/docs/get-started
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Only run on actual page routes, exclude everything else
        "/((?!api|_next/static|_next/image|favicon.ico|\\.well-known).*)",
    ],
};
