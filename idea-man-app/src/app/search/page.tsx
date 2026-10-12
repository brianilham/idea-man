"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { ActionBar } from "../../components/ActionBar";
import { FilterBar } from "../../components/FilterBar";
import { IdeaCard } from "../../components/IdeaCard";
import { IdeaDetailModal } from "../../components/IdeaDetailModal";
import { ScanMiningModal } from "../../components/ScanMiningModal";
import { Pagination } from "../../components/Pagination";
import { useIdeasData } from "../../hooks/useIdeasData";
import { searchLiveIdeas } from "../../lib/ideas/data";

const ITEMS_PER_PAGE = 9;

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const {
    allIdeas,
    setDbIdeas,
    bookmarkedIds,
    toggleSave,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedDetailIdea,
    isDetailOpen,
    handleOpenDetail,
    handleCloseDetail,
    isScanModalOpen,
    handleTriggerScan,
    handleCloseScan,
    handleApplyNewIdeas,
  } = useIdeasData();

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Search Supabase live with queryParam
  useEffect(() => {
    let isMounted = true;
    if (queryParam.trim()) {
      searchLiveIdeas(queryParam).then((results) => {
        if (isMounted && results && results.length > 0) {
          setDbIdeas(results);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [queryParam, setDbIdeas]);

  // Filter ideas based on queryParam and filters
  const filteredIdeas = useMemo(() => {
    const q = queryParam.trim().toLowerCase();
    return allIdeas.filter((item) => {
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchDiff =
        selectedDifficulty === "All" || item.difficulty === selectedDifficulty;
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.problem_summary.toLowerCase().includes(q) ||
        item.proposed_solution.toLowerCase().includes(q) ||
        item.recommended_stack.some((s) => s.toLowerCase().includes(q));

      return matchCat && matchDiff && matchQuery;
    });
  }, [allIdeas, queryParam, selectedCategory, selectedDifficulty]);

  // Reset page when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [queryParam, selectedCategory, selectedDifficulty]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE) || 1;

  const paginatedIdeas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIdeas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIdeas, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const searchFeedEl = document.getElementById("search-feed");
    if (searchFeedEl) {
      searchFeedEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eggshell selection:bg-stone">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Header & Back Navigation */}
        <div className="pb-8 mb-6 border-b border-stone">
          <Link
            href="/"
            className="text-xs font-mono text-smoke hover:text-ink transition-colors inline-flex items-center gap-1.5 mb-4"
          >
            ← Back to radar
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl whisper-headline text-ink leading-tight mb-2">
                {queryParam ? (
                  <>
                    Search results for &ldquo;
                    <span className="text-ink font-medium">{queryParam}</span>
                    &rdquo;
                  </>
                ) : (
                  "Explore All Blueprints"
                )}
              </h1>
              <p className="text-xs font-mono text-smoke">
                Found {filteredIdeas.length}{" "}
                {filteredIdeas.length === 1 ? "blueprint" : "blueprints"} matching
                your query
              </p>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-smoke">
              <span>Quick tags:</span>
              {["TypeScript", "Python", "Telegram", "Next.js", "AI"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => router.push(`/search?q=${tag}`)}
                    className="pill px-2.5 py-0.5 bg-warm-taupe border border-stone hover:border-graphite text-graphite text-[11px] transition-all cursor-pointer"
                  >
                    #{tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Action Bar Search Input */}
        <div className="mb-8">
          <ActionBar
            initialQuery={queryParam}
            onTriggerScan={handleTriggerScan}
            isMining={isScanModalOpen}
          />
        </div>

        {/* Filter Pills */}
        <div id="search-feed" className="scroll-mt-6">
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            totalCount={filteredIdeas.length}
          />
        </div>

        {/* Search Results Grid (Max 10 per page) */}
        {filteredIdeas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isSaved={bookmarkedIds.has(idea.id)}
                  onToggleSave={toggleSave}
                  onOpenDetail={handleOpenDetail}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredIdeas.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 border border-dashed border-stone rounded-[24px] bg-warm-taupe/40 max-w-lg mx-auto my-6 p-8">
            <div className="w-12 h-12 rounded-full bg-warm-taupe border border-stone flex items-center justify-center text-lg mx-auto mb-3 text-smoke">
              🔍
            </div>
            <h2 className="text-2xl whisper-headline text-ink mb-2">
              No ideas found matching &ldquo;{queryParam}&rdquo;
            </h2>
            <p className="text-xs text-smoke leading-relaxed max-w-sm mx-auto mb-6">
              Try searching with broader terms or different tech stacks, or
              trigger a scan to ingest fresh problem posts from Reddit.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="pill px-5 py-2 bg-eggshell border border-stone hover:border-graphite text-xs text-graphite font-medium transition-all"
              >
                Clear Search
              </Link>
              <button
                onClick={handleTriggerScan}
                className="pill px-5 py-2 bg-ink text-eggshell text-xs font-medium hover:bg-graphite transition-all shadow-xs cursor-pointer"
              >
                Scan Reddit for Ideas
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Reusable Detail Modal */}
      <IdeaDetailModal
        idea={selectedDetailIdea}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        isSaved={
          selectedDetailIdea ? bookmarkedIds.has(selectedDetailIdea.id) : false
        }
        onToggleSave={toggleSave}
      />

      {/* Autonomous Idea Mining Modal */}
      {isScanModalOpen && (
        <ScanMiningModal
          isOpen={isScanModalOpen}
          onClose={handleCloseScan}
          onApplyNewIdeas={handleApplyNewIdeas}
        />
      )}

      <footer className="border-t border-stone py-8 px-6 text-center text-xs text-smoke font-mono">
        <Link href="/" className="hover:text-ink">
          ← Back to radar
        </Link>
      </footer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-eggshell text-smoke font-mono text-xs">
          Loading search results...
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
