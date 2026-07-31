"use client";

import {
  createPropertyAction,
  type CreatePropertyState,
} from "@/app/dashboard/landlord/_actions/landlord";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Building,
  DollarSign,
  Loader2,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CreatePropertyFormProps {
  categories: Category[];
}

const initialState: CreatePropertyState = {
  success: false,
  message: "",
};

export function CreatePropertyForm({ categories }: CreatePropertyFormProps) {
  const [state, formAction, pending] = useActionState(
    createPropertyAction,
    initialState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/landlord");
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <CardContent className="p-6">
      <form action={formAction} className="space-y-6">
        {/* Form Title Section */}
        <div className="border-b border-border/60 pb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Building className="size-5 text-primary" /> Listing Information
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fill in the essential fields to list your property.
          </p>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-foreground"
          >
            Property Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={pending}
            placeholder="e.g. Modern 3-Bedroom Apartment in Dhanmondi"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
          {state.errors?.title?.map((err) => (
            <p
              key={err}
              className="text-xs text-destructive mt-0.5 font-medium"
            >
              {err}
            </p>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-foreground"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            disabled={pending}
            rows={4}
            placeholder="Describe the key features, house rules, and nearby points of interest..."
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
          {state.errors?.description?.map((err) => (
            <p
              key={err}
              className="text-xs text-destructive mt-0.5 font-medium"
            >
              {err}
            </p>
          ))}
        </div>

        {/* Pricing, Category & Specs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rent Amount */}
          <div className="space-y-1.5">
            <label
              htmlFor="rentAmount"
              className="text-sm font-semibold text-foreground"
            >
              Rent Amount (BDT)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="rentAmount"
                name="rentAmount"
                type="number"
                required
                disabled={pending}
                placeholder="25000"
                className="w-full pl-9 pr-4 py-2.5 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50"
              />
            </div>
            {state.errors?.rentAmount?.map((err) => (
              <p
                key={err}
                className="text-xs text-destructive mt-0.5 font-medium"
              >
                {err}
              </p>
            ))}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label
              htmlFor="categoryId"
              className="text-sm font-semibold text-foreground"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              disabled={pending}
              className="w-full px-4 py-2.5 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground cursor-pointer disabled:opacity-50"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {state.errors?.categoryId?.map((err) => (
              <p
                key={err}
                className="text-xs text-destructive mt-0.5 font-medium"
              >
                {err}
              </p>
            ))}
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="space-y-1.5">
            <label
              htmlFor="bedrooms"
              className="text-sm font-semibold text-foreground"
            >
              Bedrooms
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              required
              disabled={pending}
              placeholder="3"
              className="w-full px-4 py-2.5 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50"
            />
            {state.errors?.bedrooms?.map((err) => (
              <p
                key={err}
                className="text-xs text-destructive mt-0.5 font-medium"
              >
                {err}
              </p>
            ))}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="bathrooms"
              className="text-sm font-semibold text-foreground"
            >
              Bathrooms
            </label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              required
              disabled={pending}
              placeholder="2"
              className="w-full px-4 py-2.5 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50"
            />
            {state.errors?.bathrooms?.map((err) => (
              <p
                key={err}
                className="text-xs text-destructive mt-0.5 font-medium"
              >
                {err}
              </p>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Property Size */}
          <div className="space-y-1.5">
            <label
              htmlFor="propertySize"
              className="text-sm font-semibold text-foreground"
            >
              Size (sqft)
            </label>
            <input
              id="propertySize"
              name="propertySize"
              type="number"
              required
              disabled={pending}
              placeholder="1200"
              className="w-full px-4 py-2.5 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50"
            />
            {state.errors?.propertySize?.map((err) => (
              <p
                key={err}
                className="text-xs text-destructive mt-0.5 font-medium"
              >
                {err}
              </p>
            ))}
          </div>
        </div>

        {/* Location Section Header */}
        <div className="border-b border-border/60 pb-2 pt-2">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <MapPin className="size-4.5 text-primary" /> Location Details
          </h2>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label
            htmlFor="address"
            className="text-sm font-semibold text-foreground"
          >
            Street Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            disabled={pending}
            placeholder="e.g. House 12, Road 5, Dhanmondi"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
          {state.errors?.address?.map((err) => (
            <p
              key={err}
              className="text-xs text-destructive mt-0.5 font-medium"
            >
              {err}
            </p>
          ))}
        </div>

        {/* City, Area, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="city"
              className="text-sm font-semibold text-foreground"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              disabled={pending}
              placeholder="e.g. Dhaka"
              className="w-full px-4 py-2.5 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50"
            />
            {state.errors?.city?.map((err) => (
              <p
                key={err}
                className="text-xs text-destructive mt-0.5 font-medium"
              >
                {err}
              </p>
            ))}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="area"
              className="text-sm font-semibold text-foreground"
            >
              Area
            </label>
            <input
              id="area"
              name="area"
              type="text"
              required
              disabled={pending}
              placeholder="e.g. Dhanmondi"
              className="w-full px-4 py-2.5 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50"
            />
            {state.errors?.area?.map((err) => (
              <p
                key={err}
                className="text-xs text-destructive mt-0.5 font-medium"
              >
                {err}
              </p>
            ))}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="postalCode"
              className="text-sm font-semibold text-foreground"
            >
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              required
              disabled={pending}
              placeholder="e.g. 1209"
              className="w-full px-4 py-2.5 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50"
            />
            {state.errors?.postalCode?.map((err) => (
              <p
                key={err}
                className="text-xs text-destructive mt-0.5 font-medium"
              >
                {err}
              </p>
            ))}
          </div>
        </div>



        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => router.push("/dashboard/landlord")}
            className="flex-1 py-5 rounded-xl cursor-pointer font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={pending}
            className="flex-1 py-5 rounded-xl cursor-pointer font-bold gap-2"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating Listing...
              </>
            ) : (
              "Create Listing"
            )}
          </Button>
        </div>
      </form>
    </CardContent>
  );
}
