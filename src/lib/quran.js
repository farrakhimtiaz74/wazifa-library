// Wave 2 — Quran Hub data layer (items 1-10).
// Source: AlQuran Cloud API (https://api.alquran.cloud/v1), free, no key.
// Everything fetched is cached (localStorage) so repeat views work offline.
import { getSetting, setSetting } from './db'

const API = 'https://api.alquran.cloud/v1'
const META_KEY = 'wl-quran-meta'
const TRANS_KEY = 'wl-quran-translation'
const RECITER_KEY = 'wl-quran-reciter'
const ALERTS_KEY = 'wl-prayer-alerts'

export const TOTAL_AYAHS = 6236

export const TRANSLATIONS = [
  { id: 'ur.jalandhry', label: 'Urdu — Fateh Muhammad Jalandhari' },
  { id: 'en.asad', label: 'English — Muhammad Asad' },
  { id: 'none', label: null } // label comes from i18n (translationNone)
]

export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' }
]

export function loadTranslationPref(lang) {
  try {
    const v = localStorage.getItem(TRANS_KEY)
    if (v && TRANSLATIONS.some((x) => x.id === v)) return v
  } catch { /* storage unavailable */ }
  return lang === 'ur' ? 'ur.jalandhry' : 'en.asad'
}

export function saveTranslationPref(v) {
  try { localStorage.setItem(TRANS_KEY, v) } catch { /* storage unavailable */ }
}

export function loadReciter() {
  try {
    const v = localStorage.getItem(RECITER_KEY)
    if (RECITERS.some((r) => r.id === v)) return v
  } catch { /* storage unavailable */ }
  return 'ar.alafasy'
}

export function saveReciter(v) {
  try { localStorage.setItem(RECITER_KEY, v) } catch { /* storage unavailable */ }
}

export function audioUrl(reciter, globalAyahNumber) {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalAyahNumber}.mp3`
}

// --- Surah metadata (114 surahs) ---
export async function fetchSurahMeta() {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list) && list.length === 114) return { list, fromCache: true }
    }
  } catch { /* storage unavailable */ }
  const res = await fetch(`${API}/meta`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const refs = json && json.data && json.data.surahs && json.data.surahs.references
  if (!Array.isArray(refs) || refs.length !== 114) throw new Error('Bad meta')
  const list = refs.map((s) => ({
    number: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    numberOfAyahs: s.numberOfAyahs,
    revelationType: s.revelationType
  }))
  try { localStorage.setItem(META_KEY, JSON.stringify(list)) } catch { /* storage unavailable */ }
  return { list, fromCache: false }
}

export function cachedSurahMeta() {
  try {
    const list = JSON.parse(localStorage.getItem(META_KEY))
    if (Array.isArray(list) && list.length === 114) return list
  } catch { /* storage unavailable */ }
  return null
}

// --- Surah content ---
// editionsKey identifies the exact edition set so caches never mix.
function surahCacheKey(number, editionsKey) {
  return `wl-quran-surah-${number}-${editionsKey}`
}

export async function fetchSurah(number, translationId) {
  const editions = ['quran-uthmani', 'en.transliteration']
  if (translationId && translationId !== 'none') editions.push(translationId)
  const key = editions.join(',')
  const ck = surahCacheKey(number, key)
  try {
    const raw = localStorage.getItem(ck)
    if (raw) {
      const cached = JSON.parse(raw)
      if (cached && Array.isArray(cached.ayahs) && cached.ayahs.length) return { ...cached, fromCache: true }
    }
  } catch { /* storage unavailable */ }
  const res = await fetch(`${API}/surah/${number}/editions/${key}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json || !Array.isArray(json.data) || !json.data[0]) throw new Error('Bad surah')
  const byEdition = {}
  for (const ed of json.data) byEdition[ed.edition.identifier] = ed
  const arabicEd = byEdition['quran-uthmani']
  if (!arabicEd) throw new Error('No arabic edition')
  const translitEd = byEdition['en.transliteration']
  const transEd = translationId && translationId !== 'none' ? byEdition[translationId] : null
  const out = {
    number: arabicEd.number,
    name: arabicEd.name,
    englishName: arabicEd.englishName,
    numberOfAyahs: arabicEd.numberOfAyahs,
    ayahs: arabicEd.ayahs.map((a, i) => ({
      global: a.number,
      n: a.numberInSurah,
      arabic: a.text,
      transliteration: translitEd && translitEd.ayahs[i] ? translitEd.ayahs[i].text : '',
      translation: transEd && transEd.ayahs[i] ? transEd.ayahs[i].text : ''
    }))
  }
  try { localStorage.setItem(ck, JSON.stringify(out)) } catch { /* storage full — online copy still returned */ }
  return { ...out, fromCache: false }
}

export async function fetchTajweedSurah(number) {
  const ck = surahCacheKey(number, 'quran-tajweed')
  try {
    const raw = localStorage.getItem(ck)
    if (raw) {
      const cached = JSON.parse(raw)
      if (cached && Array.isArray(cached.texts)) return cached.texts
    }
  } catch { /* storage unavailable */ }
  const res = await fetch(`${API}/surah/${number}/quran-tajweed`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json || !json.data || !Array.isArray(json.data.ayahs)) throw new Error('Bad tajweed')
  const texts = json.data.ayahs.map((a) => a.text)
  try { localStorage.setItem(ck, JSON.stringify({ texts })) } catch { /* storage full */ }
  return texts
}

// Parse the quran-tajweed markup: segments look like [code[text] — e.g.
// "[h:8078[ٱ]" or "[q[د]". Returns [{text, rule}] with rule = leading letter
// of the code (or null for plain text). Never throws.
const TAJWEED_RE = /\[([^\[\]]*)\[([^\]]*)\]/g
export function parseTajweed(text) {
  try {
    const out = []
    let last = 0
    let m
    TAJWEED_RE.lastIndex = 0
    while ((m = TAJWEED_RE.exec(text)) !== null) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), rule: null })
      const code = (m[1] || '').trim()
      out.push({ text: m[2], rule: code ? code.charAt(0).toLowerCase() : 'x' })
      last = m.index + m[0].length
    }
    if (last < text.length) out.push({ text: text.slice(last), rule: null })
    // Strip any leftover stray brackets from malformed markup.
    return out.map((s) => ({ ...s, text: s.text.replace(/[\[\]]/g, '') })).filter((s) => s.text)
  } catch {
    return [{ text: String(text || '').replace(/[\[\]]/g, ''), rule: null }]
  }
}

// --- Search (item 7) ---
export async function searchQuran(keyword, edition) {
  const res = await fetch(`${API}/search/${encodeURIComponent(keyword)}/all/${edition}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json || !json.data || !Array.isArray(json.data.matches)) return []
  return json.data.matches.map((m) => ({
    surah: m.surah.number,
    surahName: m.surah.englishName,
    ayah: m.numberInSurah,
    text: m.text,
    edition: m.edition.identifier
  }))
}

// --- Persisted reader state (Dexie settings → profile-aware) ---
export async function getLastRead() { return getSetting('quran_last_read', null) }
export async function setLastRead(v) { await setSetting('quran_last_read', v) }

export async function getBookmarks() { return getSetting('quran_bookmarks', []) }
export async function setBookmarks(v) { await setSetting('quran_bookmarks', v) }

export async function getMemorised() { return getSetting('quran_memorised', []) }
export async function setMemorised(v) { await setSetting('quran_memorised', v) }

// --- Surah Al-Mulk nightly tracker (item 5) ---
export async function getMulkDates() { return getSetting('mulk_dates', []) }
export async function setMulkDates(v) { await setSetting('mulk_dates', v) }

export function mulkStreak(dates, todayStr) {
  const set = new Set(dates)
  let streak = 0
  const d = new Date(`${todayStr}T12:00:00`)
  if (!set.has(todayStr)) d.setDate(d.getDate() - 1)
  for (;;) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!set.has(key)) break
    streak += 1
    d.setDate(d.getDate() - 1)
  }
  return streak
}

// --- Khatam planner (item 4) ---
export async function getKhatamPlan() { return getSetting('khatam_plan', null) }
export async function setKhatamPlan(v) { await setSetting('khatam_plan', v) }

// Convert a global ayah offset (0-based) to {surah, ayah} using metadata.
export function offsetToRef(meta, offset) {
  let acc = 0
  for (const s of meta) {
    if (offset < acc + s.numberOfAyahs) return { surah: s.number, ayah: offset - acc + 1, name: s.englishName }
    acc += s.numberOfAyahs
  }
  const last = meta[meta.length - 1]
  return { surah: last.number, ayah: last.numberOfAyahs, name: last.englishName }
}

export function portionForDay(meta, plan, dayIndex) {
  const perDay = Math.ceil(TOTAL_AYAHS / plan.targetDays)
  const start = dayIndex * perDay
  if (start >= TOTAL_AYAHS) return null
  const end = Math.min(start + perDay, TOTAL_AYAHS) // exclusive
  return {
    startRef: offsetToRef(meta, start),
    endRef: offsetToRef(meta, end - 1),
    count: end - start
  }
}

// --- Prayer alerts (item 13, storage only — firing lives in App/PrayerHub) ---
export const ALERT_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
export function loadPrayerAlerts() {
  try {
    const v = JSON.parse(localStorage.getItem(ALERTS_KEY))
    if (v && typeof v === 'object') return v
  } catch { /* storage unavailable */ }
  return {}
}
export function savePrayerAlerts(v) {
  try { localStorage.setItem(ALERTS_KEY, JSON.stringify(v)) } catch { /* storage unavailable */ }
}
