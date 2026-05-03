export const AUTH_ROUTES = ["/login", "/signup"] as const;

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/calculator",
  "/marketplace",
  "/profile",
  "/listings",
] as const;

export const DEFAULT_AUTHENTICATED_ROUTE = "/dashboard";
export const DEFAULT_UNAUTHENTICATED_ROUTE = "/login";

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname === route);
}

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function getSafeRedirectPath(value: FormDataEntryValue | string | null) {
  if (typeof value !== "string") {
    return DEFAULT_AUTHENTICATED_ROUTE;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTHENTICATED_ROUTE;
  }

  if (isAuthRoute(value)) {
    return DEFAULT_AUTHENTICATED_ROUTE;
  }

  return isProtectedRoute(value) ? value : DEFAULT_AUTHENTICATED_ROUTE;
}
