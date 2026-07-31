"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect } from "react";
import { ReviewForm } from "./review-form";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
}: ReviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Close Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 cursor-pointer"
        >
          <X className="size-5" />
        </Button>

        {/* Form Container */}
        <ReviewForm
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          onSuccess={() => {
            setTimeout(() => {
              onClose();
            }, 1500);
          }}
        />
      </div>
    </div>
  );
}
