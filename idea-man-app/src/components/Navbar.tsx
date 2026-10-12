"use client";

import React from "react";
import Link from "next/link";
import { useIdeaStorage } from "../hooks/useIdeaStorage";

interface NavbarProps {
  activePath?: "home" | "saved";
}

export const Navbar: React.FC<NavbarProps> = ({ activePath = "home" }) => {
  const { savedCount } = useIdeaStorage();

  return (
    <header className="border-b border-stone px-6 py-4 max-w-7xl mx-auto w-full flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group cursor-pointer">
        <div className="w-7 h-7 rounded-full orb-gradient flex items-center justify-center shadow-xs transition-transform group-hover:scale-105" />
        <span className="font-medium tracking-tight text-lg text-ink">
          Idea-man
        </span>
        <span className="text-xs bg-warm-taupe border border-stone text-smoke px-2.5 py-0.5 rounded-full font-mono">
          v0.1-mvp
        </span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Saved Ideas Button */}
        <Link
          href="/saved"
          className={`pill px-3.5 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
            activePath === "saved"
              ? "bg-ink text-eggshell"
              : "bg-warm-taupe border border-stone text-graphite hover:border-graphite"
          }`}
          title="View your saved ideas"
        >
          <span>★</span>
          <span className="hidden sm:inline">Saved Ideas</span>
          <span className="sm:hidden">Saved</span>
          {savedCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activePath === "saved"
                  ? "bg-eggshell text-ink"
                  : "bg-ink text-eggshell"
              }`}
            >
              {savedCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
