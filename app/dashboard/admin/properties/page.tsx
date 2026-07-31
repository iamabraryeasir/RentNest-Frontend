import { apiFetch } from "@/lib/api-client";
import { ArrowLeft, Home } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ListingsModerator } from "../_component/listings-moderator";

export default async function AdminPropertiesPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  let properties = [];
  try {
    const res = await apiFetch("/api/properties", { cache: "no-store" });
    if (res.ok) {
      const payload = await res.json();
      properties = payload?.data || [];
    }
  } catch (e) {
    console.error(
      "Failed to load properties for properties moderation page:",
      e,
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6">
      {/* Header section */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Dashboard
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Content Moderation
          </p>
          <h1 className="mt-1.5 text-2xl font-black text-foreground flex items-center gap-2">
            <Home className="size-6 text-primary" /> Moderate Properties
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review listings submitted by landlords. Delete active listings that
            violate platform standards or policies.
          </p>
        </div>
      </section>

      {/* Listings Moderator component */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <ListingsModerator properties={properties} />
      </div>
    </main>
  );
}
