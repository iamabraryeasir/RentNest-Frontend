import {
  isTokenExpired,
  parseTokenRole,
  refreshTokenRequest,
  syncAuthCookies,
} from "./lib/auth-helper";
import { NextRequest, NextResponse } from "next/server";

const roleDashboards: Record<string, string> = {
  tenant: "/dashboard/tenant",
  landlord: "/dashboard/landlord",
  admin: "/dashboard/admin",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth cookies
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  let role = request.cookies.get("role")?.value;

  const isAuthRoute = pathname.startsWith("/auth/");
  const isDashboardRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/payment");

  let refreshed = false;
  let newAccessToken = "";
  let newRefreshToken = "";

  // 1. Check token status & Refresh if needed
  if (refreshToken && (!accessToken || isTokenExpired(accessToken))) {
    const refreshData = await refreshTokenRequest(refreshToken);

    if (refreshData?.accessToken) {
      accessToken = refreshData.accessToken;
      role = parseTokenRole(refreshData.accessToken) || role;
      newAccessToken = refreshData.accessToken;
      newRefreshToken = refreshData.refreshToken || "";
      refreshed = true;
    } else if (isDashboardRoute) {
      // If refresh fails on a protected route, clear cookies and redirect to login
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url),
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      response.cookies.delete("role");
      return response;
    }
  }

  // 2. Perform Routing Protection
  if (isDashboardRoute) {
    if (!accessToken) {
      // Redirect to login page and keep track of original destination
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      return response;
    }

    // Role subpath protection (e.g. /dashboard/tenant/...)
    if (pathname.startsWith("/dashboard/tenant") && role !== "tenant") {
      const redirectUrl = new URL(
        roleDashboards[role || ""] || "/dashboard",
        request.url,
      );
      redirectUrl.searchParams.set(
        "toast",
        `You do not have access to the tenant dashboard. You were redirected to your own dashboard.`,
      );
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith("/dashboard/landlord") && role !== "landlord") {
      const redirectUrl = new URL(
        roleDashboards[role || ""] || "/dashboard",
        request.url,
      );
      redirectUrl.searchParams.set(
        "toast",
        `You do not have access to the landlord dashboard. You were redirected to your own dashboard.`,
      );
      return NextResponse.redirect(redirectUrl);
    }
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      const redirectUrl = new URL(
        roleDashboards[role || ""] || "/dashboard",
        request.url,
      );
      redirectUrl.searchParams.set(
        "toast",
        `You do not have access to the admin dashboard. You were redirected to your own dashboard.`,
      );
      return NextResponse.redirect(redirectUrl);
    }

    // Root /dashboard path handling
    if (pathname === "/dashboard") {
      const destination = roleDashboards[role || ""] || "/auth/login";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  if (isAuthRoute) {
    // If user is already authenticated, redirect away from guest-only auth pages
    if (accessToken && role) {
      const destination = roleDashboards[role] || "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // 3. Construct response and sync updated cookies
  if (refreshed && newAccessToken) {
    return syncAuthCookies(
      request,
      newAccessToken,
      newRefreshToken,
      role || "",
    );
  }

  return NextResponse.next();
}
