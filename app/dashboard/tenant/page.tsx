import { ReviewTriggerButton } from "@/app/payment/_components/review-trigger-button";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import {
  ArrowRight,
  Building,
  CreditCard,
  GitPullRequest,
  Home,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TenantDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "tenant") {
    redirect("/dashboard");
  }

  let requests = [];
  try {
    const response = await apiFetch("/api/rentals/my-requests", {
      cache: "no-store",
    });
    if (response.ok) {
      const payload = await response.json();
      requests = payload?.data || [];
    }
  } catch (error) {
    console.error("Failed to load tenant dashboard requests:", error);
  }

  // Calculate metrics
  const activeRentals = requests.filter((r: any) => r.status === "ACTIVE");
  const pendingPayments = requests.filter((r: any) => r.status === "APPROVED");
  const pendingApprovals = requests.filter((r: any) => r.status === "PENDING");

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6">
      {/* Header section */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Tenant Overview
          </p>
          <h1 className="mt-1.5 text-2xl font-black text-foreground">
            Welcome back, tenant
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your booking requests, secure payments, and active rentals in
            one dashboard.
          </p>
        </div>
        <Button
          render={<Link href="/properties" />}
          className="cursor-pointer gap-2 rounded-xl py-5 shadow-sm font-semibold"
        >
          <Home className="size-4" /> Browse Properties
        </Button>
      </section>

      {/* Metrics Section */}
      <section className="grid gap-4 md:grid-cols-3">
        {/* Active Rentals */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Rentals
            </p>
            <p className="text-2xl font-black text-foreground">
              {activeRentals.length}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/5 p-3">
            <Building className="size-6 text-emerald-500" />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pending Payments
            </p>
            <p className="text-2xl font-black text-foreground">
              {pendingPayments.length}
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/5 p-3">
            <CreditCard className="size-6 text-amber-500" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pending Approvals
            </p>
            <p className="text-2xl font-black text-foreground">
              {pendingApprovals.length}
            </p>
          </div>
          <div className="rounded-xl bg-primary/5 p-3">
            <GitPullRequest className="size-6 text-primary" />
          </div>
        </div>
      </section>

      {/* Recent requests list section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Recent Requests ({requests.length})
          </h2>
          {requests.length > 0 && (
            <Link
              href="/dashboard/tenant/requests"
              className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline"
            >
              View All Requests <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-70">
            <div className="rounded-full bg-muted p-4 mb-4">
              <GitPullRequest className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-base">
              No booking requests yet
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mb-4">
              Find properties and request to rent to see them listed here.
            </p>
            <Button
              render={<Link href="/properties" />}
              className="cursor-pointer gap-2 rounded-xl"
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Move-In Date</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {requests.slice(0, 5).map((req: any) => {
                    const status = req.status;
                    const dateFormatted = new Date(
                      req.requestedMoveIn,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr
                        key={req.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">
                            {req.property?.title || "Property listing"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {req.property?.city || "Unknown Location"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {dateFormatted}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate">
                          {req.message}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border ${
                              status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                                : status === "APPROVED"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/25"
                                  : status === "PENDING"
                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/25"
                                    : "bg-red-500/10 text-red-600 border-red-500/25"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {status === "APPROVED" ? (
                            <Link
                              href={`/dashboard/tenant/requests/${req.id}/pay`}
                              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
                            >
                              Pay Now
                            </Link>
                          ) : status === "ACTIVE" ? (
                            <ReviewTriggerButton
                              propertyId={req.propertyId}
                              propertyTitle={req.property?.title || "Property"}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground font-medium">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
