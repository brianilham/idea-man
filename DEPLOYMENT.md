# Panduan Deployment: Idea-man

Dokumentasi resmi arsitektur dan langkah-langkah deployment untuk aplikasi **Idea-man**.

---

## 1. Arsitektur Infrastruktur Production

- **Frontend & Serverless API Routes**: [Vercel](https://vercel.com) (Next.js 16 App Router)
- **Database & Storage**: [Supabase Cloud](https://supabase.com) (Managed PostgreSQL 15+)
- **AI Extraction Engine**: Google Gemini Flash API (`gemini-3.5-flash-lite`)
- **Community Feed Data**: Reddit Atom RSS Feed Parser + Public API Fallback

---

## 2. Persiapan Database (Supabase)

1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard) (Region: Singapore / `ap-southeast-1`).
2. Buka **SQL Editor** di dashboard Supabase:
   - Jalankan query dari `supabase/migrations/01_create_ideas.sql` untuk membuat tabel `ideas`, constraint, dan indeks FTS.
   - Jalankan query dari `supabase/seed.sql` untuk mengisi data blueprint awal.
3. Catat kredensial dari **Project Settings > API**:
   - `Project URL`
   - `anon public key`
   - `service_role secret key`

---

## 3. Konfigurasi Environment Variables di Vercel

Tambahkan variabel berikut pada menu **Settings > Environment Variables** di Vercel:

| Key | Value / Deskripsi | Target |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase Anda | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret Key | Production, Preview, Development |
| `GEMINI_API_KEY` | API Key dari Google AI Studio | Production, Preview, Development |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` | Production, Preview, Development |

---

## 4. Langkah Deployment ke Vercel

### Metode A: Via Vercel CLI (Direkomendasikan dari subfolder `idea-man-app`)
```bash
cd idea-man-app
npx vercel link
npx vercel env pull .env.production
npx vercel --prod
```

### Metode B: Via GitHub Integration
1. Inisialisasi git dan push ke repositori GitHub.
2. Di Vercel Dashboard, klik **Add New > Project**, lalu pilih repositori.
3. **PENTING**: Pada bagian **Root Directory**, ubah dari `./` menjadi `idea-man-app`.
4. Masukkan Environment Variables di atas.
5. Klik **Deploy**.

---

## 5. Post-Deployment Verification (Smoke Testing)

Setelah URL live production aktif:
- [ ] Buka homepage dan pastikan feed kartu ide termuat dari database Supabase.
- [ ] Coba filter kategori (*Web App*, *DevTool*, dll.) dan tingkat kesulitan.
- [ ] Buka modal detail kartu dan klik bookmark (disimpan di browser `localStorage`).
- [ ] Buka halaman `/saved` dan pastikan ide tersimpan tampil.
- [ ] Klik tombol **"Scan & Mine Ideas"** untuk memastikan Route Handler `/api/mine-ideas` berhasil menambang diskusi komunitas Reddit dan mengekstrak blueprint via Gemini Flash tanpa timeout.
