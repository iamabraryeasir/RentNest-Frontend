import { Property } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import {
  Building,
  GitPullRequest,
  Home,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MyListingsTable } from "./_component/my-listings-table";

export default async function LandlordDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "landlord") {
    redirect("/dashboard");
  }

  // Fetch properties and requests in parallel
  let properties: Property[] = [];
  let requests = [];

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
    (r: any) => r.status === "PENDING",
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
        {/* Total Properties */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Properties
            </p>
            <p className="text-2xl font-black text-foreground">
              {properties.length}
            </p>
          </div>
          <div className="rounded-xl bg-primary/5 p-3">
            <Building className="size-6 text-primary" />
          </div>
        </div>

        {/* Incoming Requests */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pending Requests
            </p>
            <p className="text-2xl font-black text-foreground">
              {pendingRequestsCount}
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/5 p-3">
            <GitPullRequest className="size-6 text-amber-500" />
          </div>
        </div>

        {/* Monthly Earnings */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Monthly Value
            </p>
            <p className="text-2xl font-black text-foreground">
              ৳{portfolioRentAmount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/5 p-3">
            <TrendingUp className="size-6 text-emerald-500" />
          </div>
        </div>
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
