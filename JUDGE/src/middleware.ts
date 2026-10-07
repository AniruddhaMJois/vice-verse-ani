import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public login pages and assets pass freely
  if (
    pathname === "/" ||
    pathname.startsWith("/judge/login") ||
    pathname.startsWith("/mentor/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check auth session cookie
  const authCookie = request.cookies.get("viceverse_auth_profile");
  let userProfile: { role?: string; loginId?: string } | null = null;

  if (authCookie?.value) {
    try {
      userProfile = JSON.parse(decodeURIComponent(authCookie.value));
    } catch {}
  }

  // Judge protected route checks
  if (pathname.startsWith("/judge")) {
    if (userProfile && userProfile.role === "mentor") {
      // Mentor trying to access judge routes -> redirect to mentor dashboard
      return NextResponse.redirect(new URL("/mentor/dashboard", request.url));
    }
  }

  // Mentor protected route checks
  if (pathname.startsWith("/mentor")) {
    if (userProfile && userProfile.role === "judge") {
      // Judge trying to access mentor routes -> redirect to judge dashboard
      return NextResponse.redirect(new URL("/judge/dashboard", request.url));
    }
  }

  // Set Cache-Control: no-store on authenticated portal pages to prevent back-button caching
  const response = NextResponse.next();
  if (pathname.startsWith("/judge") || pathname.startsWith("/mentor")) {
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: ["/judge/:path*", "/mentor/:path*"],
};
