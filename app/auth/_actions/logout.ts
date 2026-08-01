"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

export async function logoutAction() {
  try {
    // Notify the backend to invalidate the refresh token/session
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Backend logout failed:", error);
  }

  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  redirect("/auth/login");
}
