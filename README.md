# Wazifa Library PWA

A complete, production-ready, mobile-first **Wazifa Library** Progressive Web App: authentic Wazaif & Adhkar with Arabic (harakat), transliteration, English & Urdu translations, an interactive digital Tasbih, daily routine + streaks, custom Wazaif, and full offline support. Guest-first — no login wall. Optional Supabase cloud sync.

**Live URL (after publishing):** https://farrakhimtiaz74.github.io/wazifa-library/

## Stack
React (Vite) · Tailwind CSS v3 · Lucide Icons · Dexie.js (IndexedDB) · Supabase (Auth + PostgreSQL) · Fuse.js · vite-plugin-pwa

## Features
- 46 authentic seeded Wazaif across all categories (Rizq, Shifa, Protection, Marriage & Family, Peace & Anxiety, Istighfar, Daily Adhkar) with references
- Morning & Evening Adhkar sets — guided sequential runner with auto-advance, completion summary and sharing
- Asma-ul-Husna: all 99 Names of Allah (searchable), each with its own Tasbih session
- Wazifa of the Day on Home + Hijri date in the header (Intl Islamic calendar, no API)
- Fuzzy search across Arabic / transliteration / English / Urdu / keywords (try "stress", "debt", "barakah")
- Reader with script toggles + Arabic font-size slider (A−/A+), Listen (Arabic text-to-speech), Share/Copy, WhatsApp share, and a downloadable/shareable Wazifa image card (1080×1350 PNG)
- Digital Tasbih: SVG progress ring, tap to count, haptic vibration, completion double-pulse, sound tick option, rounds tracking, plus a Free Tasbih mode with no target
- Custom target per Wazifa (presets 33/100/313/450/1000 or any number), saved per routine
- My Routine: bookmarks, daily progress bars, midnight local-timezone reset, streak on full completion
- History & Stats: month calendar of completions, current/longest streak, total dhikr taps, weekly completions
- Daily reminder (in-app banner + notification while the app is open; set time in Settings)
- Backup & Restore: export/import all local data (routines, custom Wazaif, settings, history) as JSON
- Interface language toggle: English / اردو (Urdu UI labels)
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
