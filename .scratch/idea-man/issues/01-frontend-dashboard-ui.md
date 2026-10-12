# 01: [Frontend] Next.js Dashboard UI Shell, Routes, How-It-Works & Components

**What to build:**
Tampilan web dashboard direktori ide proyek modern dengan gaya desain **Warm Cream Editorial** mengacu pada prototype final ([`prototype.html`](../../prototype.html)) dan [`ElevenLabs-DESIGN.md`](../../ElevenLabs-DESIGN.md). Dirancang sebagai **Personal MVP Ultra-Minimalis** (tanpa beban otentikasi login/signup, tanpa spotlight carousel, tanpa upvote):
- Canvas: Eggshell (`#fdfcfc`), Card surfaces: Warm Taupe (`#f5f3f1`), Hairline borders: Stone (`#ebe8e4`).
- Tipografi: Whisper headlines (font Inter weight 400, tracking `-0.03em`, leading `1.08`), body Inter 400/500, font mono untuk metadata & badges.
- Shape: Tombol, filter tabs, dan search bar full pill (radius `9999px`), kartu ide radius `20px` / `24px`.
- Interaksi & Fitur:
  1. **Top Navigation Bar Minimalis**: Wordmark "Idea-man", status MVP (`v0.1-mvp`), dan tombol navigasi `Saved Ideas` dengan counter badge lokal (tanpa tombol login / sign up).
  2. **Hero Section Editorial Terpusat (Base.org style)**:
     - 2-Baris Headline: *"Stop guessing <br />what to build."*
     - Sub-headline: *"We listen to real discussions across tech communities to find genuine problems people are begging someone to build solutions for."*
     - Dual CTA buttons: Tombol utama *"Scan & Mine Ideas"* & tombol sekunder *"Explore Blueprints ↓"* (smooth-scroll ke `#explore`).
     - Micro-proof badge: *"50+ validated blueprints mined from tech discussions"*.
  3. **Section "How Idea-man Works" Storytelling Pipeline**:
     - Section Header: Judul bold terpusat *"From Community Noise to Production Blueprints"*.
     - Connecting Seams: Panah penghubung vertikal (`↓`) antar-step.
     - Step 01 (Real Community Discussions): Visual Reddit-style radar monitor (`r/tech_discussions`), cuplikan keluhan realistis, dan counter diskusi.
     - Step 02 (Smart Problem Analysis): Visual AI synthesis box dengan laser beam scanner interaktif, penunjuk input mentah vs fluff stripped, dan kartu ekstraksi core problem.
     - Step 03 (Ready-to-Build Blueprints - The Result): Kontainer warm-taupe dengan showcase blueprint card kontras tinggi bergaya eggshell (`BLUEPRINT #084 READY`).
  4. **Action Bar Terintegrasi**: Search input yang melakukan pencarian / navigasi ke `/search?q=...` dan tombol *"Scan & Mine Ideas"* (tanpa emoji).
  5. **Filter Pills Bar**: Kategori (All, Web App, DevTool, AI Tool, Automation) & Difficulty (All, Beginner, Intermediate, Advanced) beserta counter jumlah ide.
  6. **Discovered Opportunities Grid (Compact Line Clamp - Variant A)**: 
     - 3-kolom kartu ide dengan anchor `#explore`.
     - Desain hemat ruang vertikal (~35% lebih ramping): Paragraf *Pain Point* dan *Proposed Solution* menggunakan utility `line-clamp-2` agar tinggi setiap kartu seragam dan tidak memanjang berlebihan.
     - Action footer: Tombol **Save ☆ / Saved ★** (disimpan di `localStorage`), tombol **Detail ↗** (membuka modal spesifikasi 100% lengkap tanpa potongan), dan link **Source ↗** ke Reddit.
     - *Dihapus*: Tombol counter upvote dan section Spotlight of the Week Carousel.
  7. **Reusable Idea Detail Modal (`IdeaDetailModal`)**: Modal pop-up untuk melihat spesifikasi lengkap (masalah, solusi, target audiens, tech stack) dan interaksi simpan ide.
  8. **Autonomous Idea Mining Modal (`ScanMiningModal`)**: Feedback visual interaktif 3-tahap proses ekstraksi Reddit & AI.
  9. **Halaman Saved Ideas (`/saved`)**: Papan ide tersimpan dengan judul utama *"Personal Repository"* terpusat di tengah, badge counter ide tersimpan di `localStorage`, filter kategori, detail modal, dan empty state ramah tanpa login.
  10. **Halaman Search Results (`/search?q=...`)**: Halaman hasil pencarian terdedikasi dengan input pencarian terintegrasi, filter, dan hasil ide relevan.

**Blocked by:** None (can start immediately)

**Status:** completed

### Checklist Pengerjaan:
- [x] Project Next.js (App Router) + Tailwind CSS terinisialisasi dan berjalan tanpa error
- [x] Tailwind CSS terkonfigurasi dengan design tokens ElevenLabs (colors: eggshell, warm-taupe, stone, ink, graphite, smoke, orb-gradient; font mapping Inter & JetBrains Mono; radii: 20px, 9999px)
- [x] Sederhanakan Top Nav Bar: Tampilkan wordmark "Idea-man", indicator status MVP, dan tombol `Saved Ideas` (hapus total login & signup)
- [x] Hero Section bergaya editorial terpusat (2-line headline, sub-headline engaging, dual CTA buttons, micro-proof pill)
- [x] Section "How Idea-man Works" Storytelling Pipeline (3 langkah visual: Ingestion, AI synthesis laser beam, Blueprint showcase)
- [x] Action Bar di atas Grid: Search Bar pill + Tombol "Scan & Mine Ideas" (tanpa emoji ✨)
- [x] Hapus komponen `SpotlightCarousel` dari homepage (`src/app/page.tsx`) agar alur navigasi langsung menuju filter bar & grid
- [x] Filter Bar (tabs Category: All, Web App, DevTool, AI Tool, Automation & dropdown Difficulty)
- [x] Perbarui Idea Card Component (`IdeaCard.tsx`):
  - [x] Terapkan `line-clamp-2` pada paragraf Pain Point dan Proposed Solution agar kartu compact & simetris
  - [x] Hapus counter/tombol aksi upvote
  - [x] Tata letak footer bersih: Tombol Save di kiri, tombol Detail ↗ dan Source ↗ di kanan
- [x] Perbarui Modal Komponen `IdeaDetailModal` (menampilkan detail spesifikasi lengkap 100% tanpa potongan dan tombol save, tanpa upvote)
- [x] Modal Komponen `ScanMiningModal` (feedback visual 3 tahapan ekstraksi tanpa AI-slop)
- [x] Halaman Saved Ideas (`src/app/saved/page.tsx`) dengan judul "Personal Repository" terpusat dan sinkronisasi localStorage
- [x] Halaman Search Results (`src/app/search/page.tsx`) dengan query string handling dan Suspense boundary
- [x] Hapus rute autentikasi `src/app/login/` dan `src/app/signup/`
- [x] Verifikasi linting dan production build Next.js (0 errors)
