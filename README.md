# Wazifa Library PWA

A complete, production-ready, mobile-first **Wazifa Library** Progressive Web App: authentic Wazaif & Adhkar with Arabic (harakat), transliteration, English & Urdu translations, an interactive digital Tasbih, daily routine + streaks, custom Wazaif, and full offline support. Guest-first — no login wall. Optional Supabase cloud sync.

**Live URL (after publishing):** https://farrakhimtiaz74.github.io/wazifa-library/

## Stack
React (Vite) · Tailwind CSS v3 · Lucide Icons · Dexie.js (IndexedDB) · Supabase (Auth + PostgreSQL) · Fuse.js · vite-plugin-pwa

## Features
- 71 authentic seeded Wazaif across all categories (Rizq, Shifa, Protection, Marriage & Family, Peace & Anxiety, Istighfar, Daily Adhkar) with references, including a **Daily Life Duas** category (25 Hisn al-Muslim duas: leaving/entering home, masjid, eating, waking, market, vehicle, rain, thunder, iftar, adhan, graveyard, sneezing, anger, new moon…) and a Friday Surah Al-Kahf entry
- **Dhikr & Tasbih hub (Wave 3):** 12 tasbih presets with virtues, a Durood hub (Ibrahimi, short salawat, Tunajjina, Fath, Taj & Akbar openings — traditional salawat honestly labelled), timed guided sessions (5/10/15 min, rotating dhikr), a 3-slot multi-counter, an Istighfar challenge (7/30/custom days), per-dhikr totals (today/week/lifetime + 7-day chart), weekly dhikr goals in Settings, and a Mosque mode that dims the counter and silences sound
- **Dua Collections (Wave 3):** Categories page "By Situation" entries (Job, Exams, Debt, Travel, Illness, Rizq, Anxiety, Marriage), a Hisnul Muslim chapter browser, a personal Dua Journal (with "answered" duas), Parents & Deceased page, Exam & Job pack with a daily checklist, Debt pack with a reading tick, Pregnancy & Children page, Nikah & Spouse page, an Ayah/Hadith archive of all 30 daily quotes, and a Mood → Dua matcher
- **99 Names learning (Wave 3):** flashcards, a 10-question quiz with best score, per-name "learned" ticks with progress, and a Name of the Day (Home tile + full archive with day numbers)
- Prayer Times on Home (Aladhan API, Karachi method): 5 daily prayers, next-prayer live countdown, Jumu'ah label on Fridays; location via Settings (city presets, default Sargodha, or device geolocation); times cached by date for offline use
- Qibla compass: bearing + distance to Makkah from your location, live phone-compass dial where the sensor is available (static bearing fallback)
- Ayah / Hadith of the Day card (30 rotating quotes) with share/copy
- Friday mode: Surah Al-Kahf reminder + a one-tap Friday Durood goal of 1000
- 35 Rabbana Duas — a guided Quranic dua collection in the Adhkar runner (only verses that literally contain "Rabbana", each with its reference)
- Juz Amma: the last 20 surahs (95–114) in full — Arabic, English & Urdu translations, search, Listen (TTS) and mark-as-read tracking
- Morning & Evening Adhkar sets — guided sequential runner with auto-advance, completion summary and sharing
- Asma-ul-Husna: all 99 Names of Allah (searchable), each with its own Tasbih session
- Wazifa of the Day on Home + Hijri date in the header (Intl Islamic calendar, no API)
- Fuzzy search across Arabic / transliteration / English / Urdu / keywords (try "stress", "debt", "barakah")
- Reader with script toggles + Arabic font-size slider (A−/A+), Listen (Arabic text-to-speech), Share/Copy, WhatsApp share, and a downloadable/shareable Wazifa image card (1080×1350 PNG)
- Digital Tasbih: SVG progress ring, tap to count, haptic vibration, completion double-pulse, sound tick option, rounds tracking, plus a Free Tasbih mode with no target
- Keep-Awake (Wake Lock) toggle and a distraction-free Focus Mode in the reader (Arabic + counter only)
- Lifetime stats: every Wazifa tracks its all-time recitation count (never reset by the daily cycle), shown on cards and in the reader
- Home polish: time-of-day greeting (Subah Bakhair / Shab Bakhair), a Routine completion ring with streak, and app shortcuts (Free Tasbih / Morning / Evening Adhkar via `?open=` deep links, also in the PWA manifest)
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

## Wave 4 — Learning (41–50) & Ramadan/Seasons (51–60)

- **Learn Hub**: Arabic Alphabet (28 letters, joining forms, example words, 10-round quiz), Daily Islamic Quiz (66-question bank, deterministic daily 5 + practice 10, saved score history), Seerah Timeline (22 events), Prophets' Stories (10, Quran-based beats), Sahaba & Great Women (9 bios), 40 Hadith Nawawi (all 42, Arabic + simple explanation), Learning Path (3 levels, self-marked ticks, progress ring), Arabic Word of the Day (67-word bank + archive), Dua Flashcards (all 71 wazaif, learned ticks + progress), and a Kids Mode (Settings toggle + Parents exit; big dua cards, giant tasbih, story link).
- **Seasons Hub**: Ramadan Dashboard (Intl islamic-calendar countdown / Ramadan day counter, per-date daily goals), Sehri/Iftar banner in the prayer strip during Ramadan, Laylatul Qadr page (Tirmidhi dua + computed odd nights), a clearly-labelled curated 30-day Ramadan dua plan from library duas, Zakat Calculator (Hanafi nisab 87.48g gold / 612.36g silver, 2.5%, breakdown), Fidya & Kaffarah info (scholar-first wording, no invented amounts), Eid page (Takbeerat, per-Eid checklists, Zakat-ul-Fitr note), Dhul Hijjah page (Arafah dua, 10-day checklist), Muharram page (Ashura guidance + computed dates), and an Islamic Year page (12 months, computed event dates — all estimates with a moon-sighting note).

## Wave 5 — Habits (61–70), Sharing (71–75) & Life Tools (76–85) · App v3.1

- **Habits Hub**: a **weekly routine builder** (each routine wazifa gets days-of-week chips; today's list filters by weekday; a weekly overview strip shows per-day counts — rows without `days` keep the old every-day behaviour), a **challenges hub** (the Istighfar challenge links into the Dhikr hub; four generic challenges — Durood ×7d, SubhanAllah ×30d, Alhamdulillah ×7d, Kalima ×7d at 100/day — read progress from the per-dhikr `dhikrLog` and record completions), a **gratitude journal** (one entry per day, rotating prompts, past entries), guided **sleep adhkar** (Ayat-ul-Kursi, the three Quls ×3, the sleeping dua, inline Tasbih Fatimah 33/33/34 counters feeding `dhikrLog`, and a Dim toggle that deepens as you finish), **morning & evening flow wizards** (5 steps each; the prayer step writes to the real Prayer Log), a **monthly report** (routine/dhikr/prayer/quiz aggregates with a month switcher), **14 achievement badges** computed live from streaks, taps, prayer log, qaza plan, learned Names, quiz history and challenges (earned dates stored), and a **fasting tracker** (Gregorian month grid with Hijri day numbers, Mondays/Thursdays outlined, white days 13/14/15 gold-dotted).
- **Sharing**: **Family Circle** — honest by design: with sync off it explains activation and shows a preview member card built from your *real* streak and weekly dhikr (no fake members); with sync on and signed in, your profile id is shown as a copyable share code. **Deep links** — share text/links now carry `?w=<id>`, which opens that wazifa straight in the reader. A **printable routine sheet** (Routine → Print; print CSS isolates the sheet, black on white). A **WhatsApp status pack** that draws today's quote onto a 1080×1920 emerald/gold canvas for download or share (a new component — the Wave-1-deleted wazifa image-card lib stays deleted). **Gift-a-dhikr** — build a `?gift=<preset>&n=<target>&m=<msg>` link; opening it shows a gift card whose Start button opens the Tasbih with that preset and target.
- **Life Tools Hub**: **Hijri ↔ Gregorian date converter** (Intl islamic calendar both ways), **60 baby names** (30 boys / 30 girls, Arabic + meanings in EN/UR/Roman, gender filter + search + detail), a respectful **Janaza checklist** (links to the Janaza prayer guide and deceased-dua pages), an **Umrah guide** (7 steps incl. the full Talbiyah), a **Hajj day-by-day guide** (8–13 Dhul Hijjah, summary wording + scholar note), a **Nikah checklist**, a **travel hub** (travel duas, any preset city's prayer times fetched separately so your home city is untouched, plus that city's Qibla bearing with a static arrow), a **mosque finder** button (Prayer Hub + Tools; opens Google Maps, centred on you when location is available), a **sadaqah tracker** and a **debt tracker** (both device-local only).
- **Intention screen** (item 69): opt-in Settings toggle, off by default — once a day the app opens with Bismillah, an intention line and today's focus wazifa.
- Interface is now 901 strings × 3 languages (English / اردو / Roman Urdu), verified at parity.
