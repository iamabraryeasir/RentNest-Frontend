import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-2xl border bg-card p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            RentNest Frontend
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Find and list rental properties with ease.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            This starter app now includes role-based dashboard routes, protected
            access, and the core app shell for the RentNest assignment.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Browse Properties
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <h2 className="font-semibold">Tenants</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover properties and manage your requests.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <h2 className="font-semibold">Landlords</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              List properties and manage incoming rental requests.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <h2 className="font-semibold">Admins</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Moderate users, listings, and platform activity.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
