import { apiFetch } from "@/lib/api-client";
import { ArrowLeft, GitPullRequest } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RequestsModerator } from "../_component/requests-moderator";

export default async function AdminRequestsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  let requests = [];
  try {
    const res = await apiFetch("/api/rentals", { cache: "no-store" });
    if (res.ok) {
      const payload = await res.json();
      requests = payload?.data || [];
    }
  } catch (e) {
    console.error(
      "Failed to load rental requests for requests moderation page:",
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
            Transaction Moderation
          </p>
          <h1 className="mt-1.5 text-2xl font-black text-foreground flex items-center gap-2">
            <GitPullRequest className="size-6 text-primary" /> Rental Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Supervise all booking requests across the RentNest marketplace.
            Force-approve, reject or reset request statuses.
          </p>
        </div>
      </section>

      {/* Requests Moderator component */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <RequestsModerator requests={requests} />
      </div>
    </main>
  );
}
