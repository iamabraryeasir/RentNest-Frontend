import type { Property } from "./property";
import type { RentalRequest } from "./rental";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface Payment {
  id: string;
  status: PaymentStatus | string;
  amount: string | number;
  rentAmount?: string | number;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  rentalRequestId?: string;
  tenantId?: string;
  createdAt: string;
  updatedAt?: string;
  property?: Pick<Property, "id" | "title" | "city" | "area">;
  rentalRequest?: RentalRequest;
}

export interface StripeCheckoutSessionResponse {
  success: boolean;
  message?: string;
  data?: {
    sessionId: string;
    url: string;
  };
}
