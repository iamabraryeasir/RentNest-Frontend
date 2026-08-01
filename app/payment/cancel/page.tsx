import { Button } from "@/components/ui/button";
import { getAuthenticatedUserData } from "@/lib/auth";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PaymentCancelPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = getAuthenticatedUserData(token);

  // Protect the route: Only logged-in tenants should view the cancellation status
  if (!token || user?.role !== "tenant") {
    redirect(`/auth/login?redirect=/payment/cancel`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-xs text-center space-y-4">
        <div className="mx-auto rounded-full bg-amber-500/10 p-4 w-fit text-amber-500">
          <AlertCircle className="size-10" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Transaction Cancelled
        </p>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Payment Not Completed
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Your payment was cancelled or was unable to be processed. No charges
          were made to your account.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Button
            render={<Link href="/dashboard/tenant/requests" />}
            className="flex-1 cursor-pointer py-5 rounded-xl font-bold text-sm gap-2"
          >
            <ArrowLeft className="size-4" /> View Rental Requests
          </Button>
          <Button
            variant="outline"
            render={<Link href="/dashboard/tenant" />}
            className="flex-1 cursor-pointer py-5 rounded-xl font-medium text-sm"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
