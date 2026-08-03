"use client";

import { Property } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import type { CreatePropertyState } from "@/types";
import { Building, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { PropertyFormBasic } from "./property-form-basic";
import { PropertyFormLocation } from "./property-form-location";
import { PropertyFormSpecs } from "./property-form-specs";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PropertyFormProps {
  mode: "create" | "edit";
  initialData?: Property;
  categories: Category[];
  action: (
    prevState: CreatePropertyState,
    formData: FormData,
  ) => Promise<CreatePropertyState>;
}

const initialState: CreatePropertyState = {
  success: false,
  message: "",
};

export function PropertyForm({
  mode,
  initialData,
  categories,
  action,
}: PropertyFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/landlord");
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const isEdit = mode === "edit";

  return (
    <CardContent className="p-6">
      <form action={formAction} className="space-y-6">
        {/* Hidden identifier if editing */}
        {isEdit && initialData && (
          <input type="hidden" name="propertyId" value={initialData.id} />
        )}

        {/* Form Title Section */}
        <div className="border-b border-border/60 pb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Building className="size-5 text-primary" />{" "}
            {isEdit ? "Edit Listing Details" : "Listing Information"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEdit
              ? "Modify the values below to update your property listing."
              : "Fill in the essential fields to list your property."}
          </p>
        </div>

        <PropertyFormBasic
          initialData={initialData}
          pending={pending}
          errors={state.errors}
        />

        <PropertyFormSpecs
          initialData={initialData}
          pending={pending}
          errors={state.errors}
          categories={categories}
        />

        <PropertyFormLocation
          initialData={initialData}
          pending={pending}
          errors={state.errors}
        />

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
                <Loader2 className="size-4 animate-spin" />{" "}
                {isEdit ? "Saving Changes..." : "Creating Listing..."}
              </>
            ) : (
              <>{isEdit ? "Save Changes" : "Create Listing"}</>
            )}
          </Button>
        </div>
      </form>
    </CardContent>
  );
}
