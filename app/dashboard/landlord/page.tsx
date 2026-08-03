import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import type { DashboardRentalRequest, Property } from "@/types";
import {
  Building,
  GitPullRequest,
  Home,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MyListingsTable } from "./_component/my-listings-table";

export const metadata: Metadata = {
  title: "Landlord Dashboard",
  description: "Manage property listings and tenant rental applications.",
};

export default async function LandlordDashboardPage() {
  // Fetch properties and requests in parallel
  let properties: Property[] = [];
  let requests: DashboardRentalRequest[] = [];

  try {
    const [propResponse, reqResponse] = await Promise.all([
      apiFetch("/api/properties/my-properties", { cache: "no-store" }),
      apiFetch("/api/rentals/incoming", { cache: "no-store" }),
    ]);

    if (propResponse.ok) {
      const propPayload = await propResponse.json();
      properties = propPayload?.data || [];
    }

    if (reqResponse.ok) {
      const reqPayload = await reqResponse.json();
      requests = reqPayload?.data || [];
    }
  } catch (error) {
    console.error("Failed to load landlord dashboard overview metrics:", error);
  }

  const pendingRequestsCount = requests.filter(
    (r) => r.status === "PENDING",
  ).length;
  const portfolioRentAmount = properties.reduce(
    (sum, p) => sum + Number(p.rentAmount || 0),
    0,
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6">
      {/* Header section */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Landlord Overview
          </p>
          <h1 className="mt-1.5 text-2xl font-black text-foreground">
            Manage your properties
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review incoming requests, keep your listings updated, and monitor
            rental revenue.
          </p>
        </div>
        <Button
          render={<Link href="/dashboard/landlord/properties/new" />}
          className="cursor-pointer gap-2 rounded-xl py-5 shadow-sm font-semibold"
        >
          <PlusCircle className="size-4" /> Add Property
        </Button>
      </section>

      {/* Metrics Section */}
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Properties"
          value={properties.length}
          icon={Building}
          iconColorClass="text-primary"
          iconBgClass="bg-primary/5"
        />

        <StatCard
          title="Pending Requests"
          value={pendingRequestsCount}
          icon={GitPullRequest}
          iconColorClass="text-amber-500"
          iconBgClass="bg-amber-500/5"
          glowColorClass="bg-amber-500/5"
        />

        <StatCard
          title="Monthly Value"
          value={`৳${portfolioRentAmount.toLocaleString()}`}
          icon={TrendingUp}
          iconColorClass="text-emerald-500"
          iconBgClass="bg-emerald-500/5"
          glowColorClass="bg-emerald-500/5"
        />
      </section>

      {/* Listings list section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            My Listings ({properties.length})
          </h2>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-70">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Home className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-base">
              No listings created yet
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mb-4">
              Start earning by listing your apartment or house on the platform.
            </p>
            <Button
              render={<Link href="/dashboard/landlord/properties/new" />}
              className="cursor-pointer gap-2 rounded-xl"
            >
              <PlusCircle className="size-4" /> Add Your First Property
            </Button>
          </div>
        ) : (
          <MyListingsTable properties={properties} />
        )}
      </section>
    </main>
  );
}
