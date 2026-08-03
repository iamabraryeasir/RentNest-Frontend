"use client";

import {
  deleteUserAction,
  fetchUserByIdAction,
  toggleUserStatusAction,
} from "@/app/dashboard/admin/users/_actions/user-actions";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import type { DashboardUser } from "@/types";
import {
  Ban,
  CheckCircle2,
  Loader2,
  Mail,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
}

export function UserDetailsModal({ userId, onClose }: UserDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      const res = await fetchUserByIdAction(userId);
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        toast.error("Failed to load user details.");
      }
      setLoading(false);
    }
    loadUser();
  }, [userId]);

  const handleToggleStatus = async () => {
    if (!user) return;
    setActionLoading(true);
    const nextStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const res = await toggleUserStatusAction(user.id, user.status ?? "ACTIVE");
    if (res.success) {
      toast.success(res.message);
      setUser({ ...user, status: nextStatus });
    } else {
      toast.error(res.message);
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!user) return;
    if (
      !confirm(
        `Are you sure you want to delete user ${user.name || user.email}?`,
      )
    ) {
      return;
    }
    setActionLoading(true);
    const res = await deleteUserAction(user.id);
    if (res.success) {
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
    }
    setActionLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-card border-l border-border p-6 shadow-2xl space-y-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <h3 className="font-bold text-foreground text-lg">
                User Profile Inspection
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="size-8 text-primary animate-spin" />
              <span className="text-xs font-semibold text-muted-foreground">
                Fetching user details from /api/users/:id...
              </span>
            </div>
          ) : !user ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              User details could not be found.
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Avatar Card */}
              <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/60">
                <div className="rounded-full bg-primary/10 p-4 text-primary font-bold text-xl uppercase flex items-center justify-center size-14 shrink-0">
                  {user.name ? (
                    user.name.charAt(0)
                  ) : (
                    <User className="size-6" />
                  )}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h4 className="font-bold text-foreground text-base truncate">
                    {user.name || "Unnamed User"}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                    <Mail className="size-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Status and Role badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card p-3 rounded-xl border border-border space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Account Status
                  </span>
                  <StatusBadge status={user.status || "ACTIVE"} />
                </div>

                <div className="bg-card p-3 rounded-xl border border-border space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Platform Role
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary uppercase border border-primary/20">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Details table */}
              <div className="space-y-3 border-t border-border/60 pt-4">
                <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  System Identifiers
                </h5>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">
                      User ID
                    </span>
                    <span className="font-mono font-bold text-foreground truncate max-w-45">
                      {user.id}
                    </span>
                  </div>

                  {user.createdAt && (
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">
                        Joined Date
                      </span>
                      <span className="font-medium text-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {user.updatedAt && (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground font-medium">
                        Last Modified
                      </span>
                      <span className="font-medium text-foreground">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {user && (
          <div className="border-t border-border/60 pt-4 space-y-2">
            <Button
              onClick={handleToggleStatus}
              disabled={actionLoading}
              variant="outline"
              className={`w-full cursor-pointer rounded-xl text-xs font-bold gap-2 py-5 ${
                user.status === "ACTIVE"
                  ? "hover:bg-amber-500/10 hover:text-amber-600 border-amber-500/30 text-amber-600"
                  : "hover:bg-emerald-500/10 hover:text-emerald-600 border-emerald-500/30 text-emerald-600"
              }`}
            >
              {actionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : user.status === "ACTIVE" ? (
                <>
                  <Ban className="size-4" /> Block User Account
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" /> Activate User Account
                </>
              )}
            </Button>

            <Button
              onClick={handleDelete}
              disabled={actionLoading}
              className="w-full cursor-pointer rounded-xl text-xs font-bold gap-2 py-5 bg-rose-600 hover:bg-rose-700 text-white"
            >
              {actionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="size-4" /> Delete User Permanently
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
