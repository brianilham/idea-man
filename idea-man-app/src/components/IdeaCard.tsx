"use client";

import React from "react";
import { Idea } from "../types/idea";

interface IdeaCardProps {
  idea: Idea;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetail: (idea: Idea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isSaved,
  onToggleSave,
  onOpenDetail,
}) => {
  return (
    <article className="bg-warm-taupe rounded-[22px] p-6 sm:p-7 flex flex-col justify-between hover:border-graphite/40 transition-colors border border-stone shadow-2xs relative group">
      {idea.isNew && (
        <span className="absolute top-4 right-4 text-[10px] font-mono text-ink bg-eggshell border border-stone px-2.5 py-0.5 rounded-full font-medium shadow-2xs flex items-center gap-1.5">
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ember-orange animate-pulse" />
          NEW
        </span>
      )}

      <div>
        {/* Header Tags */}
        <div className="flex items-center gap-2 mb-4">
          <span className="pill text-[11px] font-mono px-3 py-1 bg-eggshell border border-stone text-graphite font-medium">
            {idea.category}
          </span>
          <span className="text-[11px] font-mono text-graphite/80 font-semibold bg-stone/50 px-2 py-0.5 rounded-full">
            {idea.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl whisper-headline text-ink mb-3.5 leading-snug">
          <button
            type="button"
            onClick={() => onOpenDetail(idea)}
            className="text-left hover:text-graphite transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm"
          >
            {idea.title}
          </button>
        </h3>

        {/* Symmetrical Aligned Compact Callout Cards: Line Clamp 2 */}
        <div className="space-y-2 mb-5">
          {/* Pain Point Box */}
          <div className="bg-eggshell/80 border border-stone/80 rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-graphite/70 block font-semibold">
              Pain Point
            </span>
            <p className="text-xs text-graphite/95 leading-relaxed font-normal line-clamp-2">
              {idea.problem_summary}
            </p>
          </div>

          {/* Proposed Solution Box */}
          <div className="bg-eggshell/40 border border-stone/60 rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-smoke block font-semibold">
              Proposed Solution
            </span>
            <p className="text-xs text-graphite/95 leading-relaxed font-normal line-clamp-2">
              {idea.proposed_solution}
            </p>
          </div>
        </div>
      </div>

      <div>
        {/* Recommended Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {idea.recommended_stack.map((stack) => (
            <span
              key={stack}
              className="pill text-[10px] font-mono px-2.5 py-0.5 bg-eggshell text-graphite border border-stone font-medium"
            >
              {stack}
            </span>
          ))}
        </div>

        {/* Footer Actions: Save (Left) & Detail/Source (Right), No Upvote */}
        <div className="pt-3.5 border-t border-stone flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onToggleSave(idea.id)}
            aria-pressed={isSaved}
            className={`pill min-h-[30px] px-3.5 py-1 text-xs font-mono transition-all cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
              isSaved
                ? "bg-ink text-eggshell"
                : "bg-eggshell text-graphite border border-stone hover:border-graphite"
            }`}
            title={isSaved ? "Saved to your list" : "Save opportunity"}
          >
            {isSaved ? "Saved ★" : "Save ☆"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(idea)}
              className="pill min-h-[30px] px-3.5 py-1 bg-ink text-eggshell hover:bg-graphite transition-all font-mono text-[11px] flex items-center gap-1 font-medium shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <span>Detail</span>
              <span aria-hidden="true">↗</span>
            </button>
            <a
              href={
                idea.url && idea.url.startsWith("http")
                  ? idea.url
                  : idea.subreddit
                  ? `https://www.reddit.com/r/${idea.subreddit}/`
                  : "https://www.reddit.com/r/SomebodyMakeThis/"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-smoke hover:text-ink font-mono text-[11px] p-1.5 rounded hover:underline inline-flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              title="View Reddit source thread (opens in new tab)"
            >
              <span>Source</span>
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
