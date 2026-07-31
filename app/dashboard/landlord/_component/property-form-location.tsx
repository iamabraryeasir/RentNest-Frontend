import { Property } from "@/components/property-card";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface PropertyFormLocationProps {
  initialData?: Property;
  pending: boolean;
  errors?: Record<string, string[]>;
}

export function PropertyFormLocation({
  initialData,
  pending,
  errors,
}: PropertyFormLocationProps) {
  return (
    <>
      {/* Location Section Header */}
      <div className="border-b border-border/60 pb-2 pt-2">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <MapPin className="size-4.5 text-primary" /> Location Details
        </h2>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label htmlFor="address" className="text-sm font-semibold text-foreground">
          Street Address
        </label>
        <Input
          id="address"
          name="address"
          type="text"
          required
          disabled={pending}
          defaultValue={initialData?.address}
          placeholder="e.g. House 12, Road 5, Dhanmondi"
        />
        {errors?.address?.map((err) => (
          <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
            {err}
          </p>
        ))}
      </div>

      {/* City, Area, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="city" className="text-sm font-semibold text-foreground">
            City
          </label>
          <Input
            id="city"
            name="city"
            type="text"
            required
            disabled={pending}
            defaultValue={initialData?.city}
            placeholder="e.g. Dhaka"
          />
          {errors?.city?.map((err) => (
            <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
              {err}
            </p>
          ))}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="area" className="text-sm font-semibold text-foreground">
            Area
          </label>
          <Input
            id="area"
            name="area"
            type="text"
            required
            disabled={pending}
            defaultValue={initialData?.area}
            placeholder="e.g. Dhanmondi"
          />
          {errors?.area?.map((err) => (
            <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
              {err}
            </p>
          ))}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="postalCode" className="text-sm font-semibold text-foreground">
            Postal Code
          </label>
          <Input
            id="postalCode"
            name="postalCode"
            type="text"
            required
            disabled={pending}
            defaultValue={initialData?.postalCode}
            placeholder="e.g. 1209"
          />
          {errors?.postalCode?.map((err) => (
            <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
              {err}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
