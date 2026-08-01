import { apiFetch } from "@/lib/api-client";
import { getAuthenticatedUserData } from "@/lib/auth";
import { ArrowLeft, Users } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { UserManagementTable } from "./_components/user-management-table";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = getAuthenticatedUserData(token);

  const params = await searchParams;
  const page = params.page || "1";
  const limit = params.limit || "5";
  const search = params.search || "";
  const filterRole = params.role || "ALL";
  const status = params.status || "ALL";
  const sortBy = params.sortBy || "name";
  const sortOrder = params.sortOrder || "asc";

  // Build backend API queries
  const query = new URLSearchParams();
  query.set("page", page);
  query.set("limit", limit);
  if (search) query.set("search", search);
  if (filterRole && filterRole !== "ALL") query.set("role", filterRole);
  if (status && status !== "ALL") query.set("status", status);
  query.set("sortBy", sortBy);
  query.set("sortOrder", sortOrder);

  let users = [];
  let meta = {
    total: 0,
    page: Number(page),
    limit: Number(limit),
    totalPages: 1,
  };

  try {
    const res = await apiFetch(`/api/users?${query.toString()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const payload = await res.json();
      users = payload?.data || [];
      if (payload?.meta) {
        meta = {
          total: Number(payload.meta.total || 0),
          page: Number(payload.meta.page || page),
          limit: Number(payload.meta.limit || limit),
          totalPages: Number(
            payload.meta.totalPages ||
              Math.ceil((payload.meta.total || 0) / Number(limit)) ||
              1,
          ),
        };
      } else {
        meta.total = users.length;
      }
    }
  } catch (e) {
    console.error("Failed to load users for admin users page:", e);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6">
      {/* Header section with back button */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Dashboard
          </Link>
        </div>
        <div className="flex items-start gap-4 justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              User Moderation
            </p>
            <h1 className="mt-1.5 text-2xl font-black text-foreground flex items-center gap-2">
              <Users className="size-6 text-primary" /> Manage Platform Users
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Deactivate, block, or delete landlords and tenants accounts who
              violate platform policy.
            </p>
          </div>
        </div>
      </section>

      {/* Main user management table */}
      <UserManagementTable
        users={users}
        currentUserId={user?.id}
        meta={meta}
        filters={{
          page: Number(page),
          limit: Number(limit),
          search,
          role: filterRole,
          status,
          sortBy,
          sortOrder,
        }}
      />
    </main>
  );
}
