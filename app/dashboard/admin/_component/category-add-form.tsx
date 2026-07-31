"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { createCategoryAction } from "../_actions/admin-actions";

export function CategoryAddForm() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    startTransition(async () => {
      const result = await createCategoryAction(newName.trim());
      if (result.success) {
        toast.success(result.message);
        setNewName("");
        setShowAddForm(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (!showAddForm) {
    return (
      <Button
        onClick={() => setShowAddForm(true)}
        className="cursor-pointer gap-1.5 rounded-xl font-semibold text-xs py-2 px-3 shadow-sm"
        size="sm"
      >
        <Plus className="size-4" /> Add Category
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleCreate}
      className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl border border-border/80 bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200 w-full"
    >
      <div className="relative w-full flex-1">
        <Input
          type="text"
          placeholder="e.g. Apartments, Duplex, Studios"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={isPending}
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
          className="cursor-pointer rounded-xl font-semibold text-xs py-2 px-3 gap-1.5"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Saving...
            </>
          ) : (
            "Save Category"
          )}
        </Button>
      </div>
    </form>
  );
}
