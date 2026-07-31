import { StatCard } from "@/components/stat-card";
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
import { TenantRequestsTable } from "./_component/tenant-requests-table";

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
        <StatCard
          title="Active Rentals"
          value={activeRentals.length}
          icon={Building}
          iconColorClass="text-emerald-500"
          iconBgClass="bg-emerald-500/5"
          glowColorClass="bg-emerald-500/5"
        />

        <StatCard
          title="Pending Payments"
          value={pendingPayments.length}
          icon={CreditCard}
          iconColorClass="text-amber-500"
          iconBgClass="bg-amber-500/5"
          glowColorClass="bg-amber-500/5"
        />

        <StatCard
          title="Pending Approvals"
          value={pendingApprovals.length}
          icon={GitPullRequest}
          iconColorClass="text-primary"
          iconBgClass="bg-primary/5"
          glowColorClass="bg-primary/5"
        />
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
          <TenantRequestsTable requests={requests} />
        )}
      </section>
    </main>
  );
}
