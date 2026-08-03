import type { Property } from "./property";
import type { User } from "./auth";

export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";

export interface RentalRequest {
  id: string;
  status: RentalStatus | string;
  rentAmount?: string | number;
  requestedMoveIn: string;
  message: string;
  propertyId: string;
  tenantId?: string;
  landlordId?: string;
  createdAt: string;
  updatedAt?: string;
  property?: Property;
  tenant?: Pick<User, "id" | "name" | "email">;
  landlord?: Pick<User, "id" | "name" | "email">;
}

export type RentalRequestState = {
  success: boolean;
  message: string;
  errors?: {
    propertyId?: string[];
    requestedMoveIn?: string[];
    message?: string[];
  };
};
