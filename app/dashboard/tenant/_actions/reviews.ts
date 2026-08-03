"use server";

import { apiFetch } from "@/lib/api-client";
import type { ReviewState } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required."),
  rating: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .int()
      .min(1, "Please select at least 1 star.")
      .max(5, "Maximum rating is 5 stars."),
  ),
  comment: z
    .string()
    .trim()
    .min(5, "Review comment must be at least 5 characters."),
});

export async function submitReviewAction(
  _prevState: ReviewState | undefined,
  formData: FormData,
): Promise<ReviewState> {
  const parsed = reviewSchema.safeParse({
    propertyId: formData.get("propertyId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the review form validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { propertyId, rating, comment } = parsed.data;

  try {
    const response = await apiFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        propertyId,
        rating,
        comment,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          "Failed to submit property review.",
      };
    }

    revalidatePath(`/properties/${propertyId}`);
    revalidatePath("/dashboard/tenant");

    return {
      success: true,
      message: payload?.message || "Review submitted successfully! Thank you.",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to the backend server. ${error instanceof Error ? error.message : ""}`,
    };
  }
}

export async function fetchPropertyReviewsAction(propertyId: string) {
  try {
    const response = await apiFetch(`/api/reviews/property/${propertyId}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const payload = await response.json();
      return {
        success: true,
        data: payload?.data || [],
        meta: payload?.meta || null,
      };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Failed to fetch property reviews:", error);
    return { success: false, data: [] };
  }
}

export async function updateReviewAction(
  reviewId: string,
  propertyId: string,
  rating?: number,
  comment?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify({ rating, comment }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message || payload?.error || "Failed to update review.",
      };
    }

    revalidatePath(`/properties/${propertyId}`);
    revalidatePath("/dashboard/tenant");

    return {
      success: true,
      message: payload?.message || "Review updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error. ${error instanceof Error ? error.message : ""}`,
    };
  }
}

export async function deleteReviewAction(
  reviewId: string,
  propertyId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message || payload?.error || "Failed to delete review.",
      };
    }

    revalidatePath(`/properties/${propertyId}`);
    revalidatePath("/dashboard/tenant");

    return {
      success: true,
      message: payload?.message || "Review deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error. ${error instanceof Error ? error.message : ""}`,
    };
  }
}
