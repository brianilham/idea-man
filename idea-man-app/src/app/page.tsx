"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { ActionBar } from "../components/ActionBar";
import { FilterBar } from "../components/FilterBar";
import { IdeaCard } from "../components/IdeaCard";
import { IdeaDetailModal } from "../components/IdeaDetailModal";
import { ScanMiningModal } from "../components/ScanMiningModal";
import { Pagination } from "../components/Pagination";
import { useIdeasData } from "../hooks/useIdeasData";

const ITEMS_PER_PAGE = 9;

export default function Home() {
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
    isScanModalOpen,
    handleTriggerScan,
    handleCloseScan,
    handleApplyNewIdeas,
  } = useIdeasData();

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filtered Ideas on Home
  const filteredIdeas = useMemo(() => {
    return allIdeas.filter((item) => {
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchDiff =
        selectedDifficulty === "All" || item.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });
  }, [allIdeas, selectedCategory, selectedDifficulty]);

  // Reset to page 1 whenever category or difficulty changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDifficulty]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE) || 1;

  const paginatedIdeas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIdeas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIdeas, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const gridEl = document.getElementById("grid-feed");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eggshell selection:bg-stone">
      {/* Top Nav */}
      <Navbar activePath="home" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Hero Section */}
        <Hero onTriggerScan={handleTriggerScan} />

        {/* How It Works Section */}
        <HowItWorks onInspectBlueprint={handleOpenDetail} />

        {/* Action Bar (Navigates to /search?q=... on submit) */}
        <div id="explore" className="scroll-mt-6 mb-10">
          <ActionBar
            onTriggerScan={handleTriggerScan}
            isMining={isScanModalOpen}
          />
        </div>

        {/* Filter Bar */}
        <div id="grid-feed" className="scroll-mt-6">
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            totalCount={filteredIdeas.length}
          />
        </div>

        {/* Discovered Opportunities Grid (Max 10 per page) */}
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
          <div className="text-center py-20 border border-dashed border-stone rounded-[20px] bg-warm-taupe/40">
            <p className="text-smoke text-sm font-mono mb-2">
              No ideas match this filter.
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

      {/* Autonomous Idea Mining Modal (Remounts freshly when opened) */}
      {isScanModalOpen && (
        <ScanMiningModal
          isOpen={isScanModalOpen}
          onClose={handleCloseScan}
          onApplyNewIdeas={handleApplyNewIdeas}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone py-8 px-6" />
    </div>
  );
}
