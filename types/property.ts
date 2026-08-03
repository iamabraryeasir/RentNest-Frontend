export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";

export interface PropertyCategory {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  images: string[];
  rentAmount: string | number;
  bedrooms: number;
  bathrooms: number;
  propertySize: number;
  amenities: string[];
  status: PropertyStatus | string;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: PropertyCategory;
  landlord?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: PropertyStatus | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type CreatePropertyState = {
  success: boolean;
  message: string;
  errors?: {
    title?: string[];
    description?: string[];
    address?: string[];
    city?: string[];
    area?: string[];
    postalCode?: string[];
    rentAmount?: string[];
    bedrooms?: string[];
    bathrooms?: string[];
    propertySize?: string[];
    categoryId?: string[];
  };
};
