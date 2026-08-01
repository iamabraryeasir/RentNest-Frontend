import { getAuthenticatedUserData } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const roleDashboards: Record<string, string> = {
  tenant: "/dashboard/tenant",
  landlord: "/dashboard/landlord",
  admin: "/dashboard/admin",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = getAuthenticatedUserData(token);
  const role = user?.role;

  if (!role || !roleDashboards[role]) {
    redirect("/auth/login?redirect=/dashboard");
  }

  redirect(roleDashboards[role]);
}
