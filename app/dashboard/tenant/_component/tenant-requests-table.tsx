import { ReviewTriggerButton } from "@/app/payment/_components/review-trigger-button";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

interface TenantRequestsTableProps {
  requests: any[];
}

export function TenantRequestsTable({ requests }: TenantRequestsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Move-In Date</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {requests.slice(0, 5).map((req: any) => {
              const status = req.status;
              const dateFormatted = new Date(
                req.requestedMoveIn,
              ).toLocaleDateString("en-US", {
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
                    <div className="font-semibold text-foreground">
                      {req.property?.title || "Property listing"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {req.property?.city || "Unknown Location"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {dateFormatted}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate">
                    {req.message}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {status === "APPROVED" ? (
                      <Link
                        href={`/dashboard/tenant/requests/${req.id}/pay`}
                        className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
                      >
                        Pay Now
                      </Link>
                    ) : status === "ACTIVE" ? (
                      <ReviewTriggerButton
                        propertyId={req.propertyId}
                        propertyTitle={req.property?.title || "Property"}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">
                        —
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
  );
}
