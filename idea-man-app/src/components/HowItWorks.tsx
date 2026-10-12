"use client";

import React from "react";
import { Idea } from "../types/idea";

interface HowItWorksProps {
  onInspectBlueprint?: (blueprint: Idea) => void;
}

const mockBlueprintSample: Idea = {
  id: "sample-blueprint-084",
  title: "API Mocking Proxy for Edge Workers",
  problem_summary:
    "Local mock webhook servers timeout offline, interrupting developer flow and wasting hours waiting for live endpoints.",
  proposed_solution:
    "A zero-config local HTTP caching and mock proxy that intercepts and records webhooks for offline replay during development.",
  target_audience: "Web & Backend Engineers",
  recommended_stack: ["TypeScript", "Bun", "Cloudflare"],
  difficulty: "Intermediate",
  category: "DevTool",
  upvotes: 142,
  url: "https://www.reddit.com/r/tech_discussions",
  author: "tech_wanderer",
  subreddit: "tech_discussions",
};

export const HowItWorks: React.FC<HowItWorksProps> = ({ onInspectBlueprint }) => {
  const handleInspectClick = () => {
    if (onInspectBlueprint) {
      onInspectBlueprint(mockBlueprintSample);
    } else {
      const el = document.getElementById("explore");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section 
      aria-label="How Idea-man Works" 
      className="pt-4 pb-16 md:pb-24 border-b border-stone mb-12"
    >
      {/* Section Title with editorial whisper headline */}
      <div className="text-center mb-12 px-1">
        <h2 className="text-3xl md:text-4xl whisper-headline text-ink">
          From Community Noise to Production Blueprints
        </h2>
      </div>

      <div className="space-y-6">
        {/* Row 1: Step 01 / Listen (Editorial Index Card Style) */}
        <div className="bg-warm-taupe border border-stone rounded-[28px] p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xs">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-mono text-smoke bg-eggshell border border-stone px-3 py-1 rounded-full inline-block">
              Step 01 / Listen
            </span>
            <h3 className="text-2xl sm:text-3xl whisper-headline text-ink">
              Real Community Discussions
            </h3>
            <p className="text-sm md:text-base text-smoke leading-relaxed font-normal">
              People openly talk about their everyday frustrations and wished-for
              tools on tech forums. We capture those honest problems before
              anyone else builds a solution.
            </p>
            <ul className="space-y-2 text-xs font-mono text-graphite pt-2">
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ember-orange" />
                <span>Real user complaints, not guesswork or surveys</span>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ember-orange" />
                <span>Filtered from spam, self-promotion, and marketing noise</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-6">
            {/* Bauhaus Editorial Index Card Radar */}
            <div className="bg-eggshell border border-stone rounded-[24px] p-5 sm:p-6 shadow-2xs space-y-3.5">
              {/* Radar Header */}
              <div className="flex items-center justify-between border-b border-stone/80 pb-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-ember-orange" />
                  <span className="text-ink font-semibold tracking-wide">
                    r/tech_discussions
                  </span>
                </div>
                <div className="flex items-center gap-2 text-smoke text-[11px]">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-graphite/40" />
                  <span>COMMUNITY STREAM</span>
                </div>
              </div>

              {/* Discussion Snippet 1 */}
              <div className="bg-warm-taupe/70 border border-stone/80 rounded-xl p-3.5 space-y-2 hover:border-graphite/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-smoke">
                  <span>u/tech_wanderer • 4h ago</span>
                  <span className="text-graphite font-semibold flex items-center gap-1" aria-label="142 upvotes">
                    <span aria-hidden="true">▲</span> 142
                  </span>
                </div>
                <p className="text-xs text-graphite leading-relaxed">
                  &ldquo;Why isn&apos;t there an offline proxy for Cloudflare
                  Workers? Local mock webhooks time out everyday and waste
                  hours.&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
                  <span className="bg-eggshell text-graphite border border-stone px-2 py-0.5 rounded font-medium">
                    High Friction
                  </span>
                  <span className="text-smoke" aria-label="42 comments">42 comments</span>
                </div>
              </div>

              {/* Discussion Snippet 2 */}
              <div className="bg-warm-taupe/70 border border-stone/80 rounded-xl p-3.5 space-y-2 hover:border-graphite/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-smoke">
                  <span>u/solo_craft • 6h ago</span>
                  <span className="text-graphite font-semibold flex items-center gap-1" aria-label="89 upvotes">
                    <span aria-hidden="true">▲</span> 89
                  </span>
                </div>
                <p className="text-xs text-graphite leading-relaxed">
                  &ldquo;I keep writing conventional git commits manually and
                  losing my train of thought while pairing. Need hands-free
                  voice.&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
                  <span className="bg-eggshell text-graphite border border-stone px-2 py-0.5 rounded font-medium">
                    Feature Wish
                  </span>
                  <span className="text-smoke" aria-label="18 comments">18 comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connecting Flow Divider 1 -> 2 */}
        <div className="flex flex-col items-center justify-center -my-2" aria-hidden="true">
          <div className="w-px h-6 bg-stone" />
          <div className="w-7 h-7 rounded-full bg-eggshell border border-stone shadow-2xs flex items-center justify-center text-xs text-smoke font-mono my-0.5">
            ↓
          </div>
          <div className="w-px h-6 bg-stone" />
        </div>

        {/* Row 2: Step 02 / Understand (AI Problem Synthesis Card) */}
        <div className="bg-warm-taupe border border-stone rounded-[28px] p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xs">
          <div className="md:col-span-6 md:order-2 space-y-4">
            <span className="text-xs font-mono text-smoke bg-eggshell border border-stone px-3 py-1 rounded-full inline-block">
              Step 02 / Understand
            </span>
            <h3 className="text-2xl sm:text-3xl whisper-headline text-ink">
              Smart Problem Analysis
            </h3>
            <p className="text-sm md:text-base text-smoke leading-relaxed font-normal">
              Forum posts are often long and messy. Gemini AI extracts the real
              root problem, identifies who is struggling with it, and evaluates
              whether it is worth building.
            </p>
            <ul className="space-y-2 text-xs font-mono text-graphite pt-2">
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-graphite" />
                <span>Separates real frustration from conversational fluff</span>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-graphite" />
                <span>Pinpoints who will benefit most from the solution</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-6 md:order-1">
            {/* Visual AI Intelligence Extraction Card (Live Terminal Extraction Pipeline) */}
            <div className="bg-eggshell border border-stone rounded-[24px] p-6 shadow-2xs relative overflow-hidden space-y-4">
              {/* Glowing Laser Beam */}
              <div 
                aria-hidden="true" 
                className="laser-beam absolute left-0 right-0 pointer-events-none z-20"
              >
                <div className="h-0.5 bg-gradient-to-r from-transparent via-ember-orange to-transparent shadow-[0_0_8px_#ff4704]" />
                <div className="h-8 bg-gradient-to-b from-ember-orange/15 to-transparent -mt-0.5" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone/80 pb-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-ember-orange animate-ping" />
                  <span className="text-ink font-semibold tracking-wide">
                    Gemini AI Extraction Stream
                  </span>
                </div>
                <span className="text-[10px] bg-warm-taupe border border-stone px-2.5 py-0.5 rounded-full text-smoke">
                  Laser Scanner Active
                </span>
              </div>

              {/* Step 1 to Step 2 Ingestion Bridge */}
              <div className="bg-warm-taupe/90 border border-stone/80 rounded-xl p-3 space-y-2 relative">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-smoke flex items-center gap-1.5">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-graphite/40" />
                    Raw Reddit Thread Input
                  </span>
                  <span className="text-graphite font-semibold text-[10px] uppercase">
                    -82% Fluff Stripped
                  </span>
                </div>
                <div className="bg-eggshell/90 border border-stone/70 rounded-lg p-2.5 text-xs text-smoke font-mono leading-relaxed line-through decoration-stone/90 opacity-70">
                  &ldquo;Local mock webhooks time out everyday and waste hours...&rdquo;
                </div>
              </div>

              {/* Extraction Progress Indicator */}
              <div className="flex items-center justify-between px-1 text-[11px] font-mono text-smoke">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember-orange opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-ember-orange" />
                  </span>
                  <span>Scanning thread semantics...</span>
                </span>
                <span className="text-graphite font-semibold">1 Validated Blueprint</span>
              </div>

              {/* Synthesized Output Result */}
              <div className="bg-warm-taupe border border-stone rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-graphite bg-eggshell border border-stone px-2 py-0.5 rounded font-semibold">
                    Core Problem
                  </span>
                  <span className="text-[11px] font-mono text-graphite font-semibold">
                    High Dev Demand
                  </span>
                </div>
                <p className="text-xs text-ink font-medium leading-relaxed">
                  API Mocking Proxy: Local mock webhook servers timeout offline, interrupting developer flow.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Connecting Flow Divider 2 -> 3 */}
        <div className="flex flex-col items-center justify-center -my-2" aria-hidden="true">
          <div className="w-px h-6 bg-stone" />
          <div className="w-7 h-7 rounded-full bg-eggshell border border-stone shadow-2xs flex items-center justify-center text-xs text-smoke font-mono my-0.5">
            ↓
          </div>
          <div className="w-px h-6 bg-stone" />
        </div>

        {/* Row 3: Step 03 / Outcome (Harmonized Warm-Taupe Container with Eggshell Blueprint Card) */}
        <div className="bg-warm-taupe border border-stone rounded-[28px] p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xs">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-mono text-smoke bg-eggshell border border-stone px-3 py-1 rounded-full inline-block">
              Step 03 / The Result
            </span>
            <h3 className="text-2xl sm:text-3xl whisper-headline text-ink">
              Ready-to-Build Blueprints
            </h3>
            <p className="text-sm md:text-base text-smoke leading-relaxed font-normal">
              You get a clear, validated project idea ready for development.
              Each blueprint outlines the problem, a suggested solution, and
              the recommended tools to build it.
            </p>
            <ul className="space-y-2 text-xs font-mono text-graphite pt-2">
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-graphite" />
                <span>Clear problem and solution breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-graphite" />
                <span>Recommended modern tech stack ready to code</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-6">
            {/* Blueprint Showcase Card Inside Step 3 */}
            <div className="bg-eggshell border border-stone rounded-[24px] p-6 shadow-2xs space-y-4 text-ink">
              <div className="flex items-center justify-between border-b border-stone/80 pb-3">
                <span className="text-xs font-mono text-ink font-semibold">
                  BLUEPRINT #084 READY
                </span>
                <span className="text-xs font-mono bg-warm-taupe border border-stone px-2.5 py-0.5 rounded-full text-smoke">
                  Intermediate
                </span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-medium text-ink mb-1.5">
                  API Mocking Proxy for Edge Workers
                </h4>
                <p className="text-xs text-smoke leading-relaxed font-normal">
                  A zero-config local HTTP tool that replays past mock webhooks
                  offline, saving engineers hours of waiting for external
                  services.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-xs font-mono px-3 py-1 bg-warm-taupe border border-stone rounded-full text-graphite font-medium">
                  TypeScript
                </span>
                <span className="text-xs font-mono px-3 py-1 bg-warm-taupe border border-stone rounded-full text-graphite font-medium">
                  Bun
                </span>
                <span className="text-xs font-mono px-3 py-1 bg-warm-taupe border border-stone rounded-full text-graphite font-medium">
                  Cloudflare
                </span>
              </div>
              <div className="pt-3 border-t border-stone/60 flex items-center justify-between text-xs font-mono">
                <span className="text-smoke">Status: Ready to Build</span>
                <button
                  type="button"
                  onClick={handleInspectClick}
                  className="text-ink font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded-sm"
                >
                  <span>Inspect Blueprint</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

