"use server";

import { apiFetch } from "@/lib/api-client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const rentalRequestSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
});

export type RentalRequestState = {
  success: boolean;
  message: string;
  errors?: {
    propertyId?: string[];
    startDate?: string[];
    endDate?: string[];
  };
};

export async function submitRentalRequestAction(
  _prevState: RentalRequestState | undefined,
  formData: FormData,
): Promise<RentalRequestState> {
  const parsed = rentalRequestSchema.safeParse({
    propertyId: formData.get("propertyId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { propertyId, startDate, endDate } = parsed.data;

  try {
    const response = await apiFetch("/api/rentals", {
      method: "POST",
      body: JSON.stringify({
        propertyId,
        startDate,
        endDate,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message || payload?.error || "Failed to submit rental request.",
      };
    }

    revalidatePath(`/properties/${propertyId}`);

    return {
      success: true,
      message: payload?.message || "Rental request submitted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to the backend server. ${error instanceof Error ? error.message : ""}`,
    };
  }
}
