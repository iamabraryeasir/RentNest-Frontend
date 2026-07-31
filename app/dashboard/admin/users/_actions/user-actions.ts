"use server";

import { apiFetch } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export async function toggleUserStatusAction(
  userId: string,
  currentStatus: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const nextStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const response = await apiFetch(`/api/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          `Failed to set user status to ${nextStatus.toLowerCase()}.`,
      };
    }

    revalidatePath("/dashboard/admin/users");

    return {
      success: true,
      message:
        payload?.message ||
        `User status updated to ${nextStatus.toLowerCase()} successfully!`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function deleteUserAction(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/users/${userId}`, {
      method: "DELETE",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message || payload?.error || "Failed to delete user.",
      };
    }

    revalidatePath("/dashboard/admin/users");

    return {
      success: true,
      message: payload?.message || "User deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
