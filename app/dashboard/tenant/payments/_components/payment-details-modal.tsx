"use client";

import { fetchPaymentDetailsAction } from "@/app/dashboard/tenant/_actions/payments-extended";
import { Button } from "@/components/ui/button";
import {
  Building,
  Calendar,
  CreditCard,
  FileText,
  Loader2,
  Lock,
  Receipt,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PaymentDetailsModalProps {
  paymentId: string;
  onClose: () => void;
}

export function PaymentDetailsModal({
  paymentId,
  onClose,
}: PaymentDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      const res = await fetchPaymentDetailsAction(paymentId);
      if (res.success && res.data) {
        setPayment(res.data);
      } else {
        toast.error("Failed to load payment transaction details.");
      }
      setLoading(false);
    }
    loadDetails();
  }, [paymentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="size-5 text-primary" />
            <h3 className="font-bold text-foreground text-lg">
              Payment Receipt
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <span className="text-xs font-semibold text-muted-foreground">
              Loading transaction details...
            </span>
          </div>
        ) : !payment ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Transaction details unavailable.
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            {/* Status & Amount Banner */}
            <div className="flex items-center justify-between bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                  Payment Status
                </span>
                <span className="font-black text-emerald-700 text-lg uppercase">
                  {payment.status || "PAID"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">
                  Amount Paid
                </span>
                <span className="text-2xl font-black text-foreground">
                  ৳
                  {Number(
                    payment.amount || payment.rentAmount || 0,
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Details breakdown */}
            <div className="space-y-3 border-y border-border/60 py-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <FileText className="size-3.5" /> Transaction ID
                </span>
                <span className="font-mono font-bold text-foreground truncate max-w-[200px]">
                  {payment.id}
                </span>
              </div>

              {payment.stripePaymentIntentId && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="size-3.5" /> Stripe Intent Ref
                  </span>
                  <span className="font-mono text-muted-foreground truncate max-w-[200px]">
                    {payment.stripePaymentIntentId}
                  </span>
                </div>
              )}

              {payment.createdAt && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5" /> Date & Time
                  </span>
                  <span className="font-medium text-foreground">
                    {new Date(payment.createdAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Property associated */}
            {(payment.property || payment.rentalRequest?.property) && (
              <div className="flex items-start gap-3 bg-muted/20 p-3 rounded-xl border border-border/50">
                <Building className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-foreground text-xs">
                    {payment.property?.title ||
                      payment.rentalRequest?.property?.title ||
                      "Property Rental"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {payment.property?.city ||
                      payment.rentalRequest?.property?.city ||
                      "RentNest Listing"}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="w-full cursor-pointer rounded-xl text-xs font-bold gap-2"
              >
                <Lock className="size-3.5 text-emerald-500" /> Print / Save
                Receipt
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
