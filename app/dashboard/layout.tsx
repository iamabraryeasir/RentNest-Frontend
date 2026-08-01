import { getAuthenticatedUserData } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "./_component/dashboard-shell";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | RentNest",
  },
};

export const dynamic = "force-dynamic";

const roleDashboards: Record<string, string> = {
  tenant: "/dashboard/tenant",
  landlord: "/dashboard/landlord",
  admin: "/dashboard/admin",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = getAuthenticatedUserData(token);
  const role = user?.role;

  if (!role || !roleDashboards[role]) {
    redirect("/auth/login?redirect=/dashboard");
  }

  return (
    <DashboardShell user={user || {}} role={role}>
      {children}
    </DashboardShell>
  );
}
