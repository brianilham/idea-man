# 04: [Backend] Ingestion Service & Database Persistence Bridge

**What to build:**
Jembatan layanan orkestrasi antara modul ekstraksi Reddit & Gemini (Ticket 03) dengan database Supabase PostgreSQL (Ticket 02). Menyediakan pipeline penambang ide, mekanisme deduplikasi cepat berbasis URL memanfaatkan indeks `idx_ideas_url`, batch insertion via Supabase Admin Client (`supabaseAdmin` dengan Service Role Key) yang mem-bypass RLS secara aman, serta API Route Handler (`/api/mine-ideas`).

1. **Ingestion Orchestrator Service (`src/lib/ingestion/orchestrator.ts`):**
   - Menjalankan pipeline ingestion:
     1. Ambil postingan terbaru dari target Reddit (`SomebodyMakeThis`, `SideProject`, dll.) melalui `fetchRedditPosts()`.
     2. Lakukan kueri deduplikasi cepat ke tabel `ideas` di Supabase menggunakan `supabaseAdmin`: cari apakah URL postingan sudah ada (`supabaseAdmin.from('ideas').select('url').in('url', postUrls)`).
     3. Filter keluar postingan yang URL-nya sudah tercatat di database.
     4. Jalankan AI extraction untuk postingan baru yang unik via `extractIdeaWithGemini()`.
     5. Susun payload `IdeaInsert` lengkap dengan atribut:
        - `title`, `problem_summary`, `proposed_solution`, `target_audience`, `recommended_stack`, `difficulty`, `category` (hasil ekstraksi Gemini)
        - `url`, `author`, `subreddit` (metadata asli dari Reddit)
        - `upvotes` (jumlah skor Reddit)
        - `is_new: true` (penanda ide baru hasil mining)
     6. Simpan ide-ide baru ke tabel `ideas` via `supabaseAdmin.from('ideas').insert(...)`.
   - Mengembalikan ringkasan eksekusi:
     ```typescript
     export interface MiningResult {
       scannedCount: number;
       duplicatesSkipped: number;
       newIdeasAdded: number;
       ideas: IdeaRow[];
     }
     ```

2. **Next.js Route Handler (`src/app/api/mine-ideas/route.ts`):**
   - Endpoint `POST /api/mine-ideas` yang menerima trigger permintaan mining.
   - Mendukung parameter opsional (misal: `{ subreddit?: string, limit?: number }`).
   - Proteksi & error handling: Penanganan ketika credentials database / AI belum lengkap dengan respons terstruktur (status 200/500).
   - Format response JSON standar:
     ```json
     {
       "success": true,
       "summary": {
         "scanned": 10,
         "skipped": 8,
         "added": 2
       },
       "newIdeas": [...]
     }
     ```

3. **Verifikasi CLI Runner (`scripts/run-mining.ts`):**
   - Skrip eksekusi manual via terminal (`npm run mine` atau `npx tsx scripts/run-mining.ts`) untuk menguji persistensi langsung ke Supabase tanpa ketergantungan UI.

**Blocked by:** 02: [Database] Setup Supabase PostgreSQL Schema, Client SDK & Seed Data, 03: [Backend] Reddit Fetcher & Google Gemini AI Extraction Engine

**Status:** completed

### Checklist Pengerjaan:
- [x] Buat orchestrator pipeline di `src/lib/ingestion/orchestrator.ts`
- [x] Implementasikan kueri deduplikasi efisien menggunakan `supabaseAdmin` di tabel `ideas` pada kolom `url` memanfaatkan `idx_ideas_url`
- [x] Implementasikan mapping payload lengkap mencakup field `subreddit`, `author`, `url`, dan `is_new: true`
- [x] Implementasikan insert data batch ke tabel `ideas` menggunakan `supabaseAdmin`
- [x] Buat Route Handler Next.js di `src/app/api/mine-ideas/route.ts` dengan penanganan request & standard response
- [x] Buat skrip terminal di `scripts/run-mining.ts` dan daftarkan perintah `npm run mine` di `package.json`
- [x] Uji pipeline dengan skenario mock dan live mode, pastikan data tersimpan dan lolos `npm run build`
