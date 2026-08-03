import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { apiFetch } from "@/lib/api-client";
import type {
  DashboardCategory,
  DashboardMetrics,
  DashboardProperty,
  DashboardRentalRequest,
  DashboardUser,
} from "@/types";
import {
  Activity,
  ArrowUpRight,
  Building,
  Folder,
  GitPullRequest,
  Home,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "System metrics, user management, and listing moderation.",
};

export default async function AdminDashboardPage() {
  let users: DashboardUser[] = [];
  let properties: DashboardProperty[] = [];
  let requests: DashboardRentalRequest[] = [];
  let categories: DashboardCategory[] = [];
  let metrics: DashboardMetrics | null = null;

  try {
    const res = await apiFetch("/api/admin/metrics");
    if (res.ok) {
      const payload = await res.json();
      metrics = payload?.data || null;
    } else {
      const fallbackRes = await apiFetch("/api/dashboard/metrics");
      if (fallbackRes.ok) {
        const payload = await fallbackRes.json();
        metrics = payload?.data || null;
      }
    }
  } catch (e) {
    console.error("Failed to fetch admin metrics:", e);
  }

  try {
    const res = await apiFetch("/api/users");
    if (res.ok) {
      const payload = await res.json();
      users = payload?.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch admin dashboard users:", e);
  }

  try {
    const res = await apiFetch("/api/properties");
    if (res.ok) {
      const payload = await res.json();
      properties = payload?.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch admin dashboard properties:", e);
  }

  try {
    const res = await apiFetch("/api/rentals");
    if (res.ok) {
      const payload = await res.json();
      requests = payload?.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch admin dashboard rentals:", e);
  }

  try {
    const res = await apiFetch("/api/categories");
    if (res.ok) {
      const payload = await res.json();
      categories = payload?.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch admin dashboard categories:", e);
  }

  // Metrics calculations (prioritizing backend metrics response payload)
  const totalUsers = metrics?.users?.total ?? users.length;
  const landlordsCount =
    metrics?.users?.landlords ??
    users.filter((u) => u.role === "LANDLORD").length;
  const tenantsCount =
    metrics?.users?.tenants ?? users.filter((u) => u.role === "TENANT").length;

  const totalProperties = metrics?.properties?.total ?? properties.length;
  const availableProperties =
    metrics?.properties?.available ??
    properties.filter((p) => p.status === "AVAILABLE").length;
  const rentedProperties =
    metrics?.properties?.rented ??
    properties.filter((p) => p.status === "RENTED").length;

  const totalRequests = metrics?.rentals?.total ?? requests.length;
  const activeRentals =
    metrics?.rentals?.active ??
    requests.filter((r) => r.status === "ACTIVE").length;
  const pendingApprovals =
    metrics?.rentals?.pending ??
    requests.filter((r) => r.status === "PENDING").length;

  const estimatedRevenue =
    metrics?.finance?.totalRevenue ??
    requests
      .filter((r) => r.status === "ACTIVE" || r.status === "COMPLETED")
      .reduce((sum: number, r) => sum + Number(r.rentAmount || 0), 0);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6">
      {/* Header section */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Admin Dashboard
        </p>
        <h1 className="mt-1.5 text-2xl font-black text-foreground">
          Platform Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor the health of the RentNest rental marketplace, manage active
          listing categories, and moderate posts or bookings.
        </p>
      </section>

      {/* Metrics Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Platform Users"
          value={totalUsers}
          icon={Users}
          iconColorClass="text-primary"
          iconBgClass="bg-primary/10"
          footer={
            <>
              <span className="font-semibold text-foreground">
                {landlordsCount}
              </span>{" "}
              landlords
              <span>•</span>
              <span className="font-semibold text-foreground">
                {tenantsCount}
              </span>{" "}
              tenants
            </>
          }
        />

        <StatCard
          title="Total Properties"
          value={totalProperties}
          icon={Building}
          iconColorClass="text-amber-500"
          iconBgClass="bg-amber-500/10"
          glowColorClass="bg-amber-500/5"
          footer={
            <>
              <span className="font-semibold text-emerald-600">
                {availableProperties}
              </span>{" "}
              available
              <span>•</span>
              <span className="font-semibold text-blue-600">
                {rentedProperties}
              </span>{" "}
              rented
            </>
          }
        />

        <StatCard
          title="Active Rentals"
          value={activeRentals}
          icon={GitPullRequest}
          iconColorClass="text-emerald-500"
          iconBgClass="bg-emerald-500/10"
          glowColorClass="bg-emerald-500/5"
          footer={
            <>
              <span className="font-semibold text-amber-600">
                {pendingApprovals}
              </span>{" "}
              pending decision
              <span>•</span>
              <span className="font-semibold text-foreground">
                {totalRequests}
              </span>{" "}
              total requests
            </>
          }
        />

        <StatCard
          title="Estimated Volume"
          value={`$${estimatedRevenue.toLocaleString()}`}
          icon={TrendingUp}
          iconColorClass="text-blue-500"
          iconBgClass="bg-blue-500/10"
          glowColorClass="bg-blue-500/5"
          footer={
            <span className="text-emerald-500 font-semibold">
              Volume from active rents
            </span>
          }
        />
      </section>

      {/* Grid Dashboard View */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Quick actions and recent activities */}
        <div className="md:col-span-2 space-y-6">
          {/* Recent Rental Requests */}
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Activity className="size-4 text-primary animate-pulse" />
                Recent Platform Requests
              </h3>
              <Link
                href="/dashboard/admin/requests"
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                Manage all requests <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {requests.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No rental request activity yet.
              </p>
            ) : (
              <div className="divide-y divide-border/60">
                {requests.slice(0, 4).map((req: DashboardRentalRequest) => (
                  <div
                    key={req.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {req.property?.title || "Property Listing"}
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        Tenant:{" "}
                        <span className="text-foreground font-medium">
                          {req.tenant?.name || req.tenant?.email}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={req.status ?? "PENDING"} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Properties */}
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Home className="size-4 text-primary" /> Recently Added Listings
              </h3>
              <Link
                href="/dashboard/admin/properties"
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                Moderate properties <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {properties.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No properties listed yet.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {properties.slice(0, 4).map((prop: DashboardProperty) => (
                  <div
                    key={prop.id}
                    className="p-3 border rounded-xl bg-card space-y-1.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-semibold text-foreground text-sm truncate">
                        {prop.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {prop.address}, {prop.city}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                      <span className="font-bold text-foreground">
                        ${Number(prop.rentAmount).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {prop.category?.name || "Uncategorized"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - User Overview and quick shortcuts */}
        <div className="space-y-6">
          {/* Category Quick Look */}
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Folder className="size-4 text-primary" /> Categories Overview
            </h3>
            {categories.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No categories configured.
              </p>
            ) : (
              <div className="space-y-2 max-h-55 overflow-y-auto pr-1">
                {categories.map((cat: DashboardCategory) => {
                  const count = properties.filter(
                    (p) => p.category?.name === cat.name,
                  ).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
                    >
                      <span className="font-medium text-foreground">
                        {cat.name}
                      </span>
                      <span className="bg-muted px-2 py-0.5 rounded-full font-mono text-muted-foreground font-semibold">
                        {count} listings
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <Link
              href="/dashboard/admin/categories"
              className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-semibold hover:bg-muted hover:text-foreground transition-all w-full text-center"
            >
              Manage Categories
            </Link>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-2xl border bg-linear-to-br from-primary/10 to-primary/5 p-6 shadow-xs space-y-4 relative overflow-hidden">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Shield className="size-4 text-primary" /> Admin Shortcuts
            </h3>
            <div className="space-y-2.5 relative z-10">
              <Link
                href="/dashboard/admin/users"
                className="flex items-center justify-between text-xs font-semibold p-2.5 bg-card hover:bg-muted/40 border rounded-xl transition-all"
              >
                <span>Manage Users</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/dashboard/admin/properties"
                className="flex items-center justify-between text-xs font-semibold p-2.5 bg-card hover:bg-muted/40 border rounded-xl transition-all"
              >
                <span>Moderate Properties</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/dashboard/admin/requests"
                className="flex items-center justify-between text-xs font-semibold p-2.5 bg-card hover:bg-muted/40 border rounded-xl transition-all"
              >
                <span>Moderate Rentals</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
