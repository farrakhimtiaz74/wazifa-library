// Wave 4: Hijri (Islamic) calendar helpers built on the platform Intl
// islamic calendar — the same source the Header uses for today's Hijri date.
// All future Hijri dates are ESTIMATES: the actual month start depends on
// moon sighting and can shift by a day or two. UI copy must say so.

export const HIJRI_MONTHS = [
  { en: 'Muharram', ur: 'محرم', roman: 'Muharram' },
  { en: 'Safar', ur: 'صفر', roman: 'Safar' },
  { en: 'Rabi-ul-Awwal', ur: 'ربیع الاول', roman: 'Rabi-ul-Awwal' },
  { en: 'Rabi-ul-Akhir', ur: 'ربیع الثانی', roman: 'Rabi-us-Sani' },
  { en: 'Jumada-ul-Awwal', ur: 'جمادی الاول', roman: 'Jumada-ul-Awwal' },
  { en: 'Jumada-ul-Akhir', ur: 'جمادی الثانی', roman: 'Jumada-us-Sani' },
  { en: 'Rajab', ur: 'رجب', roman: 'Rajab' },
  { en: 'Sha\u2019ban', ur: 'شعبان', roman: 'Shaban' },
  { en: 'Ramadan', ur: 'رمضان', roman: 'Ramadan' },
  { en: 'Shawwal', ur: 'شوال', roman: 'Shawwal' },
  { en: 'Dhul Qa\u2019dah', ur: 'ذوالقعدہ', roman: 'Zulqadah' },
  { en: 'Dhul Hijjah', ur: 'ذوالحجہ', roman: 'Zulhijjah' }
]

const fmt = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' })

export function hijriParts(date = new Date()) {
  const parts = fmt.formatToParts(date)
  const get = (type) => Number((parts.find((p) => p.type === type) || {}).value)
  const month = get('month')
  return { day: get('day'), month, year: get('year'), monthName: HIJRI_MONTHS[month - 1] || HIJRI_MONTHS[0] }
}

function sameHijri(date, y, m, d) {
  const p = hijriParts(date)
  return p.year === y && p.month === m && p.day === d
}

// Find the Gregorian date of a Hijri date by walking forward from `from`
// (default: 40 days back, so "this year's" dates already passed still hit).
// Day-by-day Intl formatting is fast enough for the ~400 day windows here.
export function gregorianForHijri(y, m, d, from = new Date(), backDays = 40) {
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate() - backDays)
  for (let i = 0; i < 800 + backDays; i++) {
    if (sameHijri(cursor, y, m, d)) return new Date(cursor)
    cursor.setDate(cursor.getDate() + 1)
  }
  return null
}

// The next 1 Ramadan strictly after `from`'s current day (if today IS in
// Ramadan, returns the start of the CURRENT Ramadan when inRamadan is set by
// the caller via hijriParts).
export function ramadanStartFor(from = new Date()) {
  const p = hijriParts(from)
  if (p.month === 9) return gregorianForHijri(p.year, 9, 1, from)
  if (p.month < 9) return gregorianForHijri(p.year, 9, 1, from)
  return gregorianForHijri(p.year + 1, 9, 1, from)
}

export function daysBetween(a, b) {
  const d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((d2 - d1) / 86400000)
}

export function addDays(date, n) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() + n)
  return d
}

export function formatGreg(date, lang = 'en') {
  try {
    return new Intl.DateTimeFormat(lang === 'ur' ? 'ur-PK' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(date)
  } catch {
    return date.toDateString()
  }
}

// Wave 5, item 76: Hijri → Gregorian. The Intl islamic calendar is exact for
// conversion purposes (it IS the calendar definition used app-wide), so no
// moon-sighting note is needed for pure conversion. Strategy: estimate the
// Gregorian year (a Hijri year ≈ 0.970224 Gregorian years + epoch offset),
// then walk with gregorianForHijri inside a generous window.
export function hijriToGregorian(y, m, d) {
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 30) return null
  const approx = Math.floor(y * 0.970224 + 621.5643)
  const cursor = new Date(approx - 1, 0, 1)
  for (let i = 0; i < 1150; i++) {
    if (sameHijri(cursor, y, m, d)) return new Date(cursor)
    cursor.setDate(cursor.getDate() + 1)
  }
  return null
}

// Item 60: key events of a Hijri year. `observed` marks dates that many
// Muslims observe but are not agreed by everyone — the UI labels them so.
export const HIJRI_YEAR_EVENTS = [
  { month: 1, day: 1, key: 'evNewYear' },
  { month: 1, day: 9, key: 'evAshuraFast' },
  { month: 1, day: 10, key: 'evAshura' },
  { month: 3, day: 12, key: 'evMawlid', observed: true },
  { month: 7, day: 27, key: 'evIsra' },
  { month: 8, day: 15, key: 'evBaraah', observed: true },
  { month: 9, day: 1, key: 'evRamadanStart' },
  { month: 9, day: 27, key: 'evQadrPossible', observed: true },
  { month: 10, day: 1, key: 'evEidFitr' },
  { month: 12, day: 9, key: 'evArafah' },
  { month: 12, day: 10, key: 'evEidAdha' }
]
