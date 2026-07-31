"use client";

import {
  submitRentalRequestAction,
  type RentalRequestState,
} from "@/app/(public)/_actions/rentals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, HelpCircle, Loader2, Lock, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface RequestCTAProps {
  propertyId: string;
  propertyStatus: string;
  rentAmount: string;
  isAuthenticated: boolean;
  userRole?: string;
}

const initialState: RentalRequestState = {
  success: false,
  message: "",
};

export function RequestCTA({
  propertyId,
  propertyStatus,
  rentAmount,
  isAuthenticated,
  userRole,
}: RequestCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitRentalRequestAction,
    initialState,
  );
  const router = useRouter();

  const formattedRent = Number(rentAmount).toLocaleString();
  const isAvailable = propertyStatus === "AVAILABLE";
  const isTenant = userRole === "tenant";

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
      router.refresh();
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  // Set default dates (start date = tomorrow)
  const tomorrowStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  return (
    <>
      <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden shrink-0">
        {/* Header containing rent and availability status badge */}
        <div className="bg-primary/5 px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-0.5">
              Monthly Rent
            </span>
            <div className="flex items-baseline gap-0.5 text-foreground">
              <span className="text-2xl font-black">৳{formattedRent}</span>
              <span className="text-xs text-muted-foreground font-medium">
                / month
              </span>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              isAvailable
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : propertyStatus === "RENTED"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-muted text-muted-foreground border-border/60",
            )}
          >
            {propertyStatus}
          </span>
        </div>

        {/* Action Button Container */}
        <CardContent className="p-6 space-y-4">
          {!isAuthenticated ? (
            <div className="space-y-3">
              <Button
                render={
                  <Link
                    href={`/auth/login?redirect=/properties/${propertyId}`}
                  />
                }
                className="w-full font-bold cursor-pointer rounded-xl py-6 text-sm"
              >
                Sign In to Request
              </Button>
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                <Lock className="size-3.5" /> Requires tenant account
                registration.
              </p>
            </div>
          ) : !isAvailable ? (
            <Button
              className="w-full font-semibold rounded-xl py-6 text-sm"
              disabled
            >
              Unavailable for Rent
            </Button>
          ) : isTenant ? (
            <Button
              onClick={() => setIsOpen(true)}
              className="w-full font-bold cursor-pointer rounded-xl py-6 text-sm transition-transform active:scale-[0.98]"
            >
              Request to Rent
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                className="w-full font-semibold rounded-xl py-6 text-sm"
                disabled
              >
                Request to Rent
              </Button>
              <p className="text-xs text-destructive text-center flex items-center justify-center gap-1.5 font-medium bg-destructive/5 py-2 px-3 rounded-xl border border-destructive/10">
                <HelpCircle className="size-4" /> Only tenant accounts can
                request.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Popup Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div>
                <h3 className="font-bold text-foreground text-lg">
                  Submit Rental Request
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Send a booking request to the landlord.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form action={formAction} className="mt-4 space-y-4">
              <input type="hidden" name="propertyId" value={propertyId} />

              {/* Move-In Date */}
              <div className="space-y-1.5">
                <label
                  htmlFor="requestedMoveIn"
                  className="text-xs font-bold text-foreground uppercase tracking-wider block"
                >
                  Requested Move-In Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="requestedMoveIn"
                    name="requestedMoveIn"
                    type="date"
                    required
                    disabled={pending}
                    defaultValue={tomorrowStr}
                    min={tomorrowStr}
                    className="w-full pl-9 pr-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                {state.errors?.requestedMoveIn?.map((err) => (
                  <p key={err} className="text-xs text-destructive mt-0.5">
                    {err}
                  </p>
                ))}
              </div>

              {/* Message to Landlord */}
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-xs font-bold text-foreground uppercase tracking-wider block"
                >
                  Message to Landlord
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  disabled={pending}
                  defaultValue="I'm interested in renting this property."
                  placeholder="Introduce yourself or leave a message for the landlord..."
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50 resize-none"
                />
                {state.errors?.message?.map((err) => (
                  <p key={err} className="text-xs text-destructive mt-0.5">
                    {err}
                  </p>
                ))}
              </div>

              {/* Tips or Summary info */}
              <div className="bg-primary/5 rounded-xl p-3.5 border border-primary/10">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-1">
                  Rental Agreement Estimate
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The initial monthly rent is set at{" "}
                  <strong className="text-foreground">৳{formattedRent}</strong>.
                  Final lease duration is subject to landlord verification.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 pt-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 cursor-pointer py-5 rounded-xl font-medium text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={pending}
                  className="flex-1 cursor-pointer py-5 rounded-xl font-bold text-sm gap-2"
                >
                  {pending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
