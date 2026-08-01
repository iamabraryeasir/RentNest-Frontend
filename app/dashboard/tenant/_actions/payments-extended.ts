"use server";

import { apiFetch } from "@/lib/api-client";

export async function fetchPaymentHistoryAction(queryParams?: string) {
  try {
    const url = queryParams
      ? `/api/payments/history?${queryParams}`
      : "/api/payments/history";
    const response = await apiFetch(url, {
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

    return {
      success: false,
      data: [],
      meta: null,
    };
  } catch (error) {
    console.error("Failed to fetch payment history:", error);
    return {
      success: false,
      data: [],
      meta: null,
    };
  }
}

export async function fetchPaymentDetailsAction(paymentId: string) {
  try {
    const response = await apiFetch(`/api/payments/${paymentId}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const payload = await response.json();
      return {
        success: true,
        data: payload?.data || null,
      };
    }

    return {
      success: false,
      data: null,
    };
  } catch (error) {
    console.error("Failed to fetch payment details:", error);
    return {
      success: false,
      data: null,
    };
  }
}
