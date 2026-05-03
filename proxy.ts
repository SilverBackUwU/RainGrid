import { type NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_UNAUTHENTICATED_ROUTE,
  isAuthRoute,
  isProtectedRoute,
} from "@/lib/auth/routes";
import {
  copyResponseCookies,
  createProxyClient,
} from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { supabase, response } = await createProxyClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = DEFAULT_UNAUTHENTICATED_ROUTE;
    redirectUrl.searchParams.set(
      "redirectTo",
      `${pathname}${request.nextUrl.search}`,
    );

    return copyResponseCookies(response, NextResponse.redirect(redirectUrl));
  }

  if (user && isAuthRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = DEFAULT_AUTHENTICATED_ROUTE;
    redirectUrl.search = "";

    return copyResponseCookies(response, NextResponse.redirect(redirectUrl));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
