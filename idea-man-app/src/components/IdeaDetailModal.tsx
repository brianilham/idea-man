"use client";

import React, { useEffect } from "react";
import { Idea } from "../types/idea";

interface IdeaDetailModalProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !idea) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-eggshell border border-stone rounded-[24px] max-w-xl w-full p-7 md:p-8 whisper-shadow relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-5 border-b border-stone mb-6">
          <div className="pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="pill text-[11px] font-mono px-3 py-1 bg-warm-taupe border border-stone text-graphite font-medium">
                {idea.category}
              </span>
              <span className="pill text-[11px] font-mono px-3 py-1 bg-eggshell border border-stone text-smoke">
                {idea.difficulty}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl whisper-headline text-ink leading-tight">
              {idea.title}
            </h3>
            <p className="text-xs font-mono text-smoke mt-1.5 flex items-center gap-2">
              Discovered via Reddit • posted by{" "}
              <span className="text-graphite font-medium">
                u/{idea.author}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-smoke hover:text-ink text-sm font-mono w-8 h-8 rounded-full bg-warm-taupe border border-stone hover:border-graphite flex items-center justify-center shrink-0 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 text-xs text-smoke leading-relaxed mb-6">
          <div>
            <h4 className="font-mono text-graphite uppercase text-[11px] mb-1.5 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-ember-orange" />
              1. Problem
            </h4>
            <p className="p-3.5 bg-warm-taupe rounded-[14px] border border-stone text-graphite text-xs leading-relaxed font-normal">
              {idea.problem_summary}
            </p>
          </div>

          <div>
            <h4 className="font-mono text-graphite uppercase text-[11px] mb-1.5 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-ink" />
              2. Proposed Solution
            </h4>
            <p className="p-3.5 bg-warm-taupe/60 rounded-[14px] border border-stone/60 text-graphite text-xs leading-relaxed font-normal">
              {idea.proposed_solution}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-mono text-graphite uppercase text-[11px] mb-1.5 font-semibold">
                3. Target Audience
              </h4>
              <p className="text-graphite font-medium text-xs bg-warm-taupe/50 px-3 py-2 rounded-[10px] border border-stone/50">
                {idea.target_audience || "Developers & Builders"}
              </p>
            </div>
            <div>
              <h4 className="font-mono text-graphite uppercase text-[11px] mb-1.5 font-semibold">
                4. Difficulty
              </h4>
              <p className="text-graphite font-medium text-xs bg-warm-taupe/50 px-3 py-2 rounded-[10px] border border-stone/50">
                {idea.difficulty}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-graphite uppercase text-[11px] mb-2 font-semibold">
              5. Recommended Stack
            </h4>
            <div className="flex flex-wrap gap-2 font-mono">
              {idea.recommended_stack.map((tech) => (
                <span
                  key={tech}
                  className="pill px-3 py-1 bg-warm-taupe border border-stone text-graphite text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-stone flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(idea.id)}
              className={`pill px-4 py-1.5 text-xs font-mono transition-all cursor-pointer font-medium ${
                isSaved
                  ? "bg-ink text-eggshell"
                  : "bg-warm-taupe border border-stone text-graphite hover:border-graphite"
              }`}
            >
              {isSaved ? "Saved ★" : "Save to Board ☆"}
            </button>
          </div>
          <div className="flex items-center gap-3">
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
              className="text-xs font-mono text-smoke hover:text-ink transition-colors"
            >
              View Source Thread on Reddit ↗
            </a>
            <button
              onClick={onClose}
              className="pill bg-ink text-eggshell text-xs px-5 py-2 font-medium hover:bg-graphite transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
