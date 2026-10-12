"use client";

import React from "react";
import { Category, Difficulty } from "../types/idea";

interface FilterBarProps {
  selectedCategory: Category;
  onCategoryChange: (cat: Category) => void;
  selectedDifficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  totalCount: number;
}

const CATEGORIES: Category[] = [
  "All",
  "Web App",
  "DevTool",
  "AI Tool",
  "Automation",
];

const DIFFICULTIES: Difficulty[] = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  totalCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <h3 className="text-2xl whisper-headline text-ink">
          Discovered Opportunities
        </h3>
        <span className="text-xs font-mono text-smoke bg-warm-taupe px-2.5 py-1 rounded-full border border-stone">
          {totalCount} {totalCount === 1 ? "idea" : "ideas"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`pill px-4 py-1.5 text-xs font-medium border border-stone transition-all cursor-pointer ${
                isActive
                  ? "bg-ink text-eggshell"
                  : "bg-eggshell text-graphite hover:border-graphite"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-smoke">
        <label htmlFor="difficulty-filter-select" className="text-graphite font-medium">
          Difficulty:
        </label>
        <select
          id="difficulty-filter-select"
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
          className="bg-warm-taupe border border-stone rounded px-3 py-1 text-xs text-graphite focus:outline-none focus-visible:ring-2 focus-visible:ring-ink cursor-pointer"
        >
          {DIFFICULTIES.map((diff) => (
            <option key={diff} value={diff}>
              {diff === "All" ? "All Levels" : diff}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

