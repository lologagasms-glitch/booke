import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./app/lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const session = await auth.api.getSession({
        headers: await headers()
    })
	const url = request.nextUrl.clone();
	const locale = url.pathname.split("/")[1];
	

	const isAdminRoute = url.pathname.includes("/admin"); ;
	const isProfileRoute = url.pathname.includes("/profile");
	const isDashboard = url.pathname.includes("/dashboard");
	const isBaseRoute=url.pathname==="/"
	// 1. Admin Routes Protection
	if (isAdminRoute) {
		if (!session || !session.user || session.user.role?.toLowerCase() !== 'admin') {
			url.pathname = `/${locale}/auth/signin`;
			return NextResponse.redirect(url);
		}
		if (session.user.role?.toLowerCase() !== 'admin') {
			url.pathname = `/${locale}`;
			return NextResponse.redirect(url);
		}
		
		return NextResponse.next();
	}
	


	// Redirect root and /dashboard to localized home
	if (isBaseRoute || isDashboard) {
		url.pathname = `/en`;
		return NextResponse.redirect(url);
	}
	
	if (isProfileRoute && !sessionCookie) {
		url.pathname = `/${locale}/auth/signin`;
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
