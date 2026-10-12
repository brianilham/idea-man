"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ActionBarProps {
  initialQuery?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onTriggerScan?: () => void;
  isMining?: boolean;
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  showScanButton?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  initialQuery,
  searchQuery,
  onSearchChange,
  onTriggerScan,
  isMining = false,
  onSearchSubmit,
  placeholder = "Search problem, stack, keyword...",
  showScanButton = true,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledQuery, setUncontrolledQuery] = useState(
    searchQuery !== undefined ? searchQuery : initialQuery || ""
  );

  const queryValue =
    searchQuery !== undefined ? searchQuery : uncontrolledQuery;

  // Keyboard shortcut listener ('/' focuses search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setUncontrolledQuery(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = queryValue.trim();
    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
    } else if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div 
      aria-label="Discovery & Action Bar" 
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10"
    >
      <form 
        onSubmit={handleSubmit} 
        role="search"
        className="relative flex-1 group"
      >
        <label htmlFor="idea-search-input" className="sr-only">
          Search ideas by problem, tech stack, or keyword
        </label>
        <input
          id="idea-search-input"
          ref={inputRef}
          type="text"
          value={queryValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-warm-taupe border border-stone rounded pl-5 pr-20 py-3 text-sm text-ink placeholder:text-smoke/70 focus:outline-none focus:border-graphite focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-eggshell shadow-2xs transition-colors"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {queryValue ? (
            <button
              type="button"
              onClick={() => handleChange("")}
              className="text-smoke hover:text-ink text-xs font-mono w-7 h-7 rounded-full flex items-center justify-center hover:bg-stone/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              aria-label="Clear search query"
            >
              <span aria-hidden="true">✕</span>
            </button>
          ) : (
            <kbd 
              aria-hidden="true" 
              className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-smoke bg-eggshell/90 border border-stone rounded shadow-2xs"
              title="Press / to search"
            >
              /
            </kbd>
          )}

          <button
            type="submit"
            className="text-graphite hover:text-ink text-xs font-mono w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            title="Submit search query"
            aria-label="Submit search query"
          >
            <span aria-hidden="true">↵</span>
          </button>
        </div>
      </form>

      {showScanButton && onTriggerScan && (
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onTriggerScan}
            disabled={isMining}
            className="w-full sm:w-auto pill bg-ink text-eggshell text-sm font-medium px-6 py-3 hover:bg-graphite transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-eggshell"
            title="Launch autonomous Reddit crawler to extract new opportunities"
          >
            <span>{isMining ? "Mining Reddit..." : "Scan & Mine Ideas"}</span>
            <span aria-hidden="true" className="text-xs font-mono opacity-60">↗</span>
          </button>
        </div>
      )}
    </div>
  );
};

