import { apiFetch } from "@/lib/api-client";
import { RequestsTable } from "../_component/requests-table";

export default async function LandlordRequestsPage() {
  // Fetch incoming rental requests from the backend API
  let requests = [];
  try {
    const response = await apiFetch("/api/rentals/incoming", {
      cache: "no-store",
    });

    if (response.ok) {
      const payload = await response.json();
      requests = payload?.data || [];
    }
  } catch (error) {
    console.error("Failed to load incoming landlord rental requests:", error);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6">
      <section className="rounded-2xl border bg-card p-6 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Incoming Requests
        </p>
        <h1 className="mt-1.5 text-2xl font-black text-foreground">
          Manage rental requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review incoming lease applications, and approve or reject them.
        </p>
      </section>

      <section>
        <RequestsTable requests={requests} />
      </section>
    </main>
  );
}
