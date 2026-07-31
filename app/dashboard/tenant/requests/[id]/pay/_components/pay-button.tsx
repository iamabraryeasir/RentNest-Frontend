"use client";

import { createCheckoutSessionAction } from "@/app/dashboard/tenant/_actions/payments";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import * as React from "react";
import toast from "react-hot-toast";

interface PayButtonProps {
  rentalId: string;
}

export function PayButton({ rentalId }: PayButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    setLoading(true);
    toast.loading("Redirecting to secure payment page...", { id: "payment" });

    try {
      const result = await createCheckoutSessionAction(rentalId);

      if (result.success && result.url) {
        toast.success("Checkout session created! Redirecting...", {
          id: "payment",
        });
        window.location.href = result.url;
      } else {
        toast.error(result.message || "Failed to start payment process.", {
          id: "payment",
        });
        setLoading(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        id: "payment",
      });
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full cursor-pointer py-6 rounded-xl font-bold gap-2 text-sm shadow-md transition-transform active:scale-[0.98] bg-amber-500 hover:bg-amber-600 text-white"
    >
      {loading ? (
        <>
          <Loader2 className="size-4.5 animate-spin" /> Preparing Payment
          Gateway...
        </>
      ) : (
        <>
          <CreditCard className="size-4.5" /> Pay Now with Stripe
        </>
      )}
    </Button>
  );
}
