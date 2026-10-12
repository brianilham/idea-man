"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { FilterBar } from "../../components/FilterBar";
import { IdeaCard } from "../../components/IdeaCard";
import { IdeaDetailModal } from "../../components/IdeaDetailModal";
import { Pagination } from "../../components/Pagination";
import { useIdeasData } from "../../hooks/useIdeasData";

const ITEMS_PER_PAGE = 9;

export default function SavedIdeasPage() {
  const {
    allIdeas,
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
  } = useIdeasData();

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Only ideas that are saved in bookmarks
  const savedIdeas = useMemo(() => {
    return allIdeas.filter((item) => bookmarkedIds.has(item.id));
  }, [allIdeas, bookmarkedIds]);

  // Filtered by category and difficulty
  const filteredSavedIdeas = useMemo(() => {
    return savedIdeas.filter((item) => {
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchDiff =
        selectedDifficulty === "All" || item.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });
  }, [savedIdeas, selectedCategory, selectedDifficulty]);

  // Reset to page 1 whenever category or difficulty changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDifficulty]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSavedIdeas.length / ITEMS_PER_PAGE) || 1;

  const paginatedSavedIdeas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSavedIdeas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSavedIdeas, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const feedEl = document.getElementById("saved-feed");
    if (feedEl) {
      feedEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eggshell selection:bg-stone">
      <Navbar activePath="saved" />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Back Link & Centered Headline */}
        <div className="pb-8 mb-6 border-b border-stone relative">
          <Link
            href="/"
            className="text-xs font-mono text-smoke hover:text-ink transition-colors inline-flex items-center gap-1.5 mb-4 sm:mb-0 sm:absolute sm:left-0 sm:top-1 cursor-pointer"
          >
            ← Back to radar
          </Link>

          <div className="text-center pt-2 sm:pt-0">
            <h1 className="text-4xl md:text-5xl whisper-headline text-ink leading-tight mb-2.5">
              Personal Repository
            </h1>
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-mono text-smoke bg-warm-taupe border border-stone px-3 py-1 rounded-full">
                {savedIdeas.length} {savedIdeas.length === 1 ? "idea" : "ideas"} saved
              </span>
              {bookmarkedIds.size > 0 && savedIdeas.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("ideaman_bookmarks", JSON.stringify([]));
                    window.dispatchEvent(new Event("ideaman_storage_change"));
                  }}
                  className="text-[11px] font-mono text-ember-orange hover:underline cursor-pointer"
                >
                  Clear stale bookmarks ({bookmarkedIds.size})
                </button>
              )}
            </div>
          </div>
        </div>

        {savedIdeas.length > 0 ? (
          <>
            {/* Filter Bar */}
            <div id="saved-feed" className="scroll-mt-6">
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={setSelectedDifficulty}
                totalCount={filteredSavedIdeas.length}
              />
            </div>

            {/* Grid (Max 10 per page) */}
            {filteredSavedIdeas.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSavedIdeas.map((idea) => (
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
                  totalItems={filteredSavedIdeas.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-20 border border-dashed border-stone rounded-[20px] bg-warm-taupe/40">
                <p className="text-smoke text-sm font-mono mb-2">
                  No saved ideas match this filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedDifficulty("All");
                  }}
                  className="pill text-xs px-4 py-1.5 bg-ink text-eggshell font-medium hover:bg-graphite transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State for Saved Repository */
          <div className="text-center py-24 border border-dashed border-stone rounded-[24px] bg-warm-taupe/30 max-w-md mx-auto my-12 p-8">
            <div className="w-12 h-12 rounded-full bg-warm-taupe border border-stone flex items-center justify-center text-lg mx-auto mb-3 text-smoke">
              🔖
            </div>
            <h2 className="text-2xl whisper-headline text-ink mb-2">
              No saved blueprints yet
            </h2>
            <p className="text-xs text-smoke leading-relaxed mb-6">
              Bookmark promising opportunities from the discovery feed to keep
              track of specs and build roadmaps in your repository.
            </p>
            <Link
              href="/"
              className="pill inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-eggshell text-xs font-medium hover:bg-graphite transition-all shadow-xs"
            >
              Explore Discoveries →
            </Link>
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

      <footer className="border-t border-stone py-8 px-6 text-center text-xs text-smoke font-mono">
        <Link href="/" className="hover:text-ink">
          ← Back to radar
        </Link>
      </footer>
    </div>
  );
}
