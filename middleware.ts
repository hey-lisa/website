import { NextRequest, NextResponse } from "next/server";
import { getLocale, pathnameHasLocale } from "./lib/locale";

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;
    
    // Skip static files (images, favicon, etc.)
    if (
        pathname.includes('.')  // has file extension
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
        // Skip all internal paths (_next) and static files (images, etc.)
        "/((?!_next|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js)).*)",
    ],
};
