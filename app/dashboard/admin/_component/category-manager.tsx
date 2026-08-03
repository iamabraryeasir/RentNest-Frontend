"use client";

import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import { Check, Edit2, Folder, Loader2, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  deleteCategoryAction,
  updateCategoryAction,
} from "../_actions/admin-actions";
import { CategoryAddForm } from "./category-add-form";

import type { PropertyCategory as Category } from "@/types";

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<Category | null>(null);

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    startTransition(async () => {
      const result = await updateCategoryAction(id, editName);
      if (result.success) {
        toast.success(result.message);
        setEditingId(null);
        setEditName("");
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = async (category: Category) => {
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (result.success) {
        toast.success(result.message);
        setDeleteConfirmCategory(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Platform Categories ({categories.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage listing categories. Landlords select these categories when
            creating properties.
          </p>
        </div>
        <CategoryAddForm />
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/45 p-12 text-center h-[240px]">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Folder className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground text-base">No categories</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs mb-4">
            Create platform categories to let landlords post properties under
            them.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {categories.map((cat) => {
                  const isEditing = editingId === cat.id;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {isEditing ? (
                          <Input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={isPending}
                            className="h-8 max-w-[240px] text-xs"
                          />
                        ) : (
                          cat.name
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditName("");
                                }}
                                disabled={isPending}
                                className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
                              >
                                <X className="size-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                onClick={() => handleUpdate(cat.id)}
                                disabled={isPending}
                                className="size-8 rounded-lg cursor-pointer bg-primary text-primary-foreground"
                              >
                                {isPending ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <Check className="size-3.5" />
                                )}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(cat.id);
                                  setEditName(cat.name);
                                }}
                                disabled={isPending}
                                className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 className="size-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setDeleteConfirmCategory(cat)}
                                disabled={isPending}
                                className="size-8 rounded-lg cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </>
                          )}
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

      <ConfirmationModal
        isOpen={!!deleteConfirmCategory}
        onClose={() => setDeleteConfirmCategory(null)}
        onConfirm={() => {
          if (deleteConfirmCategory) {
            handleDelete(deleteConfirmCategory);
          }
        }}
        title="Delete Category?"
        description={
          deleteConfirmCategory
            ? `Are you sure you want to delete "${deleteConfirmCategory.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isPending}
      />
    </div>
  );
}
