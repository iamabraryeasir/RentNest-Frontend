"use server";

import { apiFetch } from "@/lib/api-client";
import type { ProfileState } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional(),
});

export async function updateProfileAction(
  _prevState: ProfileState | undefined,
  formData: FormData,
): Promise<ProfileState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();

  const parsed = updateProfileSchema.safeParse({
    name: name || undefined,
    email: email || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const updatePayload: Record<string, string> = {};
  if (name) updatePayload.name = name;

  if (Object.keys(updatePayload).length === 0) {
    return {
      success: false,
      message: "Please provide at least one valid field to update.",
    };
  }

  try {
    const response = await apiFetch("/api/users/profile", {
      method: "PATCH",
      body: JSON.stringify(updatePayload),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          "Failed to update profile. Please try again.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: payload?.message || "Profile updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to the backend server. ${
        error instanceof Error ? error.message : ""
      }`,
    };
  }
}

export async function fetchMeAction() {
  try {
    const response = await apiFetch("/api/auth/me", {
      cache: "no-store",
    });

    if (response.ok) {
      const payload = await response.json();
      return {
        success: true,
        data: payload?.data || payload?.user || null,
      };
    }

    return {
      success: false,
      data: null,
    };
  } catch (error) {
    console.error(
      "Failed to fetch current user profile via /api/auth/me:",
      error,
    );
    return {
      success: false,
      data: null,
    };
  }
}
