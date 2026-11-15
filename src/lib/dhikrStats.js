import { db, getSetting, setSetting, todayLocal } from './db'

// Wave 3, item 27 design — per-dhikr counting:
// Every tasbih tap that belongs to a known dhikr is recorded in the Dexie
// `dhikrLog` table as one row per (date, dhikrKey): { id: 'YYYY-MM-DD|key',
// date, key, count }. Sources that feed it:
//   - TasbihCounter taps on wazaif mapped in WAZIFA_DHIKR_KEYS below,
//   - the Dhikr preset counters / multi-counter / guided sessions in
//     TasbihHub (they call recordDhikr directly with the preset key),
//   - the Istighfar challenge counter (key 'astaghfirullah').
// Weekly goals live in the settings table under 'dhikr_goals'
// ({ [dhikrKey]: weeklyTarget, __total: optional overall weekly target })
// and progress is the rolling last-7-days sum from dhikrLog. The challenge
// (item 24) lives in settings under 'istighfar_challenge'.

export const WAZIFA_DHIKR_KEYS = {
  'subhanallahi-wa-bihamdihi': 'subhanallah-bihamdihi',
  'astaghfirullah-rizq': 'astaghfirullah',
  'sayyid-ul-istighfar': 'astaghfirullah',
  'rabbighfir-li-wa-tub-alayya': 'astaghfirullah',
  'la-hawla': 'la-hawla',
  'hasbunallah': 'hasbunallah',
  'hasbiyallahu-la-ilaha-illa-huwa': 'hasbunallah',
  'ya-hayyu-ya-qayyum': 'ya-hayyu-ya-qayyum',
  'durood-e-ibrahimi': 'durood',
  'kalima-tayyiba': 'la-ilaha-illallah',
  'third-kalima': 'subhanallah',
  'tasbih-fatimah': 'subhanallah'
}

const pending = {}
let flushTimer = null

async function flush() {
  flushTimer = null
  const entries = Object.entries(pending)
  for (const k of Object.keys(pending)) delete pending[k]
  for (const [key, n] of entries) {
    if (!n) continue
    const date = todayLocal()
    const id = `${date}|${key}`
    const row = await db.dhikrLog.get(id)
    await db.dhikrLog.put({ id, date, key, count: (row?.count || 0) + n })
  }
}

// Batched so rapid tapping does not hammer IndexedDB: taps accumulate in
// memory and are written at most once every 1.5s (and on page hide).
export function recordDhikr(key, n = 1) {
  if (!key || !n) return
  pending[key] = (pending[key] || 0) + n
  if (!flushTimer) flushTimer = setTimeout(() => { flush().catch(() => {}) }, 1500)
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && flushTimer) { clearTimeout(flushTimer); flush().catch(() => {}) }
  })
}

export function dateOffset(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Returns { [key]: { today, week, lifetime } } for every key present in the
// log. Week = rolling last 7 days including today.
export async function getDhikrStats() {
  const rows = await db.dhikrLog.toArray()
  const today = todayLocal()
  const weekStart = dateOffset(6)
  const out = {}
  for (const r of rows) {
    const s = out[r.key] || (out[r.key] = { today: 0, week: 0, lifetime: 0 })
    s.lifetime += r.count
    if (r.date === today) s.today += r.count
    if (r.date >= weekStart && r.date <= today) s.week += r.count
  }
  return out
}

export async function getDhikrDayCounts(key, days = 7) {
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const date = dateOffset(i)
    const row = await db.dhikrLog.get(`${date}|${key}`)
    out.push({ date, count: row?.count || 0 })
  }
  return out
}

export async function getDhikrCountOn(key, date) {
  const row = await db.dhikrLog.get(`${date}|${key}`)
  return row?.count || 0
}

export async function loadDhikrGoals() {
  const g = await getSetting('dhikr_goals', {})
  return g && typeof g === 'object' ? g : {}
}

export async function saveDhikrGoals(goals) {
  await setSetting('dhikr_goals', goals)
}

export async function loadChallenge() {
  const c = await getSetting('istighfar_challenge', null)
  return c && typeof c === 'object' && c.startDate ? c : null
}

export async function saveChallenge(c) {
  if (c) await setSetting('istighfar_challenge', c)
  else await setSetting('istighfar_challenge', null)
}
