import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandlordDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "landlord") {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Landlord Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Manage your properties</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review incoming requests, keep your listings updated, and stay on top
          of your rental activity.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Properties</p>
          <p className="mt-2 text-2xl font-semibold">8</p>
        </div>
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Incoming Requests</p>
          <p className="mt-2 text-2xl font-semibold">2</p>
        </div>
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Monthly Earnings</p>
          <p className="mt-2 text-2xl font-semibold">$4,200</p>
        </div>
      </section>
    </main>
  );
}
