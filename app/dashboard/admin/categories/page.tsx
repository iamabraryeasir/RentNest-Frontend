import { apiFetch } from "@/lib/api-client";
import { ArrowLeft, Folder } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CategoryManager } from "../_component/category-manager";

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  let categories = [];
  try {
    const res = await apiFetch("/api/categories", { cache: "no-store" });
    if (res.ok) {
      const payload = await res.json();
      categories = payload?.data || [];
    }
  } catch (e) {
    console.error(
      "Failed to load categories for categories administration page:",
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
            Platform Taxonomy
          </p>
          <h1 className="mt-1.5 text-2xl font-black text-foreground flex items-center gap-2">
            <Folder className="size-6 text-primary" /> Manage Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, update, or remove property listing categories that landlords
            select when publishing listings.
          </p>
        </div>
      </section>

      {/* Categories Manager component */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <CategoryManager categories={categories} />
      </div>
    </main>
  );
}
