import { Property } from "@/components/property-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PropertyFormSpecsProps {
  initialData?: Property;
  pending: boolean;
  errors?: Record<string, string[]>;
  categories: Category[];
}

export function PropertyFormSpecs({
  initialData,
  pending,
  errors,
  categories,
}: PropertyFormSpecsProps) {
  return (
    <>
      {/* Pricing, Category & Specs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rent Amount */}
        <div className="space-y-1.5">
          <label htmlFor="rentAmount" className="text-sm font-semibold text-foreground">
            Rent Amount (BDT)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="rentAmount"
              name="rentAmount"
              type="number"
              required
              disabled={pending}
              defaultValue={initialData?.rentAmount}
              placeholder="25000"
              className="pl-9"
            />
          </div>
          {errors?.rentAmount?.map((err) => (
            <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
              {err}
            </p>
          ))}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="text-sm font-semibold text-foreground">
            Category
          </label>
          <Select
            id="categoryId"
            name="categoryId"
            required
            disabled={pending}
            defaultValue={initialData?.categoryId}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
          {errors?.categoryId?.map((err) => (
            <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
              {err}
            </p>
          ))}
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="space-y-1.5">
          <label htmlFor="bedrooms" className="text-sm font-semibold text-foreground">
            Bedrooms
          </label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            required
            disabled={pending}
            defaultValue={initialData?.bedrooms}
            placeholder="3"
          />
          {errors?.bedrooms?.map((err) => (
            <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
              {err}
            </p>
          ))}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="bathrooms" className="text-sm font-semibold text-foreground">
            Bathrooms
          </label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            required
            disabled={pending}
            defaultValue={initialData?.bathrooms}
            placeholder="2"
          />
          {errors?.bathrooms?.map((err) => (
            <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
              {err}
            </p>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="propertySize" className="text-sm font-semibold text-foreground">
            Size (sqft)
          </label>
          <Input
            id="propertySize"
            name="propertySize"
            type="number"
            required
            disabled={pending}
            defaultValue={initialData?.propertySize}
            placeholder="1200"
          />
          {errors?.propertySize?.map((err) => (
            <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
              {err}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
