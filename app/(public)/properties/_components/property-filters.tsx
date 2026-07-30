"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PropertyFiltersProps {
  categories: Category[];
  initialFilters: Record<string, string | undefined>;
}

export function PropertyFilters({
  categories,
  initialFilters,
}: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // Local form states
  const [search, setSearch] = React.useState(initialFilters.search || "");
  const [city, setCity] = React.useState(initialFilters.city || "");
  const [categoryId, setCategoryId] = React.useState(
    initialFilters.categoryId || "",
  );
  const [minPrice, setMinPrice] = React.useState(initialFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = React.useState(initialFilters.maxPrice || "");
  const [bedrooms, setBedrooms] = React.useState(initialFilters.bedrooms || "");
  const [bathrooms, setBathrooms] = React.useState(
    initialFilters.bathrooms || "",
  );
  const [sortBy, setSortBy] = React.useState(initialFilters.sortBy || "");
  const [sortOrder, setSortOrder] = React.useState(
    initialFilters.sortOrder || "",
  );

  // Update states if query params change externally (e.g. back button)
  React.useEffect(() => {
    setSearch(initialFilters.search || "");
    setCity(initialFilters.city || "");
    setCategoryId(initialFilters.categoryId || "");
    setMinPrice(initialFilters.minPrice || "");
    setMaxPrice(initialFilters.maxPrice || "");
    setBedrooms(initialFilters.bedrooms || "");
    setBathrooms(initialFilters.bathrooms || "");
    setSortBy(initialFilters.sortBy || "");
    setSortOrder(initialFilters.sortOrder || "");
  }, [initialFilters]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (city.trim()) params.set("city", city.trim());
    if (categoryId) params.set("categoryId", categoryId);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (bathrooms) params.set("bathrooms", bathrooms);

    // Sorting parameters mapping
    if (sortBy) {
      params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
    }

    // Always reset to page 1 when filters are updated
    params.set("page", "1");

    startTransition(() => {
      router.push(`/properties?${params.toString()}`);
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCity("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setSortBy("");
    setSortOrder("");
    startTransition(() => {
      router.push("/properties");
    });
  };

  const bedOptions = ["1", "2", "3", "4+"];
  const bathOptions = ["1", "2", "3", "4+"];

  return (
    <form onSubmit={handleApplyFilters} className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
          <SlidersHorizontal className="size-4 text-primary" />
          <span>Filters</span>
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={handleResetFilters}
          className="h-8 text-xs font-semibold hover:text-primary gap-1 cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className={cn("size-3", isPending && "animate-spin")} />
          <span>Reset</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Search Properties
        </label>
        <div className="relative">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="e.g. Modern Apartment"
            value={search}
            disabled={isPending}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* City Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          City
        </label>
        <div className="relative">
          <MapPin className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="e.g. Dhaka"
            value={city}
            disabled={isPending}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Category
        </label>
        <select
          value={categoryId}
          disabled={isPending}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Rent Amount (BDT)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            disabled={isPending}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            disabled={isPending}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Bedrooms selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
          Bedrooms
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={bedrooms === "" ? "default" : "outline"}
            size="sm"
            disabled={isPending}
            onClick={() => setBedrooms("")}
            className="flex-1 cursor-pointer rounded-lg text-xs"
          >
            Any
          </Button>
          {bedOptions.map((opt) => (
            <Button
              key={opt}
              type="button"
              variant={bedrooms === opt ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => setBedrooms(opt)}
              className="flex-1 cursor-pointer rounded-lg text-xs"
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {/* Bathrooms selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
          Bathrooms
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={bathrooms === "" ? "default" : "outline"}
            size="sm"
            disabled={isPending}
            onClick={() => setBathrooms("")}
            className="flex-1 cursor-pointer rounded-lg text-xs"
          >
            Any
          </Button>
          {bathOptions.map((opt) => (
            <Button
              key={opt}
              type="button"
              variant={bathrooms === opt ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => setBathrooms(opt)}
              className="flex-1 cursor-pointer rounded-lg text-xs"
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {/* Sorting Dropdown */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={sortBy ? `${sortBy}:${sortOrder}` : ""}
          disabled={isPending}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              setSortBy("");
              setSortOrder("");
            } else {
              const [field, order] = val.split(":");
              setSortBy(field);
              setSortOrder(order);
            }
          }}
          className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option value="">Default Sorting</option>
          <option value="rentAmount:asc">Price: Low to High</option>
          <option value="rentAmount:desc">Price: High to Low</option>
          <option value="createdAt:desc">Newest Listings</option>
          <option value="propertySize:desc">Largest Size</option>
        </select>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 rounded-xl cursor-pointer font-semibold mt-4"
      >
        {isPending ? "Applying Filters..." : "Apply Filters"}
      </Button>
    </form>
  );
}
