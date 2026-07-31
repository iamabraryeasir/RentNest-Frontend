import { apiFetch } from "@/lib/api-client";
import {
  ArrowLeft,
  Building,
  Calendar,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PayButton } from "./_components/pay-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TenantPayPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "tenant") {
    redirect("/dashboard");
  }

  let rental: any = null;
  try {
    const response = await apiFetch(`/api/rentals/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const payload = await response.json();
      rental = payload?.data || null;
    }
  } catch (error) {
    console.error("Failed to load rental details for checkout:", error);
  }

  if (!rental) {
    notFound();
  }

  // Double check that only the requesting tenant can view this invoice
  // and that the status is indeed APPROVED
  if (rental.status !== "APPROVED") {
    // If already paid or not approved, send them back to requests list
    redirect("/dashboard/tenant/requests");
  }

  const property = rental.property || {};
  const formattedRent = Number(property.rentAmount || 0).toLocaleString();
  const dateFormatted = new Date(rental.requestedMoveIn).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/tenant/requests"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Requests</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Side: Invoice details & summary (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <section className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
            <div className="border-b border-border/60 pb-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                Booking Approved
              </span>
              <h1 className="text-2xl font-black text-foreground">
                Checkout Summary
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review your rental details and billing invoice below.
              </p>
            </div>

            {/* Property Summary Card */}
            <div className="flex gap-4 items-start bg-muted/30 p-4 rounded-xl border border-border/50">
              <div className="rounded-lg bg-primary/10 p-2.5 shrink-0 text-primary">
                <Building className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-foreground text-sm leading-snug">
                  {property.title || "Rental Property"}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span>
                    {property.address ? `${property.address}, ` : ""}
                    {property.area ? `${property.area}, ` : ""}
                    {property.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Rental terms detail list */}
            <div className="space-y-4">
              <h3 className="font-bold text-foreground text-sm border-b border-border/60 pb-2">
                Lease Terms
              </h3>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  Requested Move-In Date
                </span>
                <span className="font-bold text-foreground">
                  {dateFormatted}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4" />
                  Booking Status
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 uppercase border border-blue-500/25">
                  {rental.status}
                </span>
              </div>

              {rental.message && (
                <div className="bg-muted/10 border border-border/55 rounded-xl p-3 text-xs space-y-1">
                  <span className="font-bold text-muted-foreground">
                    Your Message:
                  </span>
                  <p className="text-muted-foreground/90 italic">
                    "{rental.message}"
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Side: Invoice pricing breakdown & CTA (1 col) */}
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-foreground text-sm border-b border-border/60 pb-2">
              Payment Details
            </h3>

            {/* Calculation */}
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>First Month's Rent</span>
                <span>৳{formattedRent}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Security Deposit</span>
                <span>৳0</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground border-b border-border/60 pb-3">
                <span>Service Fee</span>
                <span>৳0</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-foreground">
                  Total Due
                </span>
                <span className="text-2xl font-black text-foreground">
                  ৳{formattedRent}
                </span>
              </div>
            </div>

            {/* Secure CTA Button */}
            <div className="space-y-3 pt-2">
              <PayButton rentalId={rental.id} />
              <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1 bg-muted/20 py-2 px-3 rounded-xl border border-border/50">
                <Lock className="size-3.5 text-emerald-500 shrink-0" />
                <span>SSL Encrypted Secure Transaction</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
