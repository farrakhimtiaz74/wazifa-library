export const CITY_PRESETS = [
  { name: 'Sargodha', country: 'Pakistan', lat: 32.0836, lng: 72.6711 },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587 },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8608, lng: 67.0011 },
  { name: 'Islamabad', country: 'Pakistan', lat: 33.7294, lng: 73.0931 },
  { name: 'Rawalpindi', country: 'Pakistan', lat: 33.5651, lng: 73.0169 },
  { name: 'Faisalabad', country: 'Pakistan', lat: 31.4504, lng: 73.135 },
  { name: 'Multan', country: 'Pakistan', lat: 30.1575, lng: 71.5249 },
  { name: 'Peshawar', country: 'Pakistan', lat: 34.0151, lng: 71.5249 },
  { name: 'Quetta', country: 'Pakistan', lat: 30.1798, lng: 66.975 },
  { name: 'Sialkot', country: 'Pakistan', lat: 32.4945, lng: 74.5229 },
  { name: 'Gujranwala', country: 'Pakistan', lat: 32.1877, lng: 74.1945 },
  { name: 'Hyderabad', country: 'Pakistan', lat: 25.396, lng: 68.3578 },
  { name: 'Makkah', country: 'Saudi Arabia', lat: 21.3891, lng: 39.8579 },
  { name: 'Madinah', country: 'Saudi Arabia', lat: 24.5247, lng: 39.5692 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006 }
]

export const DEFAULT_LOCATION = { ...CITY_PRESETS[0], isDefault: true }

const LOC_KEY = 'wl-prayer-location'
const CACHE_KEY = 'wl-prayer-cache'

export const KAABA = { lat: 21.4225, lng: 39.8262 }

export function loadLocation() {
  try {
    const raw = localStorage.getItem(LOC_KEY)
    if (raw) {
      const loc = JSON.parse(raw)
      if (typeof loc.lat === 'number' && typeof loc.lng === 'number') return loc
    }
  } catch { /* storage unavailable */ }
  return DEFAULT_LOCATION
}

export function saveLocation(loc) {
  try { localStorage.setItem(LOC_KEY, JSON.stringify(loc)) } catch { /* storage unavailable */ }
}

export function dateStamp(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${d.getFullYear()}`
}

function cleanTime(v) {
  const m = String(v || '').match(/(\d{1,2}):(\d{2})/)
  if (!m) return null
  return `${m[1].padStart(2, '0')}:${m[2]}`
}

export function format12h(hhmm) {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export async function fetchPrayerTimes(loc) {
  const today = dateStamp()
  const cache = readCache()
  if (cache && cache.date === today && cache.timings) return { timings: cache.timings, fromCache: true, stale: false }
  try {
    const url = `https://api.aladhan.com/v1/timings/${today}?latitude=${loc.lat}&longitude=${loc.lng}&method=1`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const raw = json && json.data && json.data.timings
    if (!raw) throw new Error('No timings in response')
    const timings = {}
    for (const k of ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) timings[k] = cleanTime(raw[k])
    if (!timings.Fajr || !timings.Maghrib) throw new Error('Incomplete timings')
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, timings, fetchedAt: new Date().toISOString() })) } catch { /* storage unavailable */ }
    return { timings, fromCache: false, stale: false }
  } catch (err) {
    if (cache && cache.timings) return { timings: cache.timings, fromCache: true, stale: cache.date !== today }
    return null
  }
}

export const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export function nextPrayer(timings, now = new Date()) {
  if (!timings) return null
  for (const name of PRAYER_ORDER) {
    const t = timings[name]
    if (!t) continue
    const [h, m] = t.split(':').map(Number)
    const at = new Date(now)
    at.setHours(h, m, 0, 0)
    if (at > now) return { name, at, tomorrow: false }
  }
  const t = timings.Fajr
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  const at = new Date(now)
  at.setDate(at.getDate() + 1)
  at.setHours(h, m, 0, 0)
  return { name: 'Fajr', at, tomorrow: true }
}

export function currentPrayer(timings, now = new Date()) {
  if (!timings) return null
  let current = null
  for (const name of PRAYER_ORDER) {
    const t = timings[name]
    if (!t) continue
    const [h, m] = t.split(':').map(Number)
    const at = new Date(now)
    at.setHours(h, m, 0, 0)
    if (at <= now) current = name
  }
  return current || 'Isha'
}

const toRad = (d) => (d * Math.PI) / 180
const toDeg = (r) => (r * 180) / Math.PI

export function qiblaBearing(lat, lng) {
  const phi1 = toRad(lat)
  const phi2 = toRad(KAABA.lat)
  const dLng = toRad(KAABA.lng - lng)
  const y = Math.sin(dLng)
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLng)
  const brg = toDeg(Math.atan2(y, x))
  return (brg + 360) % 360
}

export function distanceToMakkah(lat, lng) {
  const R = 6371
  const dLat = toRad(KAABA.lat - lat)
  const dLng = toRad(KAABA.lng - lng)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(KAABA.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}
