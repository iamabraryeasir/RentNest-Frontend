"use client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Home, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { deletePropertyAction } from "../_actions/admin-actions";

import type { DashboardProperty as Property } from "@/types";

interface ListingsModeratorProps {
  properties: Property[];
}

export function ListingsModerator({ properties }: ListingsModeratorProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this listing? This action is permanent and cannot be undone.",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deletePropertyAction(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const filteredProperties = properties.filter((prop) => {
    const search = searchTerm.toLowerCase();
    return (
      prop.title.toLowerCase().includes(search) ||
      (prop.city?.toLowerCase().includes(search) ?? false) ||
      (prop.landlord?.name &&
        prop.landlord.name.toLowerCase().includes(search)) ||
      (prop.landlord?.email &&
        prop.landlord.email.toLowerCase().includes(search))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Platform Properties ({filteredProperties.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversee and moderate all properties listed on the marketplace.
            Delete listings that violate terms.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search by title, city, or landlord..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-[280px]">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Home className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground text-base">
            No properties found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            {searchTerm
              ? "Try adjusting your search terms."
              : "No listings have been posted to the platform yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Landlord</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Monthly Rent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredProperties.map((prop) => {
                  const status = prop.status || "PENDING";
                  const formattedRent = Number(
                    prop.rentAmount,
                  ).toLocaleString();

                  return (
                    <tr
                      key={prop.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground max-w-[220px] truncate">
                          {prop.title}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>{prop.category?.name || "Uncategorized"}</span>
                          <span>•</span>
                          <span>{prop.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground font-medium">
                          {prop.landlord?.name || "Unknown Landlord"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {prop.landlord?.email || "No Email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        <div>
                          {prop.bedrooms ?? 0} Bed • {prop.bathrooms ?? 0} Bath
                        </div>
                        <div className="mt-0.5">{prop.propertySize ?? 0} sqft</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground">
                        ${formattedRent}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            render={
                              <Link
                                href={`/properties/${prop.id}`}
                                target="_blank"
                              />
                            }
                            className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDelete(prop.id)}
                            disabled={isPending}
                            className="size-8 rounded-lg cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            {isPending ? (
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
        </div>
      )}
    </div>
  );
}
