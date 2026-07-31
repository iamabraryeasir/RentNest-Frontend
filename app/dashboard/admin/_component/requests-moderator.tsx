"use client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitPullRequest, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { moderateRentalStatusAction } from "../_actions/admin-actions";

export interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  requestedMoveIn: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
  rentAmount: string | number;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    rentAmount: string | number;
    city: string;
  };
  tenant?: {
    id: string;
    email: string;
    name: string;
  };
}

interface RequestsModeratorProps {
  requests: RentalRequest[];
}

export function RequestsModerator({ requests }: RequestsModeratorProps) {
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = async (
    id: string,
    newStatus: "APPROVED" | "REJECTED" | "PENDING" | "ACTIVE" | "COMPLETED",
  ) => {
    setLoadingId(id);
    startTransition(async () => {
      try {
        const result = await moderateRentalStatusAction(id, newStatus);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error("Failed to update request status.");
      } finally {
        setLoadingId(null);
      }
    });
  };

  const filteredRequests = requests.filter((req) => {
    const search = searchTerm.toLowerCase();
    return (
      (req.property?.title &&
        req.property.title.toLowerCase().includes(search)) ||
      (req.tenant?.name && req.tenant.name.toLowerCase().includes(search)) ||
      (req.tenant?.email && req.tenant.email.toLowerCase().includes(search)) ||
      req.status.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Platform Rental Requests ({filteredRequests.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversee and moderate all rental requests submitted by tenants.
            Force-approve or reject requests if needed.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search by property, tenant or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-[280px]">
          <div className="rounded-full bg-muted p-4 mb-4">
            <GitPullRequest className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground text-base">
            No rental requests found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            {searchTerm
              ? "Try adjusting your search terms."
              : "No rental requests have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Tenant</th>
                  <th className="px-6 py-4">Rent & Move-in</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredRequests.map((req) => {
                  const status = req.status;
                  const isLoading = loadingId === req.id && isPending;
                  const formattedRent = Number(
                    req.rentAmount || req.property?.rentAmount || 0,
                  ).toLocaleString();

                  const moveInDateFormatted = new Date(
                    req.requestedMoveIn,
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground max-w-[200px] truncate">
                          {req.property?.title || "Property listing"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {req.property?.city || "Unknown Location"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {req.tenant?.name || "Unknown Tenant"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {req.tenant?.email || "No Email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        <div className="font-bold text-foreground">
                          ${formattedRent}/mo
                        </div>
                        <div className="mt-0.5">
                          Move-in: {moveInDateFormatted}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 text-xs text-muted-foreground max-w-[180px] truncate"
                        title={req.message}
                      >
                        {req.message || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin text-primary" />
                          ) : (
                            <>
                              {status === "PENDING" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleStatusChange(req.id, "APPROVED")
                                    }
                                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleStatusChange(req.id, "REJECTED")
                                    }
                                    className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 rounded-lg px-2.5 py-1 text-[10px] font-bold"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {status === "APPROVED" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(req.id, "ACTIVE")
                                  }
                                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold"
                                >
                                  Activate
                                </Button>
                              )}
                              {(status === "ACTIVE" ||
                                status === "APPROVED" ||
                                status === "REJECTED") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusChange(req.id, "PENDING")
                                  }
                                  className="cursor-pointer rounded-lg px-2.5 py-1 text-[10px] font-bold"
                                >
                                  Reset PENDING
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
