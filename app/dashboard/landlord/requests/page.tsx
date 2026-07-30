export default function LandlordRequestsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Incoming Requests
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Manage rental requests</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page will later render request approval and rejection actions.
        </p>
      </section>
    </main>
  );
}
