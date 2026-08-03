"use client";

import {
  deletePropertyAction,
  updatePropertyListingStatusAction,
} from "@/app/dashboard/landlord/_actions/landlord";
import { Property } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Edit, Home, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface MyListingsTableProps {
  properties: Property[];
}

export function MyListingsTable({ properties }: MyListingsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const handleStatusChange = async (
    id: string,
    newStatus: "AVAILABLE" | "RENTED" | "UNAVAILABLE",
  ) => {
    setUpdatingStatusId(id);
    try {
      const res = await updatePropertyListingStatusAction(id, newStatus);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteConfirmId(null);

    try {
      const res = await deletePropertyAction(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("Failed to delete property listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Rent Amount</th>
              <th className="px-6 py-4">Rooms / Size</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {properties.map((prop) => {
              const hasImage = prop.images && prop.images.length > 0;
              const formattedRent = Number(prop.rentAmount).toLocaleString();
              const locationText = `${prop.area ? `${prop.area}, ` : ""}${prop.city}`;
              const isDeleting = deletingId === prop.id;

              return (
                <tr
                  key={prop.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="h-12 w-20 rounded-lg overflow-hidden border border-border/85 bg-muted shrink-0">
                      {hasImage ? (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted">
                          <Home className="size-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/properties/${prop.id}`}
                      className="font-semibold text-foreground hover:text-primary hover:underline transition-all"
                    >
                      {prop.title}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground font-medium">
                    {locationText}
                  </td>
                  <td className="px-6 py-3 font-bold text-foreground">
                    ৳{formattedRent}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground font-medium">
                    {prop.bedrooms} Bed | {prop.bathrooms} Bath |{" "}
                    {prop.propertySize} sqft
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        defaultValue={prop.status || "AVAILABLE"}
                        disabled={updatingStatusId === prop.id || isDeleting}
                        onChange={(e) =>
                          handleStatusChange(
                            prop.id,
                            e.target.value as
                              | "AVAILABLE"
                              | "RENTED"
                              | "UNAVAILABLE",
                          )
                        }
                        className="text-xs font-semibold rounded-lg border border-border bg-background px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RENTED">RENTED</option>
                        <option value="UNAVAILABLE">UNAVAILABLE</option>
                      </select>
                      {updatingStatusId === prop.id && (
                        <Loader2 className="size-3.5 animate-spin text-primary shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isDeleting}
                        render={
                          <Link
                            href={`/dashboard/landlord/properties/${prop.id}/edit`}
                          />
                        }
                        className="h-8 w-8 rounded-lg cursor-pointer hover:bg-muted"
                        aria-label="Edit property"
                      >
                        <Edit className="size-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isDeleting}
                        onClick={() => setDeleteConfirmId(prop.id)}
                        className="h-8 w-8 rounded-lg cursor-pointer hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 text-muted-foreground"
                        aria-label="Delete property"
                      >
                        {isDeleting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            handleDelete(deleteConfirmId);
          }
        }}
        title="Delete Listing?"
        description="Are you sure you want to delete this listing? This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingId === deleteConfirmId}
      />
    </>
  );
}
