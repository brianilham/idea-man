# 07: [Hardening] Codebase Hardening, Standards & Spec Alignment

**What to build:**
Menyelesaikan seluruh temuan dari dua sumbu audit kode (*Standards* dan *Spec*):

1. **Security & Clean Tree:**
   - Menghapus tag script dev `http://localhost:8400/live.js` yang bocor di `src/app/layout.tsx`.
   - Mengamankan pembacaan environment Gemini API key di `src/lib/gemini/extractor.ts` agar memprioritaskan `GEMINI_API_KEY` (server-side only) dan menggunakan model resmi `gemini-2.5-flash`.

2. **Spec Alignment:**
   - Menyelaraskan target subreddits default di `src/lib/ingestion/orchestrator.ts` menjadi `r/SomebodyMakeThis`, `r/SideProject`, dan `r/webdev` sesuai `SPEC.md`.
   - Menyelaraskan tipe data di `src/types/idea.ts` (`target_audience` non-opsional, pemisahan tipe domain `IdeaCategory` dengan filter sentinel `FilterCategory`).
   - Membersihkan skema migrasi database `supabase/migrations/01_create_ideas.sql` dari tabel relasi akun (`bookmarks` dan `upvotes`) agar murni berstatus *Zero-Auth Personal MVP*.

3. **Dead Code Cleanup:**
   - Menghapus komponen `SpotlightCarousel.tsx` dan artefak data `SpotlightIdea` / `spotlightIdeas` yang sudah tidak terpakai setelah transisi ke varian compact direct curation.

4. **Code Quality & Refactoring (Eliminasi Duplikasi):**
   - Mengekstrak custom hook `useIdeasData` untuk menyatukan logika fetch data Supabase, deduplikasi in-memory, dan manajemen state modal yang sebelumnya diduplikasi di `page.tsx`, `search/page.tsx`, dan `saved/page.tsx`.
   - Mengintegrasikan fitur pencarian teks di `src/lib/ideas/data.ts` dan `src/app/search/page.tsx` dengan kapabilitas Supabase Full-Text Search.

5. **Design System & Token Consistency:**
   - Menyesuaikan radius input form pada `ActionBar.tsx` dan `FilterBar.tsx` ke radius form 4px (`rounded`).
   - Membersihkan token warna liar (`emerald-50`, `emerald-500`, `rose-500`) pada `IdeaCard.tsx` dan `ScanMiningModal.tsx` agar selaras dengan palet Warm Cream Bauhaus / Ember Orange.

**Blocked by:** 05: [Integration] Connect Dashboard UI with Real Database & Ingestion Action (Done)

**Status:** completed
