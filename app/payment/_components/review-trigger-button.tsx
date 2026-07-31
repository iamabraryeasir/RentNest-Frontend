"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import { ReviewModal } from "./review-modal";

interface ReviewTriggerProps {
  propertyId: string;
  propertyTitle: string;
}

// 1. Small inline review button for tables/lists
export function ReviewTriggerButton({
  propertyId,
  propertyTitle,
}: ReviewTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
      >
        <Star className="size-3.5 fill-current text-primary shrink-0" />
        <span>Review</span>
      </button>

      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
      />
    </>
  );
}

// 2. Large CTA button for the Payment Success page
export function SuccessReviewButton({
  propertyId,
  propertyTitle,
}: ReviewTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full cursor-pointer py-6 rounded-xl font-bold text-sm gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-md"
      >
        <Star className="size-4.5 fill-current text-white shrink-0" />
        <span>Leave a Review</span>
      </Button>

      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
      />
    </>
  );
}
