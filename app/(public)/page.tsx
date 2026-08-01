import { LogoIcon } from "@/components/logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find & List Rental Properties Easily",
  description:
    "RentNest connects tenants and landlords seamlessly. Browse properties, manage rental requests, make secure payments.",
};

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-12">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 sm:p-12 shadow-xl backdrop-blur-sm">
          {/* Decorative background gradients */}
          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-chart-1/10 blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <LogoIcon iconSize={16} />
                <span>Welcome to RentNest</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Find and list rental properties <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">with ease.</span>
              </h1>
              <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                RentNest connects tenants and landlords seamlessly. Browse properties, manage rental requests, make secure payments, and handle everything in one unified dashboard.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/properties"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Browse Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 font-medium text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Roles/Features Grid */}
        <section className="grid gap-6 sm:grid-cols-3">
          {/* Tenants Card */}
          <div className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
              <Key className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Tenants</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Search curated home listings, send rental applications, track approvals, and pay rent online securely using Stripe.
            </p>
          </div>

          {/* Landlords Card */}
          <div className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Landlords</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Create and manage property listings, receive and review tenant requests, and monitor payouts directly from your dashboard.
            </p>
          </div>

          {/* Admins Card */}
          <div className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Admins</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Moderate listings, manage platform users, activate/block accounts, and oversee system metrics with absolute control.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
