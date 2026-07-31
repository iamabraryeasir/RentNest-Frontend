"use client";

import {
  submitReviewAction,
  type ReviewState,
} from "@/app/dashboard/tenant/_actions/reviews";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import toast from "react-hot-toast";

interface ReviewFormProps {
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

const initialState: ReviewState = {
  success: false,
  message: "",
};

export function ReviewForm({
  propertyId,
  propertyTitle,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState("");
  const [state, formAction, pending] = React.useActionState(
    submitReviewAction,
    initialState,
  );
  const router = useRouter();

  React.useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setComment("");
      setRating(5);
      if (onSuccess) {
        onSuccess();
      } else {
        // Wait a moment and redirect to tenant dashboard
        setTimeout(() => {
          router.push("/dashboard/tenant");
          router.refresh();
        }, 1500);
      }
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router, onSuccess]);

  return (
    <div className="w-full bg-card rounded-2xl border border-border/80 p-6 shadow-xs space-y-6">
      <div className="border-b border-border/60 pb-3">
        <h3 className="font-bold text-foreground text-base">
          Share Your Experience
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
          How was your renting experience for{" "}
          <strong className="text-foreground">{propertyTitle}</strong>?
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {/* Hidden Fields */}
        <input type="hidden" name="propertyId" value={propertyId} />
        <input type="hidden" name="rating" value={rating} />

        {/* Rating Stars Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Your Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((starValue) => {
              const isActive =
                hoverRating !== null
                  ? starValue <= hoverRating
                  : starValue <= rating;
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(null)}
                  disabled={pending}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer disabled:opacity-50"
                >
                  <Star
                    className={`size-8 transition-colors ${
                      isActive
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/35 fill-none"
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-bold text-muted-foreground ml-2">
              {rating} / 5 Stars
            </span>
          </div>
          {state.errors?.rating?.map((err) => (
            <p
              key={err}
              className="text-xs text-destructive mt-0.5 font-medium"
            >
              {err}
            </p>
          ))}
        </div>

        {/* Review Comment */}
        <div className="space-y-1.5">
          <label
            htmlFor="comment"
            className="text-xs font-bold text-foreground uppercase tracking-wider block"
          >
            Review Comment
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
            <textarea
              id="comment"
              name="comment"
              required
              rows={3}
              disabled={pending}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other tenants about the landlord response, property condition, and neighbor atmosphere..."
              className="w-full pl-9 pr-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-50 resize-none"
            />
          </div>
          {state.errors?.comment?.map((err) => (
            <p
              key={err}
              className="text-xs text-destructive mt-0.5 font-medium"
            >
              {err}
            </p>
          ))}
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={pending || state.success}
            className="w-full cursor-pointer py-6 rounded-xl font-bold text-sm gap-2"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Submitting Review...
              </>
            ) : state.success ? (
              "Review Submitted!"
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
