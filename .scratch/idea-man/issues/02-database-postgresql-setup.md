# 02: [Database] Setup Supabase PostgreSQL Schema, Client SDK & Seed Data

**What to build:**
Konfigurasi database PostgreSQL berbasis **Supabase** untuk menyimpan direktori ide proyek dan hasil penambangan Reddit secara persisten. Dioptimalkan untuk **Personal MVP** (skema fokus pada penampungan ide & deduplikasi, tanpa ketergantungan relasi user auth/upvotes):

1. **Skema Database SQL (`supabase/schema.sql` / `supabase/migrations/01_create_ideas.sql`):**
   - Tabel utama `ideas`:
     - `id` (UUID, primary key default `gen_random_uuid()`)
     - `title` (text, not null)
     - `problem_summary` (text, not null)
     - `proposed_solution` (text, not null)
     - `target_audience` (text, not null)
     - `recommended_stack` (text[], not null default `'{}'`)
     - `difficulty` (text, check in `'Beginner'`, `'Intermediate'`, `'Advanced'`)
     - `category` (text, check in `'Web App'`, `'DevTool'`, `'AI Tool'`, `'Automation'`)
     - `url` (text, unique constraint untuk deduplikasi Reddit post)
     - `author` (text, default `'anonymous'`)
     - `subreddit` (text, nullable - asal subreddit postingan)
     - `upvotes` (integer, default 0 - skor relevansi dari post Reddit asli)
     - `is_new` (boolean, default false)
     - `created_at` (timestamptz, default `now()`)
     - `updated_at` (timestamptz, default `now()`)
   - Indeks database: `idx_ideas_category`, `idx_ideas_difficulty`, `idx_ideas_url`, `idx_ideas_created_at`, `idx_ideas_subreddit`, dan Full-Text Search index (GIN) `idx_ideas_fts` (`title` + `problem_summary` + `proposed_solution`).
   - Row Level Security (RLS) policies:
     - Public Read: Membaca ide diizinkan untuk semua pengunjung publik (`anon`).
     - Restricted Mutation: Mutasi insert/update diperuntukkan bagi backend ingestion engine via Service Role Key (admin client) yang mem-bypass RLS secara aman.
   - *Catatan MVP*: Tabel relasi auth `upvotes` dan `bookmarks` dinonaktifkan dari alur runtime karena bookmark/saved ide dikelola langsung via browser `localStorage` tanpa akun.

2. **TypeScript Database Types (`src/types/database.ts`):**
   - Definisi tipe TypeScript lengkap untuk database Supabase (`Database['public']['Tables']['ideas']` mencakup kolom `subreddit`).

3. **Supabase Client Instances:**
   - `src/lib/supabase/client.ts`: Browser client untuk Client Components.
   - `src/lib/supabase/server.ts`: Server client untuk Server Components dan Route Handlers (App Router).
   - `src/lib/supabase/admin.ts`: Admin/Service role client untuk backend ingestion engine (Ticket 04).
   - Graceful fallback: Jika environment Supabase belum diisi credentials live, client menyediakan pesan peringatan jelas tanpa membuat build/runtime aplikasi crash.

4. **Environment Configuration:**
   - `.env.example` & `.env.local` dengan variabel:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

5. **Migration & Seed Data:**
   - `supabase/migrations/01_create_ideas.sql`: DDL migrasi skema tabel, RLS, FTS index, dan indeks performa.
   - `supabase/seed.sql`: Data seed awal dalam bentuk SQL insert mencakup kolom `subreddit` dan URL valid.
   - `scripts/seed-supabase.ts`: Skrip TypeScript seeder otomatis yang mengimpor ide ke Supabase.

**Blocked by:** None (can start immediately)

**Status:** completed

### Checklist Pengerjaan:
- [x] Install package `@supabase/supabase-js` dan `@supabase/ssr` di `idea-man-app`
- [x] Buat file DDL migrasi SQL `supabase/migrations/01_create_ideas.sql` lengkap dengan RLS ketat, indeks performa, FTS GIN index, dan kolom `subreddit`
- [x] Buat file SQL seed `supabase/seed.sql` berisi data ide awal lengkap dengan `subreddit` dan tautan valid
- [x] Definisikan TypeScript Database types di `src/types/database.ts` (mencakup `subreddit`)
- [x] Buat modul Supabase Browser client di `src/lib/supabase/client.ts`
- [x] Buat modul Supabase Server client di `src/lib/supabase/server.ts`
- [x] Buat modul Supabase Admin client di `src/lib/supabase/admin.ts`
- [x] Sediakan template `.env.example` dan `.env.local`
- [x] Buat skrip seeder `scripts/seed-supabase.ts` (dan perintah `npm run seed:supabase` di `package.json`)
- [x] Jalankan verifikasi typecheck dan build Next.js (0 errors)
