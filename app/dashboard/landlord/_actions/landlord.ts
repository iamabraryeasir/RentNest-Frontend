"use server";

import { apiFetch } from "@/lib/api-client";
import type { CreatePropertyState } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createPropertySchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),
  address: z.string().trim().min(5, "Address must be at least 5 characters."),
  city: z.string().trim().min(2, "City is required."),
  area: z.string().trim().min(2, "Area is required."),
  postalCode: z.string().trim().min(2, "Postal code is required."),
  rentAmount: z.preprocess(
    (val) => Number(val),
    z.number().positive("Rent amount must be a positive number."),
  ),
  bedrooms: z.preprocess(
    (val) => Number(val),
    z.number().int().nonnegative("Bedrooms count must be non-negative."),
  ),
  bathrooms: z.preprocess(
    (val) => Number(val),
    z.number().int().nonnegative("Bathrooms count must be non-negative."),
  ),
  propertySize: z.preprocess(
    (val) => Number(val),
    z.number().positive("Property size must be positive."),
  ),
  categoryId: z.string().min(1, "Please select a category."),
});

export async function createPropertyAction(
  _prevState: CreatePropertyState | undefined,
  formData: FormData,
): Promise<CreatePropertyState> {
  const parsed = createPropertySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    address: formData.get("address"),
    city: formData.get("city"),
    area: formData.get("area"),
    postalCode: formData.get("postalCode"),
    rentAmount: formData.get("rentAmount"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    propertySize: formData.get("propertySize"),
    categoryId: formData.get("categoryId"),
  });

  console.log(parsed);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted form validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const response = await apiFetch("/api/properties", {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        area: data.area,
        postalCode: data.postalCode,
        rentAmount: data.rentAmount,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        propertySize: data.propertySize,
        categoryId: data.categoryId,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          "Failed to create property listing.",
      };
    }

    revalidatePath("/dashboard/landlord");
    revalidatePath("/properties");

    return {
      success: true,
      message: payload?.message || "Property listing created successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to the backend server. ${error instanceof Error ? error.message : ""}`,
    };
  }
}

export async function updateRentalStatusAction(
  rentalId: string,
  status: "APPROVED" | "REJECTED",
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
          `Failed to ${status.toLowerCase()} rental request.`,
      };
    }

    revalidatePath("/dashboard/landlord");
    revalidatePath("/dashboard/landlord/requests");

    return {
      success: true,
      message:
        payload?.message ||
        `Rental request ${status.toLowerCase()} successfully!`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error. ${error instanceof Error ? error.message : ""}`,
    };
  }
}

export async function updatePropertyAction(
  _prevState: CreatePropertyState | undefined,
  formData: FormData,
): Promise<CreatePropertyState> {
  const propertyId = formData.get("propertyId") as string;

  const parsed = createPropertySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    address: formData.get("address"),
    city: formData.get("city"),
    area: formData.get("area"),
    postalCode: formData.get("postalCode"),
    rentAmount: formData.get("rentAmount"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    propertySize: formData.get("propertySize"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted form validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const response = await apiFetch(`/api/properties/${propertyId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        area: data.area,
        postalCode: data.postalCode,
        rentAmount: data.rentAmount,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        propertySize: data.propertySize,
        categoryId: data.categoryId,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          "Failed to update property listing.",
      };
    }

    revalidatePath("/dashboard/landlord");
    revalidatePath("/properties");
    revalidatePath(`/properties/${propertyId}`);

    return {
      success: true,
      message: payload?.message || "Property listing updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to the backend server. ${error instanceof Error ? error.message : ""}`,
    };
  }
}

export async function deletePropertyAction(
  propertyId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/properties/${propertyId}`, {
      method: "DELETE",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          "Failed to delete property listing.",
      };
    }

    revalidatePath("/dashboard/landlord");
    revalidatePath("/properties");

    return {
      success: true,
      message: payload?.message || "Property listing deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error. ${error instanceof Error ? error.message : ""}`,
    };
  }
}

export async function updatePropertyListingStatusAction(
  propertyId: string,
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE",
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/properties/${propertyId}/status`, {
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
          `Failed to update property status to ${status.toLowerCase()}.`,
      };
    }

    revalidatePath("/dashboard/landlord");
    revalidatePath("/properties");
    revalidatePath(`/properties/${propertyId}`);

    return {
      success: true,
      message:
        payload?.message ||
        `Property status updated to ${status.toLowerCase()}!`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error. ${error instanceof Error ? error.message : ""}`,
    };
  }
}
