# 03: [Backend] Reddit Fetcher & Google Gemini AI Extraction Engine

**What to build:**
Modul backend berbasis TypeScript di dalam `idea-man-app` untuk mengambil postingan publik dari target subreddit Reddit (`r/SomebodyMakeThis`, `r/SideProject`, `r/Entrepreneur`) serta modul integrasi Google Gemini Flash API (`gemini-2.5-flash` / `gemini-1.5-flash`) yang menyaring dan mentransformasi keluhan/ide mentah pengguna Reddit menjadi format data ide proyek terstruktur yang selaras dengan skema Supabase `Idea` (termasuk kolom `subreddit`).

1. **Reddit Fetcher Module (`src/lib/reddit/fetcher.ts`):**
   - Mendukung pengambilan postingan Reddit via Reddit OAuth API resmi (script app flow) dan fallback HTTP publik (`https://www.reddit.com/r/{subreddit}/hot.json` atau `/new.json`).
   - Menyaring postingan berdasarkan kualitas teks (minimum karakter selftext/body, mengabaikan postingan promosi spam/kosong).
   - Menyediakan tipe interface data mentah:
     ```typescript
     export interface RedditRawPost {
       id: string;
       title: string;
       selftext: string;
       author: string;
       url: string;
       subreddit: string;
       permalink: string;
       score: number;
       createdAt: number;
     }
     ```
   - Retensi metadata `subreddit` secara konsisten untuk memenuhi skema database `ideas.subreddit` dan indeks `idx_ideas_subreddit`.
   - Menyediakan mock Reddit data untuk pengujian lokal jika internet offline atau kuota Reddit terbatas.

2. **Google Gemini Extraction Module (`src/lib/gemini/extractor.ts`):**
   - Menggunakan SDK resmi `@google/genai` (atau REST API dengan structured JSON output schema).
   - Prompt sistem terkalibrasi khusus untuk mengekstrak pain points komunitas teknologi:
     - `title`: Ringkas, catchy, tanpa kata-kata klise (maks 60 karakter).
     - `problem_summary`: Penjelasan masalah/keluhan asli 1-2 kalimat.
     - `proposed_solution`: Solusi software yang jelas dan aplikatif 1-2 kalimat.
     - `target_audience`: Segmen pengguna yang spesifik.
     - `recommended_stack`: Array 2-4 teknologi modern yang cocok (contoh: Next.js, Tailwind, Supabase).
     - `difficulty`: Validasi ketat enum (`'Beginner'` | `'Intermediate'` | `'Advanced'`).
     - `category`: Validasi ketat enum (`'Web App'` | `'DevTool'` | `'AI Tool'` | `'Automation'`).
   - Validasi output menggunakan skema JSON terstruktur agar bebas halusinasi format.
   - Menghasilkan objek transisi yang siap di-insert ke Supabase (`IdeaInsert`) dengan menggabungkan metadata Reddit: `url`, `author`, `subreddit`, dan `upvotes` (berasal dari Reddit score).
   - Graceful fallback: Jika `GEMINI_API_KEY` belum terpasang atau limit habis, gunakan template transformator terstruktur agar sistem tidak crash saat demo/pengujian.

3. **Verification & Test Script (`scripts/test-extractor.ts`):**
   - Skrip mandiri (`npm run test:extractor` atau `npx tsx scripts/test-extractor.ts`) untuk memvalidasi alur penarikan Reddit + ekstraksi Gemini dari terminal secara end-to-end.

**Blocked by:** None (dapat dikerjakan langsung)

**Status:** completed

### Checklist Pengerjaan:
- [x] Install SDK yang dibutuhkan (`@google/genai`) di `idea-man-app`
- [x] Buat modul Reddit Fetcher di `src/lib/reddit/fetcher.ts` dengan penarikan data, metadata `subreddit`, dan fallback offline
- [x] Buat modul Gemini Extractor di `src/lib/gemini/extractor.ts` dengan JSON Schema output, prompt anti-slop, dan metadata attachment
- [x] Tambahkan konfigurasi environment di `.env.example` dan `.env.local` (`GEMINI_API_KEY`, `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`)
- [x] Buat script verifikasi mandiri di `scripts/test-extractor.ts` dan command di `package.json`
- [x] Pastikan TypeScript types konsisten dengan `src/types/database.ts` (mencakup field `subreddit`) dan lolos typecheck Next.js
