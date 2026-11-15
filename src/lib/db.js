import Dexie from 'dexie'
import { getActiveProfileId, PROFILE_DB_NAMES } from './profiles'

// Item 94: the active profile decides which database opens. Profile 1 uses
// the original 'wazifa-library' name, so existing installs keep every row.
export const ACTIVE_PROFILE_ID = getActiveProfileId()
export const db = new Dexie(PROFILE_DB_NAMES[ACTIVE_PROFILE_ID] || 'wazifa-library')

db.version(1).stores({
  routines: 'wazifa_id, is_bookmarked, updated_at',
  customWazaif: 'id, category, updated_at',
  settings: 'key',
  syncQueue: '++id, type, created_at'
})

db.version(2).stores({
  routines: 'wazifa_id, is_bookmarked, updated_at',
  customWazaif: 'id, category, updated_at',
  settings: 'key',
  syncQueue: '++id, type, created_at',
  history: 'date'
})

db.version(3).stores({
  routines: 'wazifa_id, is_bookmarked, updated_at',
  customWazaif: 'id, category, updated_at',
  settings: 'key',
  syncQueue: '++id, type, created_at',
  history: 'date'
})

db.version(4).stores({
  routines: 'wazifa_id, is_bookmarked, updated_at',
  customWazaif: 'id, category, updated_at',
  settings: 'key',
  syncQueue: '++id, type, created_at',
  history: 'date',
  prayerLog: 'date',
  qaza: 'prayer'
})

db.version(5).stores({
  routines: 'wazifa_id, is_bookmarked, updated_at',
  customWazaif: 'id, category, updated_at',
  settings: 'key',
  syncQueue: '++id, type, created_at',
  history: 'date',
  prayerLog: 'date',
  qaza: 'prayer',
  // Wave 3: per-dhikr daily totals (item 27) — one row per day+dhikr key,
  // id is `${date}|${key}`; and the personal Dua Journal (item 33).
  dhikrLog: 'id, date, key',
  duaJournal: 'id, created_at'
}).upgrade(async (tx) => {
  await tx.table('routines').toCollection().modify((r) => {
    if (typeof r.lifetime_count !== 'number') r.lifetime_count = r.current_count || 0
  })
})

export async function getSetting(key, fallback) {
  const row = await db.settings.get(key)
  return row ? row.value : fallback
}

export async function setSetting(key, value) {
  await db.settings.put({ key, value })
}

export async function queueSync(type, payload) {
  await db.syncQueue.add({ type, payload, created_at: new Date().toISOString() })
}

export function todayLocal() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function addTaps(n = 1) {
  const total = (await getSetting('total_taps', 0)) + n
  await setSetting('total_taps', total)
  const today = todayLocal()
  const tapsDate = await getSetting('taps_today_date', null)
  const todayCount = tapsDate === today ? await getSetting('taps_today', 0) : 0
  await setSetting('taps_today_date', today)
  await setSetting('taps_today', todayCount + n)
  return total
}

export async function recordHistorySnapshot(dateStr) {
  const rows = await db.routines.toArray()
  const bookmarked = rows.filter((r) => r.is_bookmarked)
  const completedCount = bookmarked.filter((r) => r.completed_today).length
  const tapsDate = await getSetting('taps_today_date', null)
  const totalTaps = tapsDate === dateStr ? await getSetting('taps_today', 0) : 0
  await db.history.put({
    date: dateStr,
    completedCount,
    totalCount: bookmarked.length,
    allComplete: bookmarked.length > 0 && completedCount === bookmarked.length,
    totalTaps,
    updated_at: new Date().toISOString()
  })
}
