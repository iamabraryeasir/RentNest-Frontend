import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "./auth";

/**
 * Edge-compatible JWT parser to check if a token has expired or is close to expiration.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    const exp = payload.exp;
    if (!exp) return true;

    // Buffer of 30 seconds before actual expiration
    return Date.now() >= exp * 1000 - 30000;
  } catch {
    return true;
  }
}

/**
 * Edge-compatible JWT parser to extract user role from the payload.
 */
export function parseTokenRole(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.role ? String(payload.role).toLowerCase() : null;
  } catch {
    return null;
  }
}

/**
 * Fetch a new access token from the backend using a refresh token.
 */
export async function refreshTokenRequest(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken?: string } | null> {
  const baseUrl = getApiBaseUrl() || "http://localhost:5000";
  try {
    const response = await fetch(`${baseUrl}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `refreshToken=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const payload = await response.json().catch(() => ({}));
      const accessToken = payload?.data?.accessToken;
      const newRefreshToken = payload?.data?.refreshToken;
      if (accessToken) {
        return { accessToken, refreshToken: newRefreshToken };
      }
    }
  } catch (error) {
    console.error("Auth helper failed to refresh token request:", error);
  }
  return null;
}

/**
 * Syncs the newly generated authentication tokens across response cookies and 
 * request headers to keep Server Components and the browser in sync.
 */
export function syncAuthCookies(
  response: NextResponse,
  request: NextRequest,
  accessToken: string,
  refreshToken: string | undefined,
  role: string
): NextResponse {
  const secure = process.env.NODE_ENV === "production";

  // 1. Set cookies on response
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24, // 1 day
  });

  if (refreshToken) {
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  if (role) {
    response.cookies.set("role", role, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  // 2. Parse and preserve other cookies in the request header
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieMap = new Map<string, string>();
  cookieHeader.split(";").forEach((c) => {
    const parts = c.trim().split("=");
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parts.slice(1).join("=").trim();
      cookieMap.set(name, value);
    }
  });

  // 3. Update the auth cookies
  cookieMap.set("accessToken", accessToken);
  if (refreshToken) {
    cookieMap.set("refreshToken", refreshToken);
  }
  if (role) {
    cookieMap.set("role", role);
  }

  // 4. Serialize back to cookie header format
  const newCookieHeader = Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  // 5. Construct a new next response with updated request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("cookie", newCookieHeader);

  const responseWithHeaders = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 6. Copy updated cookies from original response
  responseWithHeaders.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: 60 * 60 * 24, // 1 day
  });

  if (refreshToken) {
    responseWithHeaders.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  if (role) {
    responseWithHeaders.cookies.set("role", role, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return responseWithHeaders;
}
