import Link from "next/link";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <Logo iconSize={40} className="text-2xl font-bold" />
          </Link>
        </div>
        <div className="w-full rounded-xl border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose your role and complete the registration flow.
          </p>

          <div className="mt-6 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Registration form and validation will be added here later.
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Already have an account?
            </Link>
            <Link href="/" className="text-primary underline-offset-4 hover:underline">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
