import { cn } from "@/lib/utils";
import { Bath, Bed, MapPin, Maximize2, Tag } from "lucide-react";
import Link from "next/link";

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  images: string[];
  rentAmount: string;
  bedrooms: number;
  bathrooms: number;
  propertySize: number;
  amenities: string[];
  status: string;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  landlord?: {
    id: string;
    name: string;
    email: string;
  };
}

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const formattedRent = Number(property.rentAmount).toLocaleString();
  const locationText = `${property.area ? `${property.area}, ` : ""}${property.city}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30",
        className,
      )}
    >
      <Link
        href={`/properties/${property.id}`}
        className="flex-1 flex flex-col"
      >
        {/* Card Header (Image or Fallback) */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/40 flex flex-col items-center justify-center p-4 text-muted-foreground transition-transform duration-500 group-hover:scale-105">
              <div className="rounded-full bg-background/80 p-3 shadow-xs">
                <Home className="size-8 text-primary/80 animate-pulse" />
              </div>
            </div>
          )}

          {/* Category Tag */}
          {property.category && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-xs border border-border/40 backdrop-blur-xs">
              <Tag className="size-3 text-primary" />
              <span>{property.category.name}</span>
            </div>
          )}

          {/* Rent Badge */}
          <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground shadow-sm">
            ৳ {formattedRent} / mo
          </div>
        </div>

        {/* Card Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground/80" />
              <span className="truncate">{locationText}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground/85 line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Key Details Row (Bed, Bath, Size) */}
          <div className="grid grid-cols-3 gap-2 border-t border-border/60 mt-4 pt-3.5 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Bed className="size-4 shrink-0 text-muted-foreground/70" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Bath className="size-4 shrink-0 text-muted-foreground/70" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium justify-end">
              <Maximize2 className="size-3.5 shrink-0 text-muted-foreground/70" />
              <span>{property.propertySize} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Inline fallback component import check helper
function Home(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
