"use server";

import { apiFetch } from "@/lib/api-client";

export async function createCheckoutSessionAction(rentalId: string): Promise<{
  success: boolean;
  message: string;
  url?: string;
}> {
  try {
    const response = await apiFetch("/api/payments/checkout-session", {
      method: "POST",
      body: JSON.stringify({ rentalRequestId: rentalId }),
    });

    const payload = await response.json().catch(() => ({}));

    console.log("PAYLOAD", payload);

    if (!response.ok) {
      return {
        success: false,
        message:
          payload?.message ||
          payload?.error ||
          "Failed to initiate payment checkout.",
      };
    }

    // Handle different formats that the backend might return the URL in
    const checkoutUrl = payload?.data?.url || payload?.url || payload?.data;

    if (!checkoutUrl || typeof checkoutUrl !== "string") {
      return {
        success: false,
        message: "Payment gateway URL not received from the server.",
      };
    }

    return {
      success: true,
      message: "Checkout session created successfully.",
      url: checkoutUrl,
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error. ${error instanceof Error ? error.message : ""}`,
    };
  }
}
