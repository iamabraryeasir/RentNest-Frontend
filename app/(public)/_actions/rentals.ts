"use server";

import { apiFetch } from "@/lib/api-client";
import type { RentalRequestState } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const rentalRequestSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required."),
  requestedMoveIn: z.string().min(1, "Requested move-in date is required."),
  message: z.string().min(1, "Message is required."),
});

export async function submitRentalRequestAction(
  _prevState: RentalRequestState | undefined,
  formData: FormData,
): Promise<RentalRequestState> {
  const parsed = rentalRequestSchema.safeParse({
    propertyId: formData.get("propertyId"),
    requestedMoveIn: formData.get("requestedMoveIn"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { propertyId, requestedMoveIn, message } = parsed.data;

  // Convert move-in date to ISO-8601 string format
  let isoMoveInDate: string;
  try {
    isoMoveInDate = new Date(requestedMoveIn).toISOString();
  } catch (err) {
    return {
      success: false,
      message: "Invalid requested move-in date format.",
      errors: { requestedMoveIn: ["Invalid date value."] },
    };
  }

  try {
    const response = await apiFetch("/api/rentals", {
      method: "POST",
      body: JSON.stringify({
        propertyId,
        requestedMoveIn: isoMoveInDate,
        message,
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
