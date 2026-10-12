"use client";

import { useSyncExternalStore, useMemo } from "react";
import { Idea } from "../types/idea";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ideaman_storage_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ideaman_storage_change", callback);
  };
}

function dispatchChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ideaman_storage_change"));
  }
}

function getBookmarksSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem("ideaman_bookmarks") || "[]";
  } catch {
    return "[]";
  }
}

function getCustomIdeasSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem("ideaman_custom_ideas") || "[]";
  } catch {
    return "[]";
  }
}

export function useIdeaStorage() {
  const bookmarksJson = useSyncExternalStore(
    subscribeStorage,
    getBookmarksSnapshot,
    () => "[]"
  );

  const customIdeasJson = useSyncExternalStore(
    subscribeStorage,
    getCustomIdeasSnapshot,
    () => "[]"
  );

  const bookmarkedIds = useMemo<Set<string>>(() => {
    try {
      return new Set<string>(JSON.parse(bookmarksJson));
    } catch {
      return new Set<string>();
    }
  }, [bookmarksJson]);

  const customIdeas = useMemo<Idea[]>(() => {
    try {
      return JSON.parse(customIdeasJson);
    } catch {
      return [];
    }
  }, [customIdeasJson]);

  const toggleSave = (id: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    localStorage.setItem("ideaman_bookmarks", JSON.stringify([...next]));
    dispatchChange();
  };

  const addCustomIdeas = (newIdeas: Idea[]) => {
    const existing = customIdeas;
    const existingIds = new Set(existing.map((item) => item.id));
    const toAdd = newIdeas.filter((item) => !existingIds.has(item.id));
    const updated = [...toAdd, ...existing];
    localStorage.setItem("ideaman_custom_ideas", JSON.stringify(updated));
    dispatchChange();
  };

  const clearAllSaved = () => {
    localStorage.setItem("ideaman_bookmarks", JSON.stringify([]));
    dispatchChange();
  };

  return {
    bookmarkedIds,
    customIdeas,
    toggleSave,
    addCustomIdeas,
    clearAllSaved,
    savedCount: bookmarkedIds.size,
  };
}
