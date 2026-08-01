import { fetchMeAction } from "@/app/dashboard/_actions/profile-actions";
import { getAuthenticatedUserData } from "@/lib/auth";
import { ArrowLeft, UserCheck } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "./_components/profile-form";

export const metadata: Metadata = {
  title: "Account Profile",
  description: "View and update your personal account profile information.",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  // Fetch current user details via GET /api/auth/me
  const meResult = await fetchMeAction();
  const decodedUser = getAuthenticatedUserData(token);

  const initialUser = {
    name: meResult?.data?.name || meResult?.data?.user?.name || "",
    email:
      meResult?.data?.email ||
      meResult?.data?.user?.email ||
      decodedUser?.email ||
      "",
    role:
      meResult?.data?.role ||
      meResult?.data?.user?.role ||
      decodedUser?.role ||
      "",
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-4 sm:p-6">
      {/* Header card */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Account Management
          </p>
          <h1 className="mt-1.5 text-2xl font-black text-foreground flex items-center gap-2">
            <UserCheck className="size-6 text-primary" /> Profile Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your account details and profile information.
          </p>
        </div>
      </section>

      {/* Main settings form */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs">
        <ProfileForm initialUser={initialUser} />
      </section>
    </main>
  );
}
