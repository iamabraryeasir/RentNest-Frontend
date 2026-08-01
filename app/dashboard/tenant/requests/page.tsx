import { ReviewTriggerButton } from "@/app/payment/_components/review-trigger-button";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  GitPullRequest,
  HelpCircle,
  MapPin,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Rental Requests",
  description: "View and track the status of your rental applications.",
};

export default async function TenantRequestsPage() {
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
    console.error("Failed to load tenant requests list:", error);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6">
      {/* Header section with back navigation */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs">
        <Link
          href="/dashboard/tenant"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Tenant Requests
        </p>
        <h1 className="mt-1.5 text-2xl font-black text-foreground">
          My Rental Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track the status of all your submitted rental applications and
          complete payments for approved listings.
        </p>
      </section>

      {/* Requests table list */}
      <section className="space-y-4">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-70">
            <div className="rounded-full bg-muted p-4 mb-4">
              <GitPullRequest className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-base">
              No requests found
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mb-4">
              You haven't requested to rent any properties yet.
            </p>
            <Button
              render={<Link href="/properties" />}
              className="cursor-pointer gap-2 rounded-xl"
            >
              Find a Property
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4">Property details</th>
                    <th className="px-6 py-4">Requested Move-in</th>
                    <th className="px-6 py-4">Message left</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Payment/Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {requests.map((req: any) => {
                    const status = req.status;
                    const dateFormatted = new Date(
                      req.requestedMoveIn,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                    return (
                      <tr
                        key={req.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground text-base">
                            {req.property?.title || "Property Listing"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="size-3.5" />
                            <span>
                              {req.property?.address
                                ? `${req.property.address}, `
                                : ""}
                              {req.property?.area
                                ? `${req.property.area}, `
                                : ""}
                              {req.property?.city}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-primary mt-1">
                            Rent: ৳
                            {Number(
                              req.property?.rentAmount || 0,
                            ).toLocaleString()}{" "}
                            / month
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-4 text-muted-foreground/75" />
                            <span>{dateFormatted}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-muted-foreground whitespace-pre-line max-w-[250px] line-clamp-3 leading-relaxed">
                            {req.message || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          {status === "APPROVED" ? (
                            <Link
                              href={`/dashboard/tenant/requests/${req.id}/pay`}
                              className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors cursor-pointer"
                            >
                              <CreditCard className="size-4" /> Pay Now
                            </Link>
                          ) : status === "ACTIVE" ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-emerald-600 font-bold bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                                Paid Successfully
                              </span>
                              <ReviewTriggerButton
                                propertyId={req.propertyId}
                                propertyTitle={
                                  req.property?.title || "Property"
                                }
                              />
                            </div>
                          ) : status === "PENDING" ? (
                            <span className="text-xs text-muted-foreground font-medium flex items-center justify-end gap-1.5">
                              <Clock className="size-3.5" /> Waiting for
                              Approval
                            </span>
                          ) : (
                            <span className="text-xs text-destructive font-medium flex items-center justify-end gap-1.5">
                              <HelpCircle className="size-3.5" /> Request
                              Rejected
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
