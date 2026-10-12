"use client";

import React from "react";

interface HeroProps {
  onTriggerScan?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onTriggerScan }) => {
  const handleScrollToExplore = () => {
    const el = document.getElementById("explore");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      aria-label="Introduction and Overview" 
      className="pt-8 md:pt-14 pb-14 text-center max-w-3xl mx-auto flex flex-col items-center"
    >
      {/* 2-Line Split Headline with fluid responsive typography */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] whisper-headline text-ink mb-5">
        Stop guessing <br className="hidden sm:inline" />
        what to build.
      </h1>

      {/* Sub-headline */}
      <p className="text-base md:text-lg text-smoke font-normal leading-relaxed max-w-2xl mb-8">
        We listen to real discussions across tech communities to find genuine
        problems people are begging someone to build solutions for.
      </p>

      {/* Dual CTA Buttons with full keyboard focus support */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
        <button
          type="button"
          onClick={onTriggerScan}
          className="pill bg-ink text-eggshell text-sm font-medium px-6 py-3 hover:bg-graphite transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-eggshell"
        >
          Scan &amp; Mine Ideas
        </button>
        <button
          type="button"
          onClick={handleScrollToExplore}
          className="pill bg-warm-taupe border border-stone text-graphite hover:text-ink hover:border-graphite text-sm font-medium px-6 py-3 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-eggshell"
        >
          Explore Blueprints <span aria-hidden="true" className="ml-0.5">↓</span>
        </button>
      </div>

      {/* Micro-proof badge */}
      <div className="flex items-center gap-2 text-xs font-mono text-smoke">
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-graphite/40" />
        <span>50+ validated blueprints mined from tech discussions</span>
      </div>
    </section>
  );
};

