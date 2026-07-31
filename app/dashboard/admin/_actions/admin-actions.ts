"use server";

import { apiFetch } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(
  name: string,
): Promise<{ success: boolean; message: string }> {
  if (!name || name.trim() === "") {
    return { success: false, message: "Category name is required" };
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const response = await apiFetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name, slug }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message || payload?.error || "Failed to create category.",
      };
    }

    revalidatePath("/dashboard/admin");
    revalidatePath("/properties");
    revalidatePath("/dashboard/landlord/properties/new");
    revalidatePath("/dashboard/admin/categories");

    return {
      success: true,
      message: payload?.message || "Category created successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function updateCategoryAction(
  id: string,
  name: string,
): Promise<{ success: boolean; message: string }> {
  if (!name || name.trim() === "") {
    return { success: false, message: "Category name is required" };
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const response = await apiFetch(`/api/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name, slug }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message || payload?.error || "Failed to update category.",
      };
    }

    revalidatePath("/dashboard/admin");
    revalidatePath("/properties");
    revalidatePath("/dashboard/landlord/properties/new");
    revalidatePath("/dashboard/admin/categories");

    return {
      success: true,
      message: payload?.message || "Category updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function deleteCategoryAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message || payload?.error || "Failed to delete category.",
      };
    }

    revalidatePath("/dashboard/admin");
    revalidatePath("/properties");
    revalidatePath("/dashboard/landlord/properties/new");
    revalidatePath("/dashboard/admin/categories");

    return {
      success: true,
      message: payload?.message || "Category deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function deletePropertyAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/properties/${id}`, {
      method: "DELETE",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message || payload?.error || "Failed to delete listing.",
      };
    }

    revalidatePath("/dashboard/admin");
    revalidatePath("/properties");

    return {
      success: true,
      message: payload?.message || "Listing deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function moderateRentalStatusAction(
  rentalId: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED",
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/rentals/${rentalId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          "Failed to update request status.",
      };
    }

    revalidatePath("/dashboard/admin");

    return {
      success: true,
      message:
        payload?.message ||
        `Rental request status updated to ${status.toLowerCase()}!`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
