import { apiFetch } from "@/lib/api-client";
import { notFound } from "next/navigation";
import { updatePropertyAction } from "../../../_actions/landlord";
import { PropertyForm } from "../../../_component/property-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;

  // Fetch property details and categories in parallel
  let property = null;
  let categories = [];

  try {
    const [propResponse, catResponse] = await Promise.all([
      apiFetch(`/api/properties/${id}`, { cache: "no-store" }),
      apiFetch("/api/categories", { next: { revalidate: 3600 } }),
    ]);

    if (propResponse.ok) {
      const propPayload = await propResponse.json();
      property = propPayload?.data || null;
    }

    if (catResponse.ok) {
      const catPayload = await catResponse.json();
      categories = catPayload?.data || [];
    }
  } catch (error) {
    console.error("Failed to load edit listing data for property:", error);
  }

  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6">
      <section className="rounded-2xl border bg-card p-6 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Modify Listing
        </p>
        <h1 className="mt-1.5 text-2xl font-black text-foreground">
          Edit listing details
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Make updates to the listing details and save changes to apply them.
        </p>
      </section>

      <section className="rounded-2xl border bg-card shadow-xs">
        <PropertyForm
          mode="edit"
          action={updatePropertyAction}
          categories={categories}
          initialData={property}
        />
      </section>
    </main>
  );
}
