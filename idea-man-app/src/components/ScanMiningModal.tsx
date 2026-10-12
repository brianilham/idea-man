"use client";

import React, { useState, useEffect, useRef } from "react";
import { Idea } from "../types/idea";
import { mapDbIdeaToIdea } from "../lib/ideas/data";

interface ScanMiningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNewIdeas: (newIdeas: Idea[]) => void;
}

interface MiningSummary {
  scanned: number;
  skipped: number;
  added: number;
}

export const ScanMiningModal: React.FC<ScanMiningModalProps> = ({
  isOpen,
  onClose,
  onApplyNewIdeas,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [minedIdeas, setMinedIdeas] = useState<Idea[]>([]);
  const [summary, setSummary] = useState<MiningSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRequestDone, setIsRequestDone] = useState<boolean>(false);

  const hasStartedRef = useRef<boolean>(false);

  async function executeMining(force = false) {
    setCurrentStep(1);
    setIsCompleted(false);
    setErrorMsg(null);
    setMinedIdeas([]);
    setSummary(null);
    setIsRequestDone(false);

    const step2Timer = setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev, 2));
    }, 600);

    const step3Timer = setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev, 3));
    }, 1200);

    try {
      const response = await fetch("/api/mine-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 3,
          useMock: force,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Mining request failed");
      }

      const rawIdeas = Array.isArray(data.newIdeas) ? data.newIdeas : [];
      const mappedIdeas: Idea[] = rawIdeas.map((item: any) =>
        mapDbIdeaToIdea(item)
      );

      setSummary(
        data.summary || {
          scanned: rawIdeas.length,
          skipped: 0,
          added: rawIdeas.length,
        }
      );
      setMinedIdeas(mappedIdeas);
      setIsRequestDone(true);
    } catch (err: any) {
      console.warn("[ScanMiningModal] Mining pipeline error:", err);
      setErrorMsg(err.message || "Failed to scan tech communities");
      setIsRequestDone(true);
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      hasStartedRef.current = false;
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    executeMining(false);
  }, [isOpen]);

  // Transition to completed as soon as request finishes
  useEffect(() => {
    if (!isRequestDone || isCompleted) return;

    const finalizeTimer = setTimeout(() => {
      setIsCompleted(true);
    }, 400);

    return () => clearTimeout(finalizeTimer);
  }, [isRequestDone, isCompleted]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-eggshell border border-stone rounded-[24px] max-w-md w-full p-7 whisper-shadow relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone mb-5">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                errorMsg
                  ? "bg-ember-orange"
                  : isCompleted
                  ? "bg-ink"
                  : "bg-ember-orange animate-pulse"
              }`}
            />
            <h3 className="text-base font-medium text-ink">
              Scan Reddit for ideas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-smoke hover:text-ink text-sm font-mono cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {!isCompleted ? (
          <div className="space-y-4 mb-6">
            {/* Step 1 */}
            <div
              className={`flex items-start gap-3 text-xs transition-opacity ${
                currentStep >= 1 ? "opacity-100" : "opacity-40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono transition-all ${
                  currentStep > 1
                    ? "bg-ink text-eggshell"
                    : "bg-ink text-eggshell animate-pulse"
                }`}
              >
                {currentStep > 1 ? "✓" : "1"}
              </span>
              <div>
                <p className="font-medium text-ink">1. Fetch posts</p>
                <p className="text-smoke text-[11px]">
                  Scanning r/SomebodyMakeThis, r/SideProject, and r/webdev for problem posts...
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`flex items-start gap-3 text-xs transition-opacity ${
                currentStep >= 2 ? "opacity-100" : "opacity-40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono transition-all ${
                  currentStep > 2
                    ? "bg-ink text-eggshell"
                    : currentStep === 2
                    ? "bg-ink text-eggshell animate-pulse"
                    : "bg-warm-taupe border border-stone text-smoke"
                }`}
              >
                {currentStep > 2 ? "✓" : "2"}
              </span>
              <div>
                <p className="font-medium text-ink">2. Check duplicates</p>
                <p className="text-smoke text-[11px]">
                  Checking URLs against saved ideas in the database...
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`flex items-start gap-3 text-xs transition-opacity ${
                currentStep >= 3 ? "opacity-100" : "opacity-40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono transition-all ${
                  currentStep === 3
                    ? "bg-ink text-eggshell animate-pulse"
                    : "bg-warm-taupe border border-stone text-smoke"
                }`}
              >
                3
              </span>
              <div>
                <p className="font-medium text-ink">3. Generate project specs</p>
                <p className="text-smoke text-[11px]">
                  Extracting problem statements and tech stacks with Gemini Flash...
                </p>
              </div>
            </div>
          </div>
        ) : errorMsg ? (
          <div>
            <div className="bg-warm-taupe border border-stone rounded-[16px] p-4 mb-5 text-xs text-ink">
              <p className="font-medium mb-1 text-ember-orange">Scanning Notice</p>
              <p className="text-[11px] leading-relaxed text-smoke">
                {errorMsg}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full pill bg-ink text-eggshell text-xs py-2.5 font-medium hover:bg-graphite transition-all cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-warm-taupe rounded-[16px] p-4 border border-stone mb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-ink font-semibold mb-3">
                <span>✓ Scan complete</span>
                <span className="text-smoke">
                  •{" "}
                  {minedIdeas.length > 0
                    ? `${minedIdeas.length} new ${
                        minedIdeas.length === 1 ? "idea" : "ideas"
                      } found`
                    : "No new unique ideas"}
                </span>
              </div>

              {minedIdeas.length > 0 ? (
                <div className="text-xs text-graphite space-y-2 max-h-56 overflow-y-auto pr-1">
                  {minedIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-2.5 bg-eggshell rounded-[12px] border border-stone/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex items-center gap-1.5 flex-1">
                        <span className="pill px-2 py-0.5 bg-warm-taupe text-[10px] font-mono shrink-0">
                          {idea.category}
                        </span>
                        <span className="font-medium text-ink truncate text-[11px]">
                          {idea.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-ink bg-eggshell border border-stone px-2 py-0.5 rounded-full shrink-0">
                        NEW
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-smoke py-1 leading-relaxed">
                    Scanned {summary?.scanned ?? 3} discussions across tech communities (r/SomebodyMakeThis, r/SideProject, r/webdev). {summary?.skipped ?? 3} posts were already indexed.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      executeMining(true);
                    }}
                    className="w-full pill bg-warm-taupe border border-stone text-ink text-xs py-2 font-medium hover:border-graphite transition-all cursor-pointer shadow-2xs"
                  >
                    ⚡ Force Mine Fresh Ideas
                  </button>
                </div>
              )}
            </div>

            {minedIdeas.length > 0 ? (
              <button
                onClick={() => onApplyNewIdeas(minedIdeas)}
                className="w-full pill bg-ink text-eggshell text-xs py-2.5 font-medium hover:bg-graphite transition-all cursor-pointer shadow-xs"
              >
                View new ideas in feed →
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    const el = document.getElementById("explore");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
                className="w-full pill bg-ink text-eggshell text-xs py-2.5 font-medium hover:bg-graphite transition-all cursor-pointer shadow-xs"
              >
                Back to feed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
