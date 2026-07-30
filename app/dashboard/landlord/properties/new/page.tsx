export default function NewPropertyPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          New Property
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Create a new listing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This form will later connect to the landlord property creation API.
        </p>
      </section>
    </main>
  );
}
