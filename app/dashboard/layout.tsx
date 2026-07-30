import { Logo } from "@/components/logo";
import { UserDropdown } from "@/components/user-dropdown";
import { getAuthenticatedUserData } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";
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
  const token = cookieStore.get("accessToken")?.value;
  const user = getAuthenticatedUserData(token);

  if (!role || !roleDashboards[role]) {
    redirect("/auth/login?redirect=/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dashboard Top Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo iconSize={28} />
            </Link>
            <span className="h-5 w-px bg-border hidden sm:block" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hidden sm:block">
              Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user && <UserDropdown user={user} />}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 bg-background">{children}</div>
    </div>
  );
}
