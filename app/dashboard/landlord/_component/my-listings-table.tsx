"use client";

import { deletePropertyAction } from "@/app/dashboard/landlord/_actions/landlord";
import { Button } from "@/components/ui/button";
import { Property } from "@/components/property-card";
import { cn } from "@/lib/utils";
import { Edit, Home, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import toast from "react-hot-toast";

interface MyListingsTableProps {
  properties: Property[];
}

export function MyListingsTable({ properties }: MyListingsTableProps) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

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
                <tr key={prop.id} className="hover:bg-muted/10 transition-colors">
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
                    {prop.bedrooms} Bed | {prop.bathrooms} Bath | {prop.propertySize} sqft
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        prop.status === "AVAILABLE"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : prop.status === "RENTED"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-muted text-muted-foreground border-border/60"
                      )}
                    >
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isDeleting}
                        render={<Link href={`/dashboard/landlord/properties/${prop.id}/edit`} />}
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

      {/* Custom Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col items-center text-center space-y-3.5">
              <div className="rounded-full bg-rose-500/10 p-3.5 border border-rose-500/20 text-rose-600">
                <Trash2 className="size-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-lg leading-tight">
                  Delete Listing?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to delete this listing? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 cursor-pointer py-4.5 rounded-xl font-semibold text-sm hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 cursor-pointer py-4.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white border-none"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
