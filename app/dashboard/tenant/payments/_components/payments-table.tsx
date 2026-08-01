"use client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Eye } from "lucide-react";
import { useState } from "react";
import { PaymentDetailsModal } from "./payment-details-modal";

interface PaymentsTableProps {
  payments: any[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Transaction Ref</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {payments.map((pm: any) => {
                const formattedDate = pm.createdAt
                  ? new Date(pm.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";
                const amount = pm.amount || pm.rentAmount || 0;
                const propertyTitle =
                  pm.property?.title ||
                  pm.rentalRequest?.property?.title ||
                  "Rental Lease";

                return (
                  <tr
                    key={pm.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[120px]">{pm.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {propertyTitle}
                    </td>
                    <td className="px-6 py-4 font-black text-foreground">
                      ৳{Number(amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={pm.status || "PAID"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPaymentId(pm.id)}
                        className="cursor-pointer gap-1.5 rounded-lg text-xs font-bold hover:bg-muted"
                      >
                        <Eye className="size-3.5 text-muted-foreground" /> View
                        Receipt
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPaymentId && (
        <PaymentDetailsModal
          paymentId={selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
        />
      )}
    </>
  );
}
