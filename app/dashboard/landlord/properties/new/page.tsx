import type { Metadata } from "next";
import { apiFetch } from "@/lib/api-client";
import { createPropertyAction } from "../../_actions/landlord";
import { PropertyForm } from "../../_component/property-form";

export const metadata: Metadata = {
  title: "Create Property Listing",
  description: "List a new rental property on RentNest.",
};

export default async function NewPropertyPage() {
  // Fetch categories from the backend (cached for 1 hour)
  let categories = [];
  try {
    const response = await apiFetch("/api/categories", {
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const payload = await response.json();
      categories = payload?.data || [];
    }
  } catch (error) {
    console.error(
      "Failed to load categories for new property listing form:",
      error,
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6">
      <section className="rounded-2xl border bg-card p-6 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          New Listing
        </p>
        <h1 className="mt-1.5 text-2xl font-black text-foreground">
          Create a new listing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          List your property on RentNest to find verified tenants.
        </p>
      </section>

      <section className="rounded-2xl border bg-card shadow-xs">
        <PropertyForm
          mode="create"
          action={createPropertyAction}
          categories={categories}
        />
      </section>
    </main>
  );
}
