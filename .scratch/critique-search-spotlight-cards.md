# Impeccable Critique Snapshot — Search, Spotlight & Idea Grid Card

**Target:** `ActionBar.tsx`, `SpotlightCarousel.tsx`, `IdeaCard.tsx`, `FilterBar.tsx`  
**Date:** 2026-10-12  
**Method:** dual-agent (A: 60653a74-87ff-4627-867d-474be2d0fd0c · B: 3521781f-2c82-4e21-8265-b4b35b48926e)  
**Surface Mode:** Persuade / Explore (Landing Page Workspace)  

---

### Design Health Score (Nielsen Heuristics)

| # | Heuristic | Score | Key Finding |
|---|-----------|:-----:|-------------|
| 1 | Visibility of System Status | 2/4 | Spotlight auto-play 5s tidak punya pause toggle, tidak berhenti saat keyboard focus (WCAG 2.2.2). |
| 2 | Match System / Real World | 3/4 | Terminologi dev baik ("DevTool", "Stack"), namun menggabungkan input Search dengan tombol scraper mandiri "Scan & Mine Ideas" membingungkan model mental. |
| 3 | User Control and Freedom | 2/4 | Pengguna keyboard tidak bisa menjeda rotasi carousel; slide off-screen tetap menerima tab focus (invisible focus trap). |
| 4 | Consistency and Standards | 2/4 | "Detail ↗" (modal) dan "Source ↗" (external Reddit) memakai simbol identik; token emerald-50 liar; judul kartu belum konsisten dengan whisper-headline. |
| 5 | Error Prevention | 3/4 | Tombol clear search baik, namun touch target di mobile sangat kecil (<22px). |
| 6 | Recognition Rather Than Recall | 3/4 | Filter bar dan tags jelas, namun search bar tidak memiliki keyboard shortcut (/ atau Cmd+K) atau saran stack. |
| 7 | Flexibility and Efficiency | n/a | Mode Persuade/Explore. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Orb-gradient blur 2px tampak seperti artefak murahan ("AI slop") di atas tema Bauhaus; paragraf Pain Point & Solution di kartu monoton tanpa pembeda hirarki. |
| 9 | Error Recovery | 3/4 | Reset search & filter bekerja normal. |
| 10 | Help and Documentation | n/a | Mode Persuade/Explore. |
| **Total** | | **20/32** | **Acceptable (62.5%)** |

---

### Priority Issues

- **[P1] Pelanggaran Kontras WCAG AA Ekstrem pada Typography Sekunder**: `text-ash` pada `bg-warm-taupe` bernilai 2.37:1 (Gagal 4.5:1); `text-smoke` bernilai 4.36:1 pada teks 12px. Inactive pagination dots bernilai 1.10:1 (hampir transparan).
- **[P1] Aksesibilitas Carousel Rusak (WCAG 2.2.2 & Invisible Focus Trap)**: Auto-play tidak berhenti saat keyboard focus, tidak ada tombol pause; slide yang tergeser keluar layar tetap menerima focus Tab.
- **[P2] Conflated Action Bar (Search vs. Autonomous Scraper)**: Input search digabung satu baris dengan tombol "Scan & Mine Ideas", membuat pengguna mengira tombol tersebut akan mengeksekusi pencarian query.
- **[P2] Monotoni & Kepadatan Paragraf pada IdeaCard**: "Pain Point" dan "Proposed Solution" tampil bertumpuk tanpa diferensiasi visual; heading memiliki handler klik tapi tidak keyboard-accessible; tap target Source & dot <24px.
- **[P3] Orb Gradient Blur & Glyph Screen Reader Pollution**: Orb gradient 320px dengan blur 2px pecah/tidak menyatu dengan Bauhaus; karakter ←, →, ▲, ↗, ✕, ↵ dibaca mentah oleh screen reader.
