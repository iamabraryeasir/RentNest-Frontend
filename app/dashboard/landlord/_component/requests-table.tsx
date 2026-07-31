"use client";

import { updateRentalStatusAction } from "@/app/dashboard/landlord/_actions/landlord";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Check, GitPullRequest, Loader2, MessageSquare, User, X } from "lucide-react";
import * as React from "react";
import toast from "react-hot-toast";

export interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  requestedMoveIn: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
  rentAmount: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    rentAmount: string;
  };
  tenant?: {
    id: string;
    email: string;
    name: string;
  };
}

interface RequestsTableProps {
  requests: RentalRequest[];
}

export function RequestsTable({ requests }: RequestsTableProps) {
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [actionType, setActionType] = React.useState<"APPROVE" | "REJECT" | null>(null);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setLoadingId(id);
    setActionType(status === "APPROVED" ? "APPROVE" : "REJECT");

    try {
      const res = await updateRentalStatusAction(id, status);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoadingId(null);
      setActionType(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-[280px]">
        <div className="rounded-full bg-muted p-4 mb-4">
          <GitPullRequest className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-foreground text-base">
          No rental requests
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          When tenants request to book your properties, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <th className="px-6 py-4">Property</th>
            <th className="px-6 py-4">Tenant</th>
            <th className="px-6 py-4">Move-In Date</th>
            <th className="px-6 py-4">Monthly Rent</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-sm">
          {requests.map((req) => {
            const isPending = req.status === "PENDING";
            const isLoading = loadingId === req.id;
            const formattedRent = Number(req.rentAmount || req.property?.rentAmount || 0).toLocaleString();

            const moveInDateFormatted = new Date(req.requestedMoveIn).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <tr key={req.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">
                  {req.property?.title || "Unknown Property"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-2">
                    <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-foreground leading-none">{req.tenant?.name || "Tenant"}</p>
                      <p className="text-xs text-muted-foreground">{req.tenant?.email}</p>
                      {req.message && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded border border-border/40 w-fit">
                          <MessageSquare className="size-3 shrink-0" />
                          <span className="truncate max-w-[200px]" title={req.message}>
                            "{req.message}"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-xs text-foreground font-semibold">
                      {moveInDateFormatted}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-foreground">
                  ৳{formattedRent}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      req.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : req.status === "APPROVED"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : req.status === "REJECTED"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : req.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border/60"
                    )}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {isPending ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => handleAction(req.id, "REJECTED")}
                        className="h-8 rounded-lg font-semibold hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 gap-1 cursor-pointer"
                      >
                        {isLoading && actionType === "REJECT" ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                        <span>Reject</span>
                      </Button>
                      <Button
                        size="sm"
                        disabled={isLoading}
                        onClick={() => handleAction(req.id, "APPROVED")}
                        className="h-8 rounded-lg font-semibold gap-1 cursor-pointer"
                      >
                        {isLoading && actionType === "APPROVE" ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                        <span>Approve</span>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">
                      No Action Required
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
