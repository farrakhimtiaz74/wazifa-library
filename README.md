# Wazifa Library PWA

A complete, production-ready, mobile-first **Wazifa Library** Progressive Web App: authentic Wazaif & Adhkar with Arabic (harakat), transliteration, English & Urdu translations, an interactive digital Tasbih, daily routine + streaks, custom Wazaif, and full offline support. Guest-first — no login wall. Optional Supabase cloud sync.

**Live URL (after publishing):** https://farrakhimtiaz74.github.io/wazifa-library/

## Stack
React (Vite) · Tailwind CSS v3 · Lucide Icons · Dexie.js (IndexedDB) · Supabase (Auth + PostgreSQL) · Fuse.js · vite-plugin-pwa

## Features
- 12 authentic seeded Wazaif across all categories (Rizq, Shifa, Protection, Marriage & Family, Peace & Anxiety, Istighfar, Daily Adhkar) with references
- Fuzzy search across Arabic / transliteration / English / Urdu / keywords (try "stress", "debt", "barakah")
- Reader with script toggles + Arabic font-size (A−/A+), persisted preferences
- Digital Tasbih: tap to count, haptic vibration, completion pulse, auto-save to IndexedDB
- My Routine: bookmarks, daily progress, 24h local-timezone reset, streak on full completion
- Custom Wazaif: add/edit, stored locally and synced to `custom_wazaif`
- Offline-first sync engine: local writes are instant; when signed in + online, data syncs to Supabase and merges by `updated_at` (newer wins); guest progress merges on first sign-in
- Dark mode (Deep Emerald `#062C22`) default + Light mode (Cream `#FAF8F5`, Forest `#0D4F3C`, Gold `#D4AF37`)
- Installable PWA (standalone, service worker, Google Fonts runtime caching)

## Quick Setup Checklist

### 1. Create a free Supabase project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Open **SQL Editor**, paste the full contents of `supabase_schema.sql`, and run it. This creates `profiles`, `user_routines`, `custom_wazaif` with Row-Level Security (users can only access their own rows), triggers and an auto-profile-on-signup function.

### 2. Add your keys
Copy `.env.example` to `.env` and fill in from Supabase → Settings → API:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
The app works fully without these keys (guest/offline mode). The anon key is public-safe because RLS protects every table.

### 3. Publish on GitHub Pages
1. Create a GitHub repo named **`farrakhimtiaz74/wazifa-library`** and push this code to its `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**. (The included `.github/workflows/deploy.yml` builds and deploys automatically on every push to `main`.)
3. Add your Supabase keys as repo Secrets: **Settings → Secrets and variables → Actions → New repository secret** — add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. (Alternatively, commit a `.env` file — the anon key is public-safe with RLS enabled.)
4. Push to `main` (or run the workflow manually from the Actions tab). Your site will be live at https://farrakhimtiaz74.github.io/wazifa-library/

### 4. Google Login (optional)
1. In Supabase: **Authentication → Providers → Google** — enable it and add your Google OAuth client ID/secret.
2. In Supabase: **Authentication → URL Configuration → Redirect URLs** — add:
   - `https://farrakhimtiaz74.github.io/wazifa-library/`
   - `http://localhost:5173/` (for local dev, plus `http://localhost:5173` if prompted)

## Local development
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/ (base path /wazifa-library/)
npm run preview
```

## Notes
- No account is ever required: guests get the full app with IndexedDB persistence.
- Sync status in the header shows: Synced · Offline - Saved Locally · Syncing... · Saved Locally.
