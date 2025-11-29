import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./app/lib/auth";

export async function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const url = request.nextUrl.clone();
	const locale = url.pathname.split("/")[1];
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	const isAdminRoute = url.pathname.includes("/admin");
	const isAuthRoute = url.pathname.includes("/auth") ;
	const isProfileRoute = url.pathname.includes("/profile");
	const isDashboard = url.pathname.includes("/dashboard");
	const isBaseRoute=url.pathname==="/"
	// 1. Admin Routes Protection
	if (isAdminRoute) {
		if (!session?.user) {
			url.pathname = `/${locale}/auth/signin`;
			return NextResponse.redirect(url);
		}

		// Fetch session only if we have a cookie and are accessing admin area

		if (session?.user?.role !== "admin") {
			
			url.pathname = `/${locale}/profile`;
			return NextResponse.redirect(url);
		}
		return NextResponse.next();
	}

	// 2. Auth Routes (Redirect logged-in users away)
	if (isAuthRoute && session?.user) {
		url.pathname = `/${locale}/profile`;
		return NextResponse.redirect(url);
	}
	// Redirect root and /dashboard to localized home
	if (isBaseRoute || isDashboard) {
		url.pathname = `/en`;
		return NextResponse.redirect(url);
	}
	
	// 3. Profile Route Protection (Optional: Redirect guests to signin)
	// The original code redirected logged-in users AWAY from profile, which was likely a bug.
	// Now we ensure guests are redirected to signin if they try to access profile.
	if (isProfileRoute && !sessionCookie) {
		url.pathname = `/${locale}/auth/signin`;
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
