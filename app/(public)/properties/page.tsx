import { apiFetch } from "@/lib/api-client";
import { Suspense } from "react";
import { PropertyFilters } from "./_components/property-filters";
import { PropertyListings } from "./_components/property-listings";
import { PropertyListingsSkeleton } from "./_components/property-listings-skeleton";

interface PropertiesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const awaitedSearchParams = await searchParams;

  // Fetch categories (cached for 1 hour)
  let categories = [];
  try {
    const catResponse = await apiFetch("/api/categories", {
      next: { revalidate: 3600 },
    });
    if (catResponse.ok) {
      const catData = await catResponse.json();
      categories = catData?.data || [];
    }
  } catch (error) {
    console.error("Failed to load browse properties categories:", error);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-8">
      {/* Main Browse Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 rounded-2xl border border-border bg-card p-6 h-fit shadow-xs">
          <PropertyFilters
            categories={categories}
            initialFilters={awaitedSearchParams}
          />
        </aside>

        {/* Listings Grid */}
        <div className="flex-1 flex flex-col gap-6">
          <Suspense
            key={JSON.stringify(awaitedSearchParams)}
            fallback={<PropertyListingsSkeleton />}
          >
            <PropertyListings searchParams={awaitedSearchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
