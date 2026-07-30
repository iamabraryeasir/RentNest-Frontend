export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-xl border bg-card p-8 shadow-sm text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Payment Success
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          Your payment was completed.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You can now continue to your dashboard or leave a review for the
          property.
        </p>
      </div>
    </main>
  );
}
