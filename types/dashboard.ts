import type { LucideIcon } from "lucide-react";
import type { UserRole, UserStatus } from "./auth";
import type { PropertyStatus } from "./property";
import type { RentalStatus } from "./rental";
import type { PaymentStatus } from "./payment";

export type DashboardStatus =
  | UserStatus
  | PropertyStatus
  | RentalStatus
  | PaymentStatus
  | "BLOCKED";

export { type UserRole };

export interface DashboardUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: UserRole | string;
  status?: DashboardStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardCategory {
  id: string;
  name: string;
  slug?: string;
}

export interface DashboardProperty {
  id: string;
  title: string;
  address?: string;
  city?: string;
  area?: string;
  rentAmount?: string | number;
  bedrooms?: number;
  bathrooms?: number;
  propertySize?: number;
  status?: DashboardStatus | string;
  category?: DashboardCategory;
  categoryId?: string;
  landlordId?: string;
  landlord?: Pick<DashboardUser, "id" | "name" | "email">;
}

export interface DashboardRentalRequest {
  id: string;
  status?: DashboardStatus | string;
  rentAmount?: string | number;
  requestedMoveIn?: string;
  message?: string;
  propertyId?: string;
  property?: DashboardProperty;
  tenant?: Pick<DashboardUser, "id" | "name" | "email">;
}

export interface DashboardPayment {
  id: string;
  status?: DashboardStatus | string;
  amount?: string | number;
  rentAmount?: string | number;
  createdAt?: string;
  stripePaymentIntentId?: string;
  property?: Pick<DashboardProperty, "id" | "title" | "city">;
  rentalRequest?: {
    property?: Pick<DashboardProperty, "id" | "title" | "city">;
  };
}

export interface DashboardMetrics {
  users?: {
    total?: number;
    landlords?: number;
    tenants?: number;
  };
  properties?: {
    total?: number;
    available?: number;
    rented?: number;
  };
  rentals?: {
    total?: number;
    active?: number;
    pending?: number;
  };
  finance?: {
    totalRevenue?: number;
  };
}

export interface SidebarItem {
  text: string;
  path: string;
  icon: LucideIcon;
}
