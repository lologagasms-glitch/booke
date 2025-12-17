"use server"
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";

type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    banned: boolean | null | undefined;
    role?: string | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
    isAnonymous?: boolean | null | undefined;
} | undefined

const PUBLIC_ROUTES = ["/", "/auth/signin", "/auth/signup"];
const PROTECTED_ROUTES = ["/profile", "/dashboard"];
const ADMIN_ROUTES = ["/admin"];

const DEFAULT_LOCALE = "en";

function extractLocale(pathname: string): string {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  return maybeLocale?.match(/^[a-z]{2}$/) ? maybeLocale : DEFAULT_LOCALE;
}

function isRouteMatch(routes: string[], pathname: string): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

function isProtectedRoute(pathname: string): boolean {
  return isRouteMatch(PROTECTED_ROUTES, pathname);
}

function isAdminRoute(pathname: string): boolean {
  return isRouteMatch(ADMIN_ROUTES, pathname);
}

function redirectTo(locale: string, path: string, req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${path}`;
  return NextResponse.redirect(url);
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes("favicon")) {
    return NextResponse.next();
  }

  const locale = extractLocale(pathname);
  const sessionCookie = getSessionCookie(req);

  let user: User | null = null;
  let isAdminUser = false;

 


 

  if (pathname === "/" || pathname === `/${locale}/dashboard`) {
    return redirectTo(locale, "", req);
  }

 

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};