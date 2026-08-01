import { fetchPaymentHistoryAction } from "@/app/dashboard/tenant/_actions/payments-extended";
import { ArrowLeft, CreditCard, Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PaymentsTable } from "./_components/payments-table";

export const metadata: Metadata = {
  title: "Payment History",
  description: "View past rental payment receipts and transaction records.",
};

export default async function TenantPaymentHistoryPage() {
  let payments = [];
  try {
    const res = await fetchPaymentHistoryAction();
    if (res.success) {
      payments = res.data || [];
    }
  } catch (error) {
    console.error("Failed to load tenant payment history page:", error);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-4 sm:p-6">
      {/* Header card */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <Link
          href="/dashboard/tenant"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Tenant Dashboard
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Financial Ledger
          </p>
          <h1 className="mt-1.5 text-2xl font-black text-foreground flex items-center gap-2">
            <Receipt className="size-6 text-primary" /> Payment History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review past transactions, completed rental payments, and download or
            print transaction receipts.
          </p>
        </div>
      </section>

      {/* Main payment history table */}
      <section>
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-70">
            <div className="rounded-full bg-muted p-4 mb-4">
              <CreditCard className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-base">
              No payments recorded yet
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mb-4">
              Once you complete payment for an approved rental request,
              transaction records will appear here.
            </p>
            <Link
              href="/dashboard/tenant/requests"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              Check My Requests
            </Link>
          </div>
        ) : (
          <PaymentsTable payments={payments} />
        )}
      </section>
    </main>
  );
}
