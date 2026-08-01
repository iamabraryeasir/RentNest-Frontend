import { apiFetch } from "@/lib/api-client";
import { getAuthenticatedUserData } from "@/lib/auth";
import { CheckCircle2, Home } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SuccessReviewButton } from "../_components/review-trigger-button";

type Props = {
  searchParams: Promise<{ propertyId?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = getAuthenticatedUserData(token);

  // Protect the route: Only logged-in tenants can access payment success details
  if (!token || user?.role !== "tenant") {
    redirect(`/auth/login?redirect=/payment/success`);
  }

  const { propertyId } = await searchParams;

  let finalPropertyId = propertyId;
  let propertyTitle = "";

  // If a propertyId was passed in search params, fetch its details
  if (finalPropertyId) {
    try {
      const response = await apiFetch(`/api/properties/${finalPropertyId}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const payload = await response.json();
        propertyTitle = payload?.data?.title || "your rented property";
      }
    } catch (error) {
      console.error("Failed to load property details on success page:", error);
    }
  } else {
    // Smart fallback: If no propertyId is in query param, lookup the tenant's latest ACTIVE booking
    try {
      const response = await apiFetch("/api/rentals/my-requests", {
        cache: "no-store",
      });
      if (response.ok) {
        const payload = await response.json();
        const requests = payload?.data || [];
        // Find the latest active booking
        const latestActive = requests.find((r: any) => r.status === "ACTIVE");
        if (latestActive) {
          finalPropertyId = latestActive.propertyId;
          propertyTitle =
            latestActive.property?.title || "your rented property";
        }
      }
    } catch (error) {
      console.error("Failed to fallback search for active booking:", error);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16 gap-6">
      {/* Success banner card */}
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-xs text-center space-y-4">
        <div className="mx-auto rounded-full bg-emerald-500/10 p-4 w-fit text-emerald-500">
          <CheckCircle2 className="size-10" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Payment Completed
        </p>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Thank you for your payment!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Your lease transaction has been completed successfully. The property
          status is now updated to active.
        </p>

        <div className="pt-2">
          <Link
            href="/dashboard/tenant"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <Home className="size-4" /> Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Review trigger CTA if a property is found to review */}
      {finalPropertyId && (
        <div className="w-full">
          <SuccessReviewButton
            propertyId={finalPropertyId}
            propertyTitle={propertyTitle}
          />
        </div>
      )}
    </main>
  );
}
