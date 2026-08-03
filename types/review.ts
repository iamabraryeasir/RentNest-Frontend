import type { User } from "./auth";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  propertyId: string;
  tenantId: string;
  createdAt: string;
  updatedAt?: string;
  tenant?: Pick<User, "id" | "name" | "email">;
}

export type ReviewState = {
  success: boolean;
  message: string;
  errors?: {
    propertyId?: string[];
    rating?: string[];
    comment?: string[];
  };
};
