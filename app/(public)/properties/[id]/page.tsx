import { fetchPropertyReviewsAction } from "@/app/dashboard/tenant/_actions/reviews";
import { Property } from "@/components/property-card";
import { apiFetch } from "@/lib/api-client";
import { getAuthenticatedUserData } from "@/lib/auth";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building,
  Check,
  MapPin,
  Maximize2,
  Tag,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyReviews } from "../_components/property-reviews";
import { RequestCTA } from "./_components/request-cta";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  // 1. Fetch Property Details & Reviews in Parallel
  let property: Property | null = null;
  let reviews = [];
  try {
    const [response, reviewsRes] = await Promise.all([
      apiFetch(`/api/properties/${id}`, { cache: "no-store" }),
      fetchPropertyReviewsAction(id),
    ]);

    if (response.ok) {
      const payload = await response.json();
      property = payload?.data || null;
    }

    if (reviewsRes.success) {
      reviews = reviewsRes.data || [];
    }
  } catch (error) {
    console.error("Failed to load property detail data:", error);
  }

  if (!property) {
    notFound();
  }

  // 2. Fetch Session / Auth Status
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = getAuthenticatedUserData(token);
  const isAuthenticated = !!user;

  const locationText = `${property.area ? `${property.area}, ` : ""}${property.city}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Browse</span>
        </Link>
      </div>

      {/* Split screen content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Image gallery (fixed size on desktop) */}
        <div className="rounded-2xl border border-border bg-muted overflow-hidden relative h-[300px] lg:h-[450px] w-full shadow-sm">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/30 flex flex-col items-center justify-center p-8 text-muted-foreground">
              <Building className="size-12 text-primary/80 animate-pulse mb-3" />
              <span className="text-sm font-semibold">No Images Available</span>
            </div>
          )}
        </div>

        {/* Right Side: Details and action stack */}
        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            {property.category && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary border border-primary/10">
                <Tag className="size-3.5" />
                <span>{property.category.name}</span>
              </div>
            )}
            <h1 className="text-3xl font-black tracking-tight text-foreground leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 text-muted-foreground/80 shrink-0" />
              <span>
                {property.address ? `${property.address}, ` : ""}
                {locationText}
              </span>
            </div>
          </div>

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-4 border-y border-border/60 py-3 text-foreground">
            <div className="flex items-center gap-2">
              <Bed className="size-5 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground">
                {property.bedrooms} Beds
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="size-5 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground">
                {property.bathrooms} Baths
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="size-4.5 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground">
                {property.propertySize} sqft
              </span>
            </div>
          </div>

          {/* Description (visible normally without scrollbars) */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-foreground text-sm">Description</h3>
            <p className="text-sm text-muted-foreground/90 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3.5 py-2 text-xs text-foreground font-medium shadow-3xs"
                  >
                    <Check className="size-3.5 text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action block - CTA */}
          <div className="pt-2 border-t border-border/50">
            <RequestCTA
              propertyId={property.id}
              propertyStatus={property.status}
              rentAmount={property.rentAmount}
              isAuthenticated={isAuthenticated}
              userRole={user?.role}
            />
          </div>
        </div>
      </div>

      {/* Property Reviews Section */}
      <PropertyReviews
        propertyId={property.id}
        initialReviews={reviews}
        currentUserId={user?.id}
      />
    </main>
  );
}
