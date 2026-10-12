# SPEC: Idea-man (Project Idea Radar & Directory)

Dokumen spesifikasi teknis resmi untuk proyek **Idea-man**, dirancang sebagai **Personal MVP Ultra-Minimalis** berbasis Next.js App Router, Supabase PostgreSQL, dan Google Gemini AI.

---

## 1. Executive Summary & Destination

**Idea-man** adalah direktori ide proyek dan alat penemu peluang (*opportunity radar*) ultra-ramping yang dibuat untuk membantu developer dan indie hacker menemukan ide aplikasi nyata dari keluhan (*pain points*) dan diskusi komunitas teknologi (Reddit).

Aplikasi ini mengedepankan **kemudahan akses instan tanpa friksi**:
- **Bebas Akun**: Tidak memerlukan login atau sign up.
- **Bebas Upvote / Rating Vanity**: Fokus murni pada masalah yang valid dan solusi teknis.
- **Kurasi Langsung**: Alur halaman to-the-point tanpa carousel spotlight yang memperpanjang scroll.
- **On-Demand Mining**: Tombol pemindai cerdas yang menarik diskusi Reddit baru, menduplikasi terhadap database, dan mengekstrak blueprint proyek terstruktur via AI.

---

## 2. Tech Stack Architecture

| Layer | Teknologi | Peran & Detail |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16 (App Router) + React 19 + Tailwind CSS v4** | Client & Server Components, desain Warm Cream Editorial ElevenLabs, cepat, ringan, responsif. |
| **Database** | **Supabase PostgreSQL** | Penyimpanan persisten untuk direktori ide hasil ekstraksi, deduplikasi via `url` UNIQUE, dan indeks performa. |
| **Database SDK** | **`@supabase/supabase-js` + `@supabase/ssr`** | Native TypeScript client untuk browser, server components, dan service-role admin. |
| **AI Extraction Engine** | **Google Gemini Flash API** (`gemini-3.5-flash-lite`) | Ekstraksi terstruktur (JSON Schema) ultra-cepat yang memisahkan keluhan inti dari noise/fluff komunitas. |
| **Data Ingestion** | **Reddit Atom RSS Parser + Reddit API Fallback** | Pengambilan postingan publik dari target subreddits (`r/SomebodyMakeThis`, `r/SideProject`, `r/webdev`) tanpa hambatan pemblokiran 403. |
| **State & Bookmark** | **Browser LocalStorage (`useSyncExternalStore`)** | Penyimpanan bookmark instan (*Saved Ideas*) tanpa memerlukan akun atau tabel relasi user. |

---

## 3. Database Schema (Supabase PostgreSQL)

Skema database tabel utama di Supabase (`supabase/migrations/01_create_ideas.sql`):

```sql
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    problem_summary TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    recommended_stack TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    category TEXT NOT NULL CHECK (category IN ('Web App', 'DevTool', 'AI Tool', 'Automation')),
    url TEXT NOT NULL UNIQUE,
    author TEXT NOT NULL DEFAULT 'anonymous',
    subreddit TEXT,
    upvotes INTEGER NOT NULL DEFAULT 0, -- Nilai skor awal dari postingan Reddit asli
    is_new BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indeks Performa & Deduplikasi
CREATE INDEX IF NOT EXISTS idx_ideas_category ON public.ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_difficulty ON public.ideas(difficulty);
CREATE INDEX IF NOT EXISTS idx_ideas_url ON public.ideas(url);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON public.ideas(created_at DESC);
```

---

## 4. Ingestion & Extraction Pipeline

### Alur Ekstraksi Komunitas:
1. **Trigger**: Pengguna mengklik tombol *"Scan & Mine Ideas"* di Action Bar atau Hero.
2. **Fetch Reddit Data**: Sistem mengambil postingan terbaru dari Reddit RSS feed / API publik (`r/SomebodyMakeThis`, `r/SideProject`, dll.).
3. **Deduplikasi Cepat**: Sistem memverifikasi URL postingan terhadap indeks `idx_ideas_url` di Supabase. Postingan yang sudah pernah ditambang langsung dilewati.
4. **Transformasi AI (Gemini Flash)**: Mengirimkan teks keluhan ke model Gemini dengan structured prompt anti-slop untuk menghasilkan:
   - `title`: Judul ringkas dan deskriptif.
   - `problem_summary`: Inti permasalahan (1–2 kalimat).
   - `proposed_solution`: Solusi software yang aplikatif (1–2 kalimat).
   - `target_audience`: Pengguna spesifik yang paling membutuhkan solusi.
   - `recommended_stack`: Rekomendasi 2–4 teknologi modern (Next.js, Bun, Tailwind, Supabase, dll.).
   - `difficulty`: `'Beginner'` | `'Intermediate'` | `'Advanced'`.
   - `category`: `'Web App'` | `'DevTool'` | `'AI Tool'` | `'Automation'`.
5. **Penyimpanan Persisten**: Menyimpan ide baru ke Supabase via `createAdminClient` (Service Role Key).
6. **Live Feed Update**: Ide baru otomatis disuntikkan ke tampilan feed teratas secara reaktif tanpa perlu me-reload peramban.

---

## 5. UI & Design System (ElevenLabs Warm Cream Editorial)

Frontend mengadopsi standar visual **Warm Cream Editorial** mengacu pada [`ElevenLabs-DESIGN.md`](./ElevenLabs-DESIGN.md) dan prototype final ([`prototype.html`](./prototype.html)):

### A. Design Tokens & Styling
- **Canvas / Background**: Eggshell `#fdfcfc` (warm paper-like).
- **Surfaces**: Warm Taupe `#f5f3f1` untuk container kartu dan section.
- **Hairline Borders**: Stone `#ebe8e4` (1px clean border).
- **Typography**:
  - **Headings**: Inter regular weight 400, tight tracking `-0.03em`, leading `1.08` (*whisper-weight authority*).
  - **Body / Labels**: Inter 400 & 500, font mono untuk metadata & badges.
  - **Radii**: Tombol dan pills: `9999px` (full pill), Kartu ide: `22px` (`rounded-[22px]`).

### B. Fitur & Komponen Dashboard
1. **Top Nav Bar**:
   - Wordmark "Idea-man" dengan orb gradient logo dan badge versi `v0.1-mvp`.
   - Tombol `Saved Ideas` dengan counter badge lokal (tersimpan via `localStorage`). Bebas login/signup.
2. **Hero Section (Base.org Editorial Style)**:
   - 2-Baris Headline: *"Stop guessing <br />what to build."*
   - Sub-headline: *"We listen to real discussions across tech communities to find genuine problems people are begging someone to build solutions for."*
   - Dual CTA Buttons: *"Scan & Mine Ideas"* dan *"Explore Blueprints ↓"*.
   - Micro-proof badge: *"50+ validated blueprints mined from tech discussions"*.
3. **Section "How Idea-man Works" Storytelling Pipeline**:
   - Header terpusat: *"From Community Noise to Production Blueprints"*.
   - Step 01 (Listen): Visual Reddit radar monitor (`r/tech_discussions`) dengan cuplikan keluhan realistis.
   - Step 02 (Understand): Visual AI problem analysis dengan laser scan beam interaktif.
   - Step 03 (The Result): Blueprint showcase card siap bangun (`BLUEPRINT #084 READY`).
4. **Action Bar Terintegrasi**:
   - Kolom pencarian pill (navigasi langsung ke `/search?q=...`) + Tombol aksi *"Scan & Mine Ideas"*.
5. **Filter Bar**:
   - Tabs kategori (*All, Web App, DevTool, AI Tool, Automation*).
   - Dropdown tingkat kesulitan (*All Levels, Beginner, Intermediate, Advanced*).
   - Counter total ide aktif.
6. **Discovered Opportunities Grid (Compact Line Clamp - Variant A)**:
   - Grid 3-kolom kartu ide ber-surface Warm Taupe.
   - **Tinggi Vertikal Kompak**: Paragraf *Pain Point* dan *Proposed Solution* menggunakan utility `line-clamp-2` sehingga kartu tidak memanjang berlebihan dan tinggi setiap kartu selalu seimbang.
   - Footer kartu: Tombol **Save ☆ / Saved ★**, tombol **Detail ↗**, dan link **Source ↗** ke thread Reddit asli.
7. **Modal Dialogs**:
   - **Idea Detail Modal (`IdeaDetailModal`)**: Membaca 100% spesifikasi ide lengkap tanpa potongan (Problem, Solution, Target Audience, Difficulty, Stack) dan tombol aksi bookmark.
   - **Scan Mining Modal (`ScanMiningModal`)**: Feedback visual animasi 3 tahapan penambangan Reddit & AI.
8. **Halaman Personal Repository (`/saved`)**:
   - Halaman khusus untuk mengelola seluruh ide yang disimpan di peramban, dilengkapi counter dan filter kategori.
9. **Halaman Search Results (`/search`)**:
   - Pencarian real-time berdasarkan kata kunci masalah, judul, dan tech stack.

---

## 6. Production Deployment Mechanism & Infrastructure

Mekanisme deployment Idea-man dirancang untuk *zero-maintenance* dan performa tinggi menggunakan kombinasi arsitektur **Serverless Frontend/API (Vercel)** dan **Managed PostgreSQL (Supabase)**:

### A. Arsitektur Hosting & Runtime
1. **Frontend & API Routes (Vercel)**:
   - **Root Directory**: `idea-man-app`
   - **Framework Preset**: Next.js (App Router v16)
   - **Runtime**: Node.js 20.x
   - **Build Command**: `next build` (atau `npm run build`)
   - **Output Directory**: `.next`
   - **Serverless Execution Limits**: Route Handler `/api/mine-ideas` mengeksekusi pengambilan data Reddit dan ekstraksi Gemini AI secara paralel. Konfigurasi `export const maxDuration = 60;` direkomendasikan pada route handler agar terhindar dari batas waktu serverless default (10–15s).

2. **Database & Storage Layer (Supabase)**:
   - **Engine**: Managed PostgreSQL 15+
   - **Migration Delivery**: Skema DDL dieksekusi via `supabase/migrations/01_create_ideas.sql` (mendukung tabel `ideas`, auto-generated UUID, constraint kategori/difficulty, indeks URL UNIQUE, created_at DESC, dan FTS GIN index).
   - **Data Seeding**: Seeding data awal melalui `supabase/seed.sql` atau script CLI `npm run seed:supabase`.
   - **Row Level Security (RLS)**:
     - Public Read: `SELECT` diizinkan untuk semua pengguna (anonim & publik).
     - Admin/Ingestion Bypass: `INSERT`, `UPDATE`, `DELETE` hanya diizinkan via `SUPABASE_SERVICE_ROLE_KEY` pada route handler backend dan script CLI.

### B. Spesifikasi Variabel Lingkungan (Environment Variables)

| Variable | Scope | Wajib? | Keterangan & Asal Nilai |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client & Server) | Ya | URL project Supabase (`https://<project-ref>.supabase.co`). Diperoleh dari Supabase Dashboard > Project Settings > API. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client & Server) | Ya | Supabase Anon / Publishable Key untuk kueri client-side. |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret (Server Only) | Ya | Supabase Service Role Key untuk bypass RLS pada route handler penambangan (`/api/mine-ideas`). Jangan pernah diekspos ke client! |
| `GEMINI_API_KEY` | Secret (Server Only) | Ya | API Key Google Gemini Flash dari Google AI Studio (`aistudio.google.com`). Digunakan untuk ekstraksi terstruktur JSON. |
| `REDDIT_CLIENT_ID` | Secret (Server Only) | Opsional | Client ID aplikasi Reddit (tipe 'script'). Jika kosong, otomatis fallback ke Reddit Atom RSS feed. |
| `REDDIT_CLIENT_SECRET` | Secret (Server Only) | Opsional | Client Secret aplikasi Reddit. |
| `REDDIT_USER_AGENT` | Secret (Server Only) | Opsional | User agent Reddit kustom untuk menghindari blokir rate-limit. |

### C. Alur Deployment (CI/CD Workflow)
1. **Push ke Git Repository**:
   - Push commit ke branch utama (`main`).
2. **Vercel Build Pipeline**:
   - Vercel mendeteksi push, menginstal dependensi (`npm install`), dan menjalankan `npm run build`.
   - Turbopack/Next.js melakukan optimasi aset statis, tree-shaking, dan pre-rendering rute SSR/SSG.
3. **Database Migration Verifikasi**:
   - Pastikan migrasi `01_create_ideas.sql` telah diaplikasikan pada Supabase production sebelum deployment pertama kali aktif.
4. **Smoke Testing Pasca-Deploy**:
   - Verifikasi halaman utama (`/`) menampilkan kartu ide langsung dari Supabase.
   - Verifikasi modal *Scan & Mine Ideas* berhasil memanggil `/api/mine-ideas` dan menyimpan ide baru tanpa error CORS/timeout.
   - Verifikasi fitur pencarian (`/search`) dan bookmark lokal (`/saved`) berfungsi mulus.

---

## 7. Roadmap Status (Issues)

1. **[01-frontend-dashboard-ui.md](.scratch/idea-man/issues/01-frontend-dashboard-ui.md)**: Frontend Next.js Dashboard UI Shell, Routes, How-It-Works & Compact Cards (`completed`).
2. **[02-database-postgresql-setup.md](.scratch/idea-man/issues/02-database-postgresql-setup.md)**: Setup Supabase PostgreSQL Schema, Client SDK & Seed Data (`completed`).
3. **[03-backend-reddit-gemini-extractor.md](.scratch/idea-man/issues/03-backend-reddit-gemini-extractor.md)**: Reddit Fetcher & Google Gemini AI Extraction Engine (`completed`).
4. **[04-backend-ingestion-persistence.md](.scratch/idea-man/issues/04-backend-ingestion-persistence.md)**: Ingestion Service & Database Persistence Bridge (`completed`).
5. **[05-integration-ui-database-ingest.md](.scratch/idea-man/issues/05-integration-ui-database-ingest.md)**: Integrasi Dashboard UI dengan Real Database & Live Ingestion Action (`completed`).
6. **[07-codebase-hardening-spec-alignment.md](.scratch/idea-man/issues/07-codebase-hardening-spec-alignment.md)**: Codebase Hardening, Standards & Spec Alignment (`completed`).
7. **[08-production-deployment-setup.md](.scratch/idea-man/issues/08-production-deployment-setup.md)**: Production Deployment & Cloud Infrastructure Setup (`ready for implementation`).
