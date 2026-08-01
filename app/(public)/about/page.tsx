import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about RentNest's mission to simplify property rentals for tenants and landlords.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Page Header */}
        <header className="border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            About RentNest
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Connecting tenants and landlords through a modern, reliable rental
            platform.
          </p>
        </header>

        {/* Story & Overview */}
        <section className="space-y-4 text-foreground/90 leading-relaxed">
          <h2 className="text-xl font-bold text-foreground">Who We Are</h2>
          <p>
            RentNest is a property rental platform designed to make finding,
            listing, and renting homes simple, transparent, and secure. Whether
            you are a tenant looking for your next home or a landlord managing
            property listings, RentNest provides a unified system to streamline
            the rental experience.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <h3 className="font-bold text-foreground text-base">Our Mission</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To eliminate friction in property rentals by offering online
              applications, real-time status tracking, and secure payment
              processing.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <h3 className="font-bold text-foreground text-base">Our Vision</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To become a trusted and accessible rental ecosystem for tenants,
              landlords, and property managers alike.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            What RentNest Offers
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5 leading-relaxed">
            <li>
              <strong className="text-foreground">
                Property Search & Filters:
              </strong>{" "}
              Browse listings by location, price range, property category,
              bedrooms, and bathrooms.
            </li>
            <li>
              <strong className="text-foreground">Online Applications:</strong>{" "}
              Submit rental requests directly to landlords and track application
              approvals in real-time.
            </li>
            <li>
              <strong className="text-foreground">Secure Payments:</strong>{" "}
              Process rental checkout payments online securely and maintain
              complete payment history.
            </li>
            <li>
              <strong className="text-foreground">Dashboard Management:</strong>{" "}
              Tailored dashboard portals for tenants, landlords, and system
              administrators.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
