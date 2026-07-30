import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use this placeholder page for the authentication flow.
        </p>

        <div className="mt-6 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Login form and validation will be added here later.
        </div>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/auth/register" className="text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
          <Link href="/" className="text-primary underline-offset-4 hover:underline">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
