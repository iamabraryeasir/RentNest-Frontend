import { Property, PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { apiFetch } from "@/lib/api-client";
import { Home } from "lucide-react";
import Link from "next/link";

interface PropertyListingsProps {
  searchParams: Record<string, string | undefined>;
}

export async function PropertyListings({
  searchParams,
}: PropertyListingsProps) {
  const currentPage = Number(searchParams.page || "1");
  const currentLimit = Number(searchParams.limit || "6");

  // Build Query Parameters for backend API
  const apiParams = new URLSearchParams();
  apiParams.set("page", currentPage.toString());
  apiParams.set("limit", currentLimit.toString());

  if (searchParams.search) apiParams.set("search", searchParams.search);
  if (searchParams.city) apiParams.set("city", searchParams.city);
  if (searchParams.categoryId)
    apiParams.set("categoryId", searchParams.categoryId);
  if (searchParams.minPrice) apiParams.set("minPrice", searchParams.minPrice);
  if (searchParams.maxPrice) apiParams.set("maxPrice", searchParams.maxPrice);
  if (searchParams.bedrooms) apiParams.set("bedrooms", searchParams.bedrooms);
  if (searchParams.bathrooms)
    apiParams.set("bathrooms", searchParams.bathrooms);
  if (searchParams.sortBy) {
    apiParams.set("sortBy", searchParams.sortBy);
    if (searchParams.sortOrder) {
      apiParams.set("sortOrder", searchParams.sortOrder);
    }
  }

  let properties: Property[] = [];
  let totalCount = 0;

  try {
    const propResponse = await apiFetch(
      `/api/properties?${apiParams.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (propResponse.ok) {
      const propData = await propResponse.json();
      properties = propData?.data || [];
      totalCount = propData?.meta?.total || 0;
    }
  } catch (error) {
    console.error("Failed to load properties list data:", error);
  }

  if (properties.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-[350px]">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Home className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-foreground text-lg">
          No properties found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          We couldn't find any rentals matching your exact filter combinations.
          Try resetting or adjusting filters.
        </p>
        <Button
          render={<Link href="/properties" />}
          className="mt-5 rounded-xl cursor-pointer"
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Properties Count */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Showing {properties.length} of {totalCount} properties
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-8 border-t border-border/55 pt-4">
        <Pagination
          page={currentPage}
          limit={currentLimit}
          total={totalCount}
        />
      </div>
    </>
  );
}
