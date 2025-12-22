"use server"
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";

const DEFAULT_LOCALE = "en";

function extractLocale(pathname: string): string {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  return maybeLocale?.match(/^[a-z]{2}$/) ? maybeLocale : DEFAULT_LOCALE;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname;

  // Ignorer les routes système
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes("favicon")) {
    return NextResponse.next();
  }

  const locale = extractLocale(pathname);
  const sessionCookie = getSessionCookie(req);

  // 🚨 BLOQUER l'accès direct à /${locale}/dashboard
  if (pathname === `/${locale}/dashboard`) {
    // Rediriger vers la page d'accueil /${locale}
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // 🚨 S'assurer que la page d'accueil est bien /${locale}
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // 🚨 Logique d'authentification (exemple)
  if (!sessionCookie && (pathname.includes("/profile") || pathname.includes("/admin"))) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/auth/signin`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};