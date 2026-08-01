"use server";

import { getApiBaseUrl, getAuthenticatedUserData } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginState = {
  success: boolean;
  message: string;
  redirectTo?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function loginAction(
  _prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  const baseUrl = getApiBaseUrl();
  let role: string | undefined;

  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));
    const payloadData = payload?.data;

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message || payload?.error || "Invalid email or password.",
      };
    }

    const accessToken = payloadData?.accessToken;
    const refreshToken = payloadData?.refreshToken;

    if (!accessToken) {
      return {
        success: false,
        message: "The server did not return an access token.",
      };
    }

    const user = getAuthenticatedUserData(accessToken);
    role = user?.role?.toLowerCase();

    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });

    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    if (!role || !["tenant", "landlord", "admin"].includes(role)) {
      return {
        success: false,
        message: "The server returned an unsupported user role.",
      };
    }

    return {
      success: true,
      message: "Login successful",
      redirectTo: `/dashboard/${role}`,
    };
  } catch (error) {
    return {
      success: false,
      message:
        `Unable to reach the authentication server. ${error instanceof Error ? error.message : ""}`.trim(),
    };
  }
}
