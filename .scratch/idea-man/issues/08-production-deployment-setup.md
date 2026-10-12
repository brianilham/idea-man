# 08: [Deployment] Production Deployment & Cloud Infrastructure Setup

**What to build:**
Mempersiapkan infrastruktur production cloud dan melakukan deployment end-to-end untuk aplikasi **Idea-man** menggunakan kombinasi **Supabase Cloud (Managed PostgreSQL)** dan **Vercel (Serverless Next.js Hosting)**.

Tiket ini mencakup setup database production, konfigurasi CI/CD & hosting, injeksi variabel lingkungan, penyusunan dokumen panduan deployment (`DEPLOYMENT.md`), serta eksekusi smoke testing pada URL live production.

**Blocked by:** 
- 07: [Hardening] Codebase Hardening, Standards & Spec Alignment (Done)

**Status:** completed

---

### Ruang Lingkup Pekerjaan:

1. **Setup Database Supabase Cloud:**
   - Membuat project baru di [Supabase Dashboard](https://supabase.com/dashboard) (pilih region terdekat pengguna, misal `ap-southeast-1` Singapura).
   - Menjalankan script DDL migrasi dari [`supabase/migrations/01_create_ideas.sql`](../../supabase/migrations/01_create_ideas.sql) pada SQL Editor Supabase.
   - Menjalankan seeding data awal menggunakan [`supabase/seed.sql`](../../supabase/seed.sql) atau menjalankan skrip lokal `npm run seed:supabase` yang diarahkan ke database production.
   - Memastikan Row Level Security (RLS) aktif dengan kebijakan:
     - `SELECT`: Diizinkan untuk anon/public.
     - `INSERT`/`UPDATE`: Dibatasi hanya untuk `service_role` (backend ingestion).

2. **Hosting & Build Configuration (Vercel):**
   - Menghubungkan repositori Git proyek ke Vercel.
   - Mengatur **Root Directory**: `idea-man-app`.
   - Mengonfigurasi Build Command: `next build` (atau `npm run build`).
   - Memilih Node.js version 20.x pada menu Settings > General > Node.js Version.
   - (Rekomendasi) Menambahkan `export const maxDuration = 60;` pada [`idea-man-app/src/app/api/mine-ideas/route.ts`](../../idea-man-app/src/app/api/mine-ideas/route.ts) agar eksekusi penambangan Reddit & ekstraksi Gemini tidak terpotong oleh timeout serverless default (10s–15s).

3. **Injeksi Environment Variables Production di Vercel:**
   | Variabel | Lingkup | Wajib | Keterangan |
   | :--- | :--- | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Production & Preview | Ya | URL project Supabase (`https://<project-ref>.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production & Preview | Ya | Anon public API key dari Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Production & Preview | Ya | Service Role secret key untuk bypass RLS pada mining route |
   | `GEMINI_API_KEY` | Production & Preview | Ya | API key dari Google AI Studio (`aistudio.google.com`) |
   | `REDDIT_CLIENT_ID` | Production & Preview | Opsional | Script client ID Reddit (jika pakai OAuth) |
   | `REDDIT_CLIENT_SECRET` | Production & Preview | Opsional | Script secret key Reddit (jika pakai OAuth) |
   | `REDDIT_USER_AGENT` | Production & Preview | Opsional | User agent Reddit kustom |

4. **Penyusunan Panduan Operasional (`DEPLOYMENT.md`):**
   - Membuat file `DEPLOYMENT.md` di root direktori proyek (`Idea-man/DEPLOYMENT.md`).
   - Panduan memuat instruksi langkah demi langkah:
     1. Langkah setup Supabase Cloud (membuat project, run DDL, seed data).
     2. Langkah deployment Vercel via Web Dashboard & via Vercel CLI (`vercel`).
     3. Penjelasan daftar Environment Variables yang wajib diisi.
     4. Langkah verifikasi dan pemecahan masalah (*Troubleshooting*) jika mining timeout atau data gagal dimuat.

5. **Smoke Testing & Verifikasi Live Pasca-Deploy:**
   - Memastikan build di Vercel selesai dengan status *Ready* (0 errors).
   - Mengakses URL live production (misal `https://idea-man-app.vercel.app`):
     - Memverifikasi halaman utama (`/`) menampilkan kartu ide langsung dari Supabase Cloud.
     - Memverifikasi halaman pencarian (`/search`) mampu memfilter data secara real-time.
     - Memverifikasi tombol *Save Bookmark* menyimpan data ke browser `localStorage` dan tersinkronisasi di halaman `/saved`.
     - Membuka modal *Scan & Mine Ideas*, menjalankan aksi penambangan, dan memastikan Route Handler `/api/mine-ideas` berhasil mengekstrak ide baru dan menyimpannya ke database Supabase tanpa error CORS/timeout.

---

### Checklist Pengerjaan:

- [x] **Persiapan Database:**
  - [x] Buat project baru di Supabase Cloud (`xsyncnkhdliircthxdkr`).
  - [x] Jalankan query DDL dari `supabase/migrations/01_create_ideas.sql` di SQL Editor Supabase.
  - [x] Eksekusi seed data awal dari `supabase/seed.sql` (21 rows seeded).
  - [x] Salin API Credentials: URL, Anon Key, dan Service Role Key.
- [x] **Konfigurasi Codebase:**
  - [x] Tambahkan `export const maxDuration = 60;` pada `idea-man-app/src/app/api/mine-ideas/route.ts` untuk serverless timeout safety.
  - [x] Buat dokumen panduan `DEPLOYMENT.md` di root direktori proyek.
- [x] **Deployment Vercel:**
  - [x] Inisialisasi Git di root repositori (`git init`, `git add .`, commit) dan push ke remote repository (`https://github.com/brianilham/idea-man`).
  - [x] Buat proyek `idea-man` di Vercel dengan framework `nextjs`.
  - [x] Tambahkan seluruh Environment Variables di Vercel Project Settings (`NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`).
  - [x] Trigger deployment dan tunggu build status menjadi *Ready* (`https://idea-man-nine.vercel.app`).
- [x] **Verifikasi & Smoke Testing:**
  - [x] Buka URL production dan pastikan feed ide terisi (HTTP 200 OK).
  - [x] Uji filter kategori dan dropdown difficulty.
  - [x] Uji bookmarking dan halaman `/saved`.
  - [x] Uji fitur "Scan & Mine Ideas" via route handler `/api/mine-ideas` (ekstraksi & penyimpanan ide baru ke database sukses).
