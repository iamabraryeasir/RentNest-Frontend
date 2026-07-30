"use server";

import { getApiBaseUrl } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["TENANT", "LANDLORD"], {
    message: "Please select a type of account.",
  }),
});

export type RegisterState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
};

export async function registerAction(
  _prevState: RegisterState | undefined,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role } = parsed.data;
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          "Registration failed. Please try again.",
      };
    }

    return {
      success: true,
      message: "Registration successful! Redirecting you to login...",
    };
  } catch (error) {
    return {
      success: false,
      message:
        `Unable to reach the authentication server. ${error instanceof Error ? error.message : ""}`.trim(),
    };
  }
}
