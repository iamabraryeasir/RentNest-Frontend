"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MapPin, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";

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
  const [isPending, startTransition] = useTransition();

  // Local form states
  const [search, setSearch] = useState(initialFilters.search || "");
  const [city, setCity] = useState(initialFilters.city || "");
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId || "");
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || "");
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms || "");
  const [bathrooms, setBathrooms] = useState(initialFilters.bathrooms || "");
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "");
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || "");

  // Update states if query params change externally (e.g. back button)
  useEffect(() => {
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

  const handleApplyFilters = (e: FormEvent) => {
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
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="e.g. Modern Apartment"
            value={search}
            disabled={isPending}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* City Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          City
        </label>
        <div className="relative">
          <MapPin className="absolute top-2.5 left-3 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="e.g. Dhaka"
            value={city}
            disabled={isPending}
            onChange={(e) => setCity(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Category
        </label>
        <Select
          value={categoryId}
          disabled={isPending}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Rent Amount (BDT)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            disabled={isPending}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            disabled={isPending}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Bedrooms selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
          Bedrooms
        </label>
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            variant={bedrooms === "" ? "default" : "outline"}
            size="sm"
            disabled={isPending}
            onClick={() => setBedrooms("")}
            className="w-20 shrink-0 cursor-pointer rounded-lg text-xs"
          >
            Any
          </Button>
          <Input
            type="number"
            min="1"
            placeholder="e.g. 3"
            value={bedrooms}
            disabled={isPending}
            onChange={(e) => setBedrooms(e.target.value)}
            className="flex-1 text-xs rounded-lg"
          />
        </div>
      </div>

      {/* Bathrooms selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
          Bathrooms
        </label>
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            variant={bathrooms === "" ? "default" : "outline"}
            size="sm"
            disabled={isPending}
            onClick={() => setBathrooms("")}
            className="w-20 shrink-0 cursor-pointer rounded-lg text-xs"
          >
            Any
          </Button>
          <Input
            type="number"
            min="1"
            placeholder="e.g. 2"
            value={bathrooms}
            disabled={isPending}
            onChange={(e) => setBathrooms(e.target.value)}
            className="flex-1 text-xs rounded-lg"
          />
        </div>
      </div>

      {/* Sorting Dropdown */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Sort By
        </label>
        <Select
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
        >
          <option value="">Default Sorting</option>
          <option value="rentAmount:asc">Price: Low to High</option>
          <option value="rentAmount:desc">Price: High to Low</option>
          <option value="createdAt:desc">Newest Listings</option>
          <option value="propertySize:desc">Largest Size</option>
        </Select>
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
