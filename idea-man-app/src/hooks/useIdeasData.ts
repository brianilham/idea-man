"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Idea, Category, Difficulty } from "../types/idea";
import { initialMockIdeas } from "../data/mockIdeas";
import { fetchLiveIdeas } from "../lib/ideas/data";
import { canonicalizeUrl, calculateTokenSimilarity } from "../lib/ingestion/deduplication";
import { useIdeaStorage } from "./useIdeaStorage";

interface UseIdeasDataOptions {
  autoFetch?: boolean;
}

export function useIdeasData(options: UseIdeasDataOptions = { autoFetch: true }) {
  const {
    bookmarkedIds,
    customIdeas,
    toggleSave,
    addCustomIdeas,
  } = useIdeaStorage();

  const [dbIdeas, setDbIdeas] = useState<Idea[]>(initialMockIdeas);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals state
  const [selectedDetailIdea, setSelectedDetailIdea] = useState<Idea | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);

  // Load live data from Supabase with fallback
  const refreshIdeas = useCallback(async () => {
    setIsLoading(true);
    try {
      const live = await fetchLiveIdeas();
      if (live && live.length > 0) {
        setDbIdeas(live);
      }
    } catch (err) {
      console.warn("[useIdeasData] Live ideas fetch notice:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoFetch) {
      refreshIdeas();
    }
  }, [options.autoFetch, refreshIdeas]);

  // Combine custom newly-mined ideas + database ideas with canonical URL & semantic deduplication
  const allIdeas = useMemo(() => {
    const pool = [...customIdeas, ...dbIdeas];
    const seenIds = new Set<string>();
    const seenUrls = new Set<string>();
    const result: Idea[] = [];

    for (const idea of pool) {
      if (seenIds.has(idea.id)) continue;

      const canonical = canonicalizeUrl(idea.url).toLowerCase();
      if (canonical && seenUrls.has(canonical)) continue;

      // Check semantic similarity against already accepted ideas
      const isDuplicateTopic = result.some(
        (existing) =>
          calculateTokenSimilarity(idea.title, existing.title) >= 0.70 ||
          (idea.author &&
            idea.author !== "anonymous" &&
            idea.author.toLowerCase() === existing.author?.toLowerCase() &&
            calculateTokenSimilarity(idea.title, existing.title) >= 0.40)
      );

      if (isDuplicateTopic) continue;

      seenIds.add(idea.id);
      if (canonical) seenUrls.add(canonical);
      result.push(idea);
    }

    return result.length > 0 ? result : initialMockIdeas;
  }, [customIdeas, dbIdeas]);

  // Modal actions
  const handleOpenDetail = useCallback((idea: Idea) => {
    setSelectedDetailIdea(idea);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const handleTriggerScan = useCallback(() => {
    setIsScanModalOpen(true);
  }, []);

  const handleCloseScan = useCallback(() => {
    setIsScanModalOpen(false);
  }, []);

  const handleApplyNewIdeas = useCallback(
    (newIdeas: Idea[]) => {
      setIsScanModalOpen(false);
      if (newIdeas && newIdeas.length > 0) {
        addCustomIdeas(newIdeas);
        setSelectedCategory("All");
        setSelectedDifficulty("All");
        refreshIdeas();
        setTimeout(() => {
          const el = document.getElementById("explore");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    },
    [addCustomIdeas, refreshIdeas]
  );

  return {
    // Data & Storage
    allIdeas,
    dbIdeas,
    setDbIdeas,
    bookmarkedIds,
    customIdeas,
    toggleSave,
    isLoading,
    refreshIdeas,

    // Category & Difficulty Filters
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,

    // Detail Modal State & Handlers
    selectedDetailIdea,
    isDetailOpen,
    handleOpenDetail,
    handleCloseDetail,

    // Scan Mining Modal State & Handlers
    isScanModalOpen,
    handleTriggerScan,
    handleCloseScan,
    handleApplyNewIdeas,
  };
}
