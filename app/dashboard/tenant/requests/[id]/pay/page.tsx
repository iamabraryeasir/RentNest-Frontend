type Props = {
  params: Promise<{ id: string }>;
};

export default async function TenantPayPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Payment Page
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Pay for request #{id}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is the entry point for the payment flow connected to the backend
          checkout endpoint.
        </p>
      </section>
    </main>
  );
}
