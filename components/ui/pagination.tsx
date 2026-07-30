"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  className?: string;
}

export function Pagination({ page, limit, total, className }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn(
        "mx-auto flex w-full justify-center gap-1.5 py-4",
        className,
      )}
    >
      {/* Previous Page Button */}
      {page > 1 ? (
        <Button
          variant="outline"
          size="icon"
          render={
            <Link
              href={createPageUrl(page - 1)}
              aria-label="Go to previous page"
            />
          }
        >
          <ChevronLeft className="size-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          disabled
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {/* Page Numbers */}
      {pages.map((p) => {
        const isCurrent = p === page;
        return isCurrent ? (
          <Button key={p} variant="default" size="icon">
            <span>{p}</span>
          </Button>
        ) : (
          <Button
            key={p}
            variant="outline"
            size="icon"
            render={
              <Link href={createPageUrl(p)} aria-label={`Go to page ${p}`} />
            }
          >
            {p}
          </Button>
        );
      })}

      {/* Next Page Button */}
      {page < totalPages ? (
        <Button
          variant="outline"
          size="icon"
          render={
            <Link href={createPageUrl(page + 1)} aria-label="Go to next page" />
          }
        >
          <ChevronRight className="size-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          disabled
          aria-label="Go to next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
