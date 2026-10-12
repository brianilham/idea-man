# Impeccable Critique Snapshot — Hero & HowItWorks

**Target:** `idea-man-app/src/components/Hero.tsx` & `idea-man-app/src/components/HowItWorks.tsx`  
**Date:** 2026-10-12  
**Method:** dual-agent (A: 6ae62532-4ef3-40b5-9697-33351d4a5996 · B: 516c88c4-2eef-4ab0-99cc-45a413d644dd)  
**Surface Mode:** Persuade (Landing Page)  

---

### Design Health Score (Nielsen Heuristics)

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 2/4 | Pulsing green "LIVE INGESTION" telemetry in Step 1 is hardcoded simulation. |
| 2 | Match System / Real World | 3/4 | Authentic developer problem domain copy; minor phrasing issue in Hero ("what you build"). |
| 3 | User Control and Freedom | 2/4 | "Inspect Blueprint ↗" in Step 3 is a dead span with no click/keyboard handler. |
| 4 | Consistency and Standards | 1/4 | Step 3 container flips to pitch-black (#0e1113); 14+ ad-hoc colors; section header breaks whisper typography. |
| 5 | Error Prevention | 3/4 | Primary buttons have good hitboxes, but dead links induce user click friction. |
| 6 | Recognition Rather Than Recall | 3/4 | Clear 3-step sequence (Listen → Understand → Result). |
| 7 | Flexibility and Efficiency | n/a | Persuade/Landing mode: accelerators belong in interactive search/mining views. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Obsidian monolith, neon pings, and raw Reddit colors clash with Bauhaus cream editorial. |
| 9 | Error Recovery | 3/4 | Smooth scroll fallback on Hero button; no user input errors on static section. |
| 10 | Help and Documentation | n/a | Persuade/Landing mode: landing page copy is self-documenting. |
| **Total** | | **19/32** | **Acceptable (59.4%)** |

---

### Priority Issues

- **[P1] Obsidian Theme Inversion in Step 3**: Step 3 outer container flips to pitch-black `bg-[#0e1113]`, shattering the warm cream notebook continuity.
- **[P1] Dead Click Affordance on "Inspect Blueprint ↗"**: Line 286 is an un-clickable, un-focusable `<span>` with `cursor-pointer`.
- **[P2] WCAG AA Contrast Failures in Step 2**: `text-ember-orange` on `bg-warm-taupe/90` has 3.08:1 contrast; `text-emerald-600` has 3.44:1 (both require min 4.5:1).
- **[P2] Color Token Leakage & Reddit Hex Sprawl**: 9 raw hex colors hardcoded across 20+ locations in `HowItWorks.tsx`.
- **[P2] Typographic Cadence Rupture**: Section title uses `font-bold tracking-tight text-ink` instead of `whisper-headline`.
- **[P3] Hero Headline Phrasing & Fluid Mobile Scale**: "Stop guessing what you build" vs "what to build", plus cramped `pt-4` spacing.
