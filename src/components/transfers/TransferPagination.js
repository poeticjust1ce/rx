// components/transfers/TransferPagination.js
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export function TransferPagination({
  totalItems,
  currentPage,
  itemsPerPage,
  basePath = "/admin/transfers",
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        transfers
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          asChild={canGoPrev}
          disabled={!canGoPrev}
        >
          {canGoPrev ? (
            <Link href={`${basePath}?page=1`}>
              <ChevronsLeft className="h-4 w-4" />
            </Link>
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild={canGoPrev}
          disabled={!canGoPrev}
        >
          {canGoPrev ? (
            <Link href={`${basePath}?page=${currentPage - 1}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        <span className="px-4 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          asChild={canGoNext}
          disabled={!canGoNext}
        >
          {canGoNext ? (
            <Link href={`${basePath}?page=${currentPage + 1}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild={canGoNext}
          disabled={!canGoNext}
        >
          {canGoNext ? (
            <Link href={`${basePath}?page=${totalPages}`}>
              <ChevronsRight className="h-4 w-4" />
            </Link>
          ) : (
            <ChevronsRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
