// Small localStorage-backed UI preferences for Wave 1 (items 86-96).
export const APP_VERSION = '3.1'
export const APP_VERSION_LABEL = 'v3.1 — Habits, Sharing & Tools'

function loadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    if (v !== null && v !== undefined) return v
  } catch { /* storage unavailable */ }
  return fallback
}

function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

// --- Item 89: Home tiles ---
export const HOME_TILE_KEYS = ['prayer', 'today', 'ring', 'friday', 'adhkar', 'freeTasbih', 'names', 'rabbana', 'juzAmma', 'qibla', 'quran', 'dhikr', 'duas', 'nameDay', 'learn', 'seasons', 'habits', 'sharing', 'tools']
export const DEFAULT_HOME_TILES = { prayer: true, today: true, ring: true, friday: true, adhkar: true, freeTasbih: true, names: true, rabbana: true, juzAmma: true, qibla: true, quran: true, dhikr: true, duas: true, nameDay: true, learn: true, seasons: true, habits: true, sharing: true, tools: true }
export function loadHomeTiles() { return { ...DEFAULT_HOME_TILES, ...loadJSON('wl-home-tiles', {}) } }
export function saveHomeTiles(v) { saveJSON('wl-home-tiles', v) }

// --- Item 90: Bottom navigation ---
export const NAV_CANDIDATES = ['home', 'routine', 'names', 'history', 'categories', 'quran', 'learn', 'seasons', 'habits', 'tools', 'settings']
export const DEFAULT_NAV = ['home', 'routine', 'names', 'history', 'settings']
export function loadNavItems() {
  const v = loadJSON('wl-nav-items', null)
  if (Array.isArray(v) && v.length === 5 && v.includes('home') && v.every((x) => NAV_CANDIDATES.includes(x)) && new Set(v).size === 5) return v
  return [...DEFAULT_NAV]
}
export function saveNavItems(v) { saveJSON('wl-nav-items', v) }

// --- Item 93: Accessibility ---
export const DEFAULT_A11Y = { largeText: false, highContrast: false, reduceMotion: false }
export function loadA11y() { return { ...DEFAULT_A11Y, ...loadJSON('wl-a11y', {}) } }
export function saveA11y(v) { saveJSON('wl-a11y', v) }

// --- Item 91: Arabic script style ---
// 'indopak' is an honest approximation: no IndoPak font file is bundled, so it
// maps to a Nastaliq-based stack with looser line-height (see index.css).
export const ARABIC_FONTS = ['amiri', 'scheherazade', 'indopak']
export function loadArabicFont() {
  try {
    const v = localStorage.getItem('wl-arabic-font')
    if (ARABIC_FONTS.includes(v)) return v
  } catch { /* storage unavailable */ }
  return 'amiri'
}
export function saveArabicFont(v) { try { localStorage.setItem('wl-arabic-font', v) } catch { /* storage unavailable */ } }

// --- Item 86: Onboarding ---
export function isOnboarded() { try { return localStorage.getItem('wl-onboarded') === '1' } catch { return true } }
export function setOnboarded() { try { localStorage.setItem('wl-onboarded', '1') } catch { /* storage unavailable */ } }

// --- Item 95: What's New ---
export function lastSeenVersion() { try { return localStorage.getItem('wl-last-seen-version') || '' } catch { return '' } }
export function setLastSeenVersion(v) { try { localStorage.setItem('wl-last-seen-version', v) } catch { /* storage unavailable */ } }

// --- Item 96: Mistake reports (device-local only, no backend) ---
export function loadReports() { const v = loadJSON('wl-mistake-reports', []); return Array.isArray(v) ? v : [] }
export function saveReports(v) { saveJSON('wl-mistake-reports', v) }
export function addReport(report) {
  const list = loadReports()
  list.unshift(report)
  saveReports(list.slice(0, 100))
  return list
}

// --- Item 50 (Wave 4): Kids Mode ---
export function loadKidsMode() { try { return localStorage.getItem('wl-kids-mode') === '1' } catch { return false } }
export function saveKidsMode(v) { try { localStorage.setItem('wl-kids-mode', v ? '1' : '0') } catch { /* storage unavailable */ } }

// --- Item 69 (Wave 5): Intention screen (default OFF, once per day) ---
export function loadIntention() { try { return localStorage.getItem('wl-intention') === '1' } catch { return false } }
export function saveIntention(v) { try { localStorage.setItem('wl-intention', v ? '1' : '0') } catch { /* storage unavailable */ } }
export function intentionShownDate() { try { return localStorage.getItem('wl-intention-date') || '' } catch { return '' } }
export function setIntentionShownDate(v) { try { localStorage.setItem('wl-intention-date', v) } catch { /* storage unavailable */ } }

// --- Item 99: last backup date ---
export function lastBackupDate() { try { return localStorage.getItem('wl-last-backup') || '' } catch { return '' } }
export function setLastBackupDate(v) { try { localStorage.setItem('wl-last-backup', v) } catch { /* storage unavailable */ } }
