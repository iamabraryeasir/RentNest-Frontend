"use client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Shield,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  deleteUserAction,
  toggleUserStatusAction,
} from "../_actions/user-actions";
import { UserDetailsModal } from "./user-details-modal";
import { UserManagementFilters } from "./user-management-filters";

import type { User } from "@/types";

interface UserManagementTableProps {
  users: User[];
  currentUserId?: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    page: number;
    limit: number;
    search: string;
    role: string;
    status: string;
    sortBy: string;
    sortOrder: string;
  };
}

export function UserManagementTable({
  users,
  currentUserId,
  meta,
  filters,
}: UserManagementTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // General URL query synchronizer
  const updateQuery = (
    newParams: Record<string, string | number | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === "" || val === "ALL") {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    // Reset pagination to page 1 on active search/filter adjustments
    if (!newParams.hasOwnProperty("page") && newParams.page === undefined) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debouncing effect for search parameter

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (id === currentUserId) {
      toast.error("You cannot block your own admin account.");
      return;
    }

    setLoadingId(id);
    try {
      const result = await toggleUserStatusAction(id, currentStatus);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to update user status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUserId) {
      toast.error("You cannot delete your own admin account.");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this user? This will also remove any related listings and bookings.",
      )
    ) {
      return;
    }

    setLoadingId(id);
    try {
      const result = await deleteUserAction(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to delete user.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <UserManagementFilters
        filters={filters}
        isPending={isPending}
        updateQuery={updateQuery}
      />

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-[280px]">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Shield className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground text-base">
            No users matched this query
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            {filters.search ||
            filters.role !== "ALL" ||
            filters.status !== "ALL"
              ? "Try resetting advanced filters or adjusting search queries."
              : "No users exist in the platform database."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm relative">
            {isPending && (
              <div className="absolute inset-0 bg-background/55 backdrop-blur-xs flex items-center justify-center z-10 transition-opacity">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {users.map((user) => {
                    const status = user.status || "ACTIVE";
                    const isCurrent = user.id === currentUserId;
                    const isLoading = loadingId === user.id;

                    const joinedDate = user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A";

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            {user.name}
                            {isCurrent && (
                              <span className="rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[9px] font-black uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              user.role === "ADMIN"
                                ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                : user.role === "LANDLORD"
                                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {joinedDate}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isLoading ? (
                              <Loader2 className="size-4 animate-spin text-primary mr-2" />
                            ) : (
                              <>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => setSelectedUserId(user.id)}
                                  className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
                                  title="Inspect User Details"
                                >
                                  <Eye className="size-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() =>
                                    handleToggleStatus(user.id, status)
                                  }
                                  disabled={isCurrent}
                                  className={`size-8 rounded-lg cursor-pointer ${
                                    status === "ACTIVE"
                                      ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                                      : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                  }`}
                                  title={
                                    status === "ACTIVE"
                                      ? "Block User"
                                      : "Activate User"
                                  }
                                >
                                  {status === "ACTIVE" ? (
                                    <UserX className="size-3.5" />
                                  ) : (
                                    <UserCheck className="size-3.5" />
                                  )}
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={isCurrent}
                                  className="size-8 rounded-lg cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                                  title="Delete User Account"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
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

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border bg-card p-4 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-muted-foreground">
                Showing page {meta.page} of {meta.totalPages} ({meta.total}{" "}
                total users)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuery({ page: meta.page - 1 })}
                  disabled={meta.page <= 1 || isPending}
                  className="cursor-pointer gap-1 px-3.5 rounded-xl font-bold text-xs"
                >
                  <ChevronLeft className="size-3.5" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuery({ page: meta.page + 1 })}
                  disabled={meta.page >= meta.totalPages || isPending}
                  className="cursor-pointer gap-1 px-3.5 rounded-xl font-bold text-xs"
                >
                  Next <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
