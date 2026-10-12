# 05: [Integration] Connect Dashboard UI with Real Database & Ingestion Action

**What to build:**
Menghubungkan frontend Next.js App Router ([Ticket 01](./01-frontend-dashboard-ui.md)) dengan database Supabase PostgreSQL ([Ticket 02](./02-database-postgresql-setup.md)) serta pipeline penambangan on-demand Reddit & AI ([Ticket 03](./03-backend-reddit-gemini-extractor.md) & [Ticket 04](./04-backend-ingestion-persistence.md)).

Mengganti ketergantungan mock data statis pada halaman utama (`/`), pencarian (`/search`), dan ide tersimpan (`/saved`) dengan pembacaan langsung dari database Supabase, serta mengintegrasikan modal penambangan (`ScanMiningModal`) ke endpoint `POST /api/mine-ideas` dengan live loading state, reporting summary, dan auto-inject ide baru ke feed tanpa reload manual.

**Sesuai Karakter Minimalist Personal MVP:**
- Fitur otentikasi login/signup dan sinkronisasi session ditiadakan. Semua pengguna dapat langsung mengakses semua fitur direktori.
- Upvote counter di kartu dan modal dihapus.
- Penyimpanan ide tersimpan menggunakan **browser localStorage** (`useIdeaStorage`) agar instan, bebas lag, dan tidak memerlukan database user auth.

**Blocked by:** 
- 01: [Frontend] Next.js Dashboard UI Shell & Components (Done)
- 02: [Database] Setup Supabase PostgreSQL Schema, Client SDK & Seed Data (Done)
- 03: [Backend] Reddit Fetcher & Google Gemini AI Extraction Engine (Done)
- 04: [Backend] Ingestion Service & Database Persistence Bridge (Done)

**Status:** completed

---

### Ruang Lingkup Integrasi:

1. **Data Fetching & Resilient Adapter (`src/lib/ideas/data.ts`):**
   - Fungsi pembaca data ide dari Supabase (`fetchLiveIdeas()`) yang diurutkan berdasarkan `created_at DESC`.
   - Utility mapper (`mapDbIdeaToIdea()`) yang mengonversi record database (`Database['public']['Tables']['ideas']['Row']`) menjadi interface frontend (`Idea`), memetakan `is_new` ke `isNew` dan menstandarkan default value.
   - Graceful Fallback: Jika koneksi database Supabase belum terisi / offline / kosong, otomatis fallback ke `initialMockIdeas` agar UI tidak blank/crash.
   - Sinkronisasi data ide pada:
     - Halaman Utama ([`src/app/page.tsx`](../../idea-man-app/src/app/page.tsx))
     - Halaman Pencarian ([`src/app/search/page.tsx`](../../idea-man-app/src/app/search/page.tsx))
     - Halaman Saved Repository ([`src/app/saved/page.tsx`](../../idea-man-app/src/app/saved/page.tsx))

2. **Integrasi Scan & Mine Ideas ([`ScanMiningModal.tsx`](../../idea-man-app/src/components/ScanMiningModal.tsx)):**
   - Menghubungkan proses scanning ke endpoint `POST /api/mine-ideas`.
   - Visual step feedback interaktif:
     - Tahap 1: Memindai subreddit komunitas teknologi.
     - Tahap 2: Mengecek duplikasi URL terhadap database.
     - Tahap 3: Mengekstrak spesifikasi ide terstruktur dengan Gemini AI.
   - Menampilkan hasil ringkasan mining asli:
     - Jumlah ide baru yang ditambahkan (`summary.added`).
     - Jumlah postingan yang dilewati (`summary.skipped`).
     - Preview kartu ide baru yang berhasil ditambang.
     - Penanganan jika tidak ada ide baru yang ditemukan (semua postingan sudah ada di DB).
   - Tombol *"View new ideas in feed →"* langsung menyuntikkan ide-ide baru ke daftar teratas feed dan menutup modal.

3. **Bookmark / Saved Repository Interaction (LocalStorage):**
   - Menggunakan penyimpanan status bookmark pengguna di `localStorage` (`useIdeaStorage`) agar instan dan tanpa lag.
   - Menjaga konsistensi data antara grid ide, modal detail (`IdeaDetailModal`), dan halaman `/saved`.

4. **Kerapian & Kepatuhan Desain:**
   - Konsisten dengan token ElevenLabs Warm Cream Editorial (tanpa emoji pada tombol aksi "Scan & Mine Ideas").
   - Lolos seluruh test suite (`npm test`) dan build check (`npm run build`).

---

### Checklist Pengerjaan:
- [x] Buat modul adapter data fetching di `src/lib/ideas/data.ts` (mencakup `mapDbIdeaToIdea` dan `fetchLiveIdeas` dengan graceful fallback)
- [x] Tulis unit test untuk data adapter di `tests/ideas-adapter.test.ts`
- [x] Hubungkan halaman Home (`src/app/page.tsx`) untuk mengambil data ide dari Supabase/adapter
- [x] Hubungkan `ScanMiningModal` (`src/components/ScanMiningModal.tsx`) ke API `POST /api/mine-ideas` secara asinkron dengan live stage progression dan preview hasil mining nyata
- [x] Hubungkan halaman Search (`src/app/search/page.tsx`) dengan data adapter
- [x] Hubungkan halaman Saved (`src/app/saved/page.tsx`) dengan data adapter
- [x] Sesuaikan `useIdeaStorage.ts` agar hanya mengelola bookmark (bersihkan dependensi upvote)
- [x] Pastikan seluruh tombol save di grid dan modal detail terhubung rapi
- [x] Jalankan test suite (`npm test`) dan verifikasi `npm run build` berhasil tanpa error (0 errors)
