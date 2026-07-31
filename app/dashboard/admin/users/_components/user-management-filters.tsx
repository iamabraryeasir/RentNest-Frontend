"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterState {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface UserManagementFiltersProps {
  filters: FilterState;
  isPending: boolean;
  updateQuery: (newParams: Partial<FilterState>) => void;
}

export function UserManagementFilters({
  filters,
  isPending,
  updateQuery,
}: UserManagementFiltersProps) {
  const [searchVal, setSearchVal] = useState(filters.search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchVal });
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border bg-card/65 shadow-xs">
      <div className="flex items-center gap-2 border-b pb-3 mb-1">
        <SlidersHorizontal className="size-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">
          Advanced Query Filters
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        {/* Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="md:col-span-5 flex gap-2"
        >
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="text-xs h-10"
          />
          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer rounded-xl text-xs font-semibold px-4"
          >
            <Search className="size-3.5 mr-1.5" /> Search
          </Button>
        </form>

        {/* Sort By Select */}
        <div className="md:col-span-3 flex items-center gap-2">
          <label
            htmlFor="sortBy"
            className="text-xs font-bold text-muted-foreground shrink-0"
          >
            Sort
          </label>
          <Select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => updateQuery({ sortBy: e.target.value })}
            className="text-xs h-10"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
            <option value="status">Status</option>
            <option value="createdAt">Joined Date</option>
          </Select>
        </div>

        {/* Sort Order Toggle */}
        <div className="md:col-span-2 flex items-center gap-2">
          <label
            htmlFor="sortOrder"
            className="text-xs font-bold text-muted-foreground shrink-0"
          >
            Order
          </label>
          <Select
            id="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => updateQuery({ sortOrder: e.target.value })}
            className="text-xs h-10"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </div>

        {/* Status filter select */}
        <div className="md:col-span-2 flex items-center gap-2">
          <label
            htmlFor="statusFilter"
            className="text-xs font-bold text-muted-foreground shrink-0"
          >
            Status
          </label>
          <Select
            id="statusFilter"
            value={filters.status}
            onChange={(e) => updateQuery({ status: e.target.value })}
            className="text-xs h-10"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </Select>
        </div>
      </div>

      {/* Roles Quick Buttons bar */}
      <div className="flex items-center gap-2 select-none border-t pt-3 mt-1 overflow-x-auto">
        <span className="text-xs font-bold text-muted-foreground mr-1">
          Filter Role:
        </span>
        {["ALL", "TENANT", "LANDLORD", "ADMIN"].map((role) => (
          <Button
            key={role}
            type="button"
            variant={filters.role === role ? "default" : "outline"}
            size="sm"
            onClick={() => updateQuery({ role })}
            className="rounded-xl px-3.5 py-1 text-xs font-bold cursor-pointer"
          >
            {role}
          </Button>
        ))}
      </div>
    </div>
  );
}
