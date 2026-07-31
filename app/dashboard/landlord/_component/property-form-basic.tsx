import { Property } from "@/components/property-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PropertyFormBasicProps {
  initialData?: Property;
  pending: boolean;
  errors?: Record<string, string[]>;
}

export function PropertyFormBasic({
  initialData,
  pending,
  errors,
}: PropertyFormBasicProps) {
  return (
    <>
      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-semibold text-foreground">
          Property Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          disabled={pending}
          defaultValue={initialData?.title}
          placeholder="e.g. Modern 3-Bedroom Apartment in Dhanmondi"
        />
        {errors?.title?.map((err) => (
          <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
            {err}
          </p>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-semibold text-foreground">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          disabled={pending}
          rows={4}
          defaultValue={initialData?.description}
          placeholder="Describe the key features..."
        />
        {errors?.description?.map((err) => (
          <p key={err} className="text-xs text-destructive mt-0.5 font-medium">
            {err}
          </p>
        ))}
      </div>
    </>
  );
}
