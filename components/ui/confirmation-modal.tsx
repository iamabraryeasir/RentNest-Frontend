"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "primary";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false,
  icon,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const defaultIcon =
    variant === "destructive" ? (
      <Trash2 className="size-6" />
    ) : (
      <AlertTriangle className="size-6" />
    );

  const iconContainerStyles =
    variant === "destructive"
      ? "bg-rose-500/10 border-rose-500/20 text-rose-600"
      : "bg-amber-500/10 border-amber-500/20 text-amber-600";

  const confirmBtnStyles =
    variant === "destructive"
      ? "bg-rose-600 hover:bg-rose-700 text-white border-none"
      : "bg-primary hover:bg-primary/90 text-primary-foreground border-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center space-y-3.5">
          <div
            className={`rounded-full p-3.5 border ${iconContainerStyles}`}
          >
            {icon || defaultIcon}
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-foreground text-lg leading-tight">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 cursor-pointer py-4.5 rounded-xl font-semibold text-sm hover:bg-muted"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 cursor-pointer py-4.5 rounded-xl font-bold text-sm ${confirmBtnStyles}`}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
