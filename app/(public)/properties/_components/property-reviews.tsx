"use client";

import {
  deleteReviewAction,
  updateReviewAction,
} from "@/app/dashboard/tenant/_actions/reviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2, MessageSquare, Star, Trash2, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import type { Review as ReviewItem } from "@/types";

interface PropertyReviewsProps {
  propertyId: string;
  initialReviews: ReviewItem[];
  currentUserId?: string;
}

export function PropertyReviews({
  propertyId,
  initialReviews,
  currentUserId,
}: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const startEdit = (review: ReviewItem) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (reviewId: string) => {
    setLoadingId(reviewId);
    try {
      const res = await updateReviewAction(
        reviewId,
        propertyId,
        editRating,
        editComment,
      );
      if (res.success) {
        toast.success(res.message);
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, rating: editRating, comment: editComment }
              : r,
          ),
        );
        setEditingId(null);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("Failed to update review.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    setLoadingId(reviewId);
    try {
      const res = await deleteReviewAction(reviewId, propertyId);
      if (res.success) {
        toast.success(res.message);
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("Failed to delete review.");
    } finally {
      setLoadingId(null);
    }
  };

  // Average rating
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-6 pt-6 border-t border-border/60">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" /> Customer Reviews (
          {reviews.length})
        </h3>
        {avgRating && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 text-amber-600 text-sm font-bold">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span>{avgRating} / 5.0</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card/45">
          <p className="text-sm text-muted-foreground">
            No reviews yet for this property. Verified tenants can submit a
            review after booking!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwner =
              currentUserId && review.tenant?.id === currentUserId;
            const isEditing = editingId === review.id;
            const isLoading = loadingId === review.id;

            return (
              <div
                key={review.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-3xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <User className="size-4" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm">
                        {review.tenant?.name || review.tenant?.email || "Tenant"}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-3.5 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startEdit(review)}
                        disabled={isLoading}
                        className="h-8 w-8 rounded-lg cursor-pointer"
                        aria-label="Edit review"
                      >
                        <Edit2 className="size-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        disabled={isLoading}
                        className="h-8 w-8 rounded-lg cursor-pointer hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        aria-label="Delete review"
                      >
                        {isLoading ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        Rating:
                      </span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`size-5 ${
                              star <= editRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(review.id)}
                        disabled={isLoading}
                        className="cursor-pointer font-bold text-xs"
                      >
                        {isLoading ? "Saving..." : "Save Updates"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        disabled={isLoading}
                        className="cursor-pointer font-medium text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground/90 leading-relaxed whitespace-pre-line">
                    "{review.comment}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
