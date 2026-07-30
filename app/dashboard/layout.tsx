import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const role = cookieStore.get("role")?.value;

  if (!role || !roleDashboards[role]) {
    redirect("/auth/login?redirect=/dashboard");
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
