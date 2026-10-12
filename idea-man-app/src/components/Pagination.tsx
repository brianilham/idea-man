"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 9,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display with smart windowing
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-12 pt-6 border-t border-stone flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Range Status Info */}
      <span className="text-xs font-mono text-smoke">
        Showing <span className="text-graphite font-medium">{startItem}–{endItem}</span> of{" "}
        <span className="text-graphite font-medium">{totalItems}</span> blueprints
      </span>

      {/* Pagination Controls */}
      <nav aria-label="Pagination Navigation" className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`pill px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-1 ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed text-smoke bg-transparent"
              : "text-graphite hover:text-ink hover:border-graphite bg-warm-taupe border border-stone cursor-pointer"
          }`}
          aria-label="Previous Page"
        >
          <span>←</span>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs font-mono text-smoke select-none"
                >
                  …
                </span>
              );
            }
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isActive ? "page" : undefined}
                className={`pill w-8 h-8 flex items-center justify-center text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? "bg-ink text-eggshell font-semibold shadow-2xs"
                    : "text-graphite hover:text-ink bg-warm-taupe hover:bg-stone/50 border border-stone"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`pill px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-1 ${
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed text-smoke bg-transparent"
              : "text-graphite hover:text-ink hover:border-graphite bg-warm-taupe border border-stone cursor-pointer"
          }`}
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <span>→</span>
        </button>
      </nav>
    </div>
  );
};
