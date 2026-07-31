"use client";

import { Button } from "@/components/ui/button";
import { Check, Edit2, Folder, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "../_actions/admin-actions";

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    startTransition(async () => {
      const result = await createCategoryAction(newName);
      if (result.success) {
        toast.success(result.message);
        setNewName("");
        setShowAddForm(false);
      } else {
        toast.error(result.message);
      }
    });
  };

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      if (result.success) {
        toast.success(result.message);
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
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer gap-1.5 rounded-xl font-semibold text-xs py-2 px-3 shadow-sm"
            size="sm"
          >
            <Plus className="size-4" /> Add Category
          </Button>
        )}
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl border border-border/80 bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder="e.g. Apartments, Duplex, Studios"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isPending}
              className="flex h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
            />
          </div>
          <div className="flex w-full sm:w-auto items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setNewName("");
              }}
              disabled={isPending}
              className="cursor-pointer rounded-xl font-semibold text-xs py-2 px-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-xl font-semibold text-xs py-2 px-3"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1" /> Saving...
                </>
              ) : (
                "Save Category"
              )}
            </Button>
          </div>
        </form>
      )}

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
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={isPending}
                            className="flex h-8 w-full max-w-[240px] rounded-lg border border-input bg-card px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
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
                                onClick={() => handleDelete(cat.id)}
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
    </div>
  );
}
