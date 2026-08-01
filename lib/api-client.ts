import { cookies } from "next/headers";
import { getApiBaseUrl } from "./auth";

/**
 * A production-grade, self-healing fetch client that works on both client and server sides.
 * On the server side (RSC / Server Actions), it automatically injects the Authorization Bearer header
 * from cookies, handles 401 Unauthorized responses by fetching a refreshed token, updates cookies,
 * and retries the original request.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const headers = new Headers(options.headers);
  const isServer = typeof window === "undefined";

  if (isServer) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value;
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (e: any) {
      if (
        e?.digest === "DYNAMIC_SERVER_USAGE" ||
        e?.message?.includes("Dynamic server usage")
      ) {
        throw e;
      }
      console.warn("Failed to inject access token on server fetch:", e);
    }
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(url, { ...options, headers });

  // Handle 401 unauthorized on the server side by attempting token refresh
  if (response.status === 401 && isServer) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refreshToken")?.value;

      if (refreshToken) {
        const refreshResponse = await fetch(
          `${baseUrl}/api/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `refreshToken=${refreshToken}`,
            },
            body: JSON.stringify({ refreshToken }),
          },
        );

        if (refreshResponse.ok) {
          const payload = await refreshResponse.json().catch(() => ({}));
          const newAccessToken = payload?.data?.accessToken;
          const newRefreshToken = payload?.data?.refreshToken;

          if (newAccessToken) {
            try {
              // Store new tokens in cookies. This works in Server Actions & Route Handlers.
              // In RSC render phase, cookieStore.set will throw an error, which we catch.
              cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });

              if (newRefreshToken) {
                cookieStore.set("refreshToken", newRefreshToken, {
                  httpOnly: true,
                  path: "/",
                  sameSite: "lax",
                  secure: process.env.NODE_ENV === "production",
                });
              }
            } catch {
              // Ignore cookie-writing errors during RSC render phases (middleware handles it)
            }

            // Retry the original request with the fresh token
            headers.set("Authorization", `Bearer ${newAccessToken}`);
            response = await fetch(url, { ...options, headers });
          }
        }
      }
    } catch (error: any) {
      if (
        error?.digest === "DYNAMIC_SERVER_USAGE" ||
        error?.message?.includes("Dynamic server usage")
      ) {
        throw error;
      }
      console.error("Token refresh failed in apiFetch:", error);
    }
  }

  return response;
}
