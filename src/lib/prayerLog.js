// Wave 2 — Prayer log + Qaza tracker (items 11, 19, 20).
// Stored in Dexie (db v4): prayerLog keyed by date, qaza keyed by prayer.
// The db instance is per-profile (see db.js), so logs are profile-aware.
import { db, todayLocal } from './db'

export const LOG_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

function emptyPrayers() {
  return { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false }
}

export async function getPrayerLog(date) {
  const row = await db.prayerLog.get(date)
  return {
    date,
    prayers: { ...emptyPrayers(), ...(row && row.prayers ? row.prayers : {}) },
    qazaDone: { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0, ...(row && row.qazaDone ? row.qazaDone : {}) }
  }
}

export async function togglePrayer(date, name) {
  const row = await getPrayerLog(date)
  row.prayers[name] = !row.prayers[name]
  await db.prayerLog.put({ ...row, updated_at: new Date().toISOString() })
  return row
}

export async function getAllPrayerLogs() {
  return db.prayerLog.toArray()
}

export async function getQaza() {
  const rows = await db.qaza.toArray()
  const out = { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 }
  for (const r of rows) if (r.prayer in out) out[r.prayer] = Math.max(0, r.owed || 0)
  return out
}

export async function adjustQaza(name, delta) {
  const current = (await getQaza())[name] || 0
  const owed = Math.max(0, current + delta)
  await db.qaza.put({ prayer: name, owed, updated_at: new Date().toISOString() })
  return owed
}

export async function setQaza(name, owed) {
  const v = Math.max(0, Math.floor(Number(owed) || 0))
  await db.qaza.put({ prayer: name, owed: v, updated_at: new Date().toISOString() })
  return v
}

// "Prayed one qaza" — decrement what is owed and record it in today's log.
export async function logQazaPrayed(name) {
  const owed = await adjustQaza(name, -1)
  const today = todayLocal()
  const row = await getPrayerLog(today)
  row.qazaDone[name] = (row.qazaDone[name] || 0) + 1
  await db.prayerLog.put({ ...row, updated_at: new Date().toISOString() })
  return { owed, row }
}

export function isFullDay(row) {
  return !!row && LOG_PRAYERS.every((p) => row.prayers && row.prayers[p])
}

// Current streak of full 5-prayer days. Today counts only once complete;
// otherwise the streak is counted back from yesterday.
export function prayerStreak(logs, todayStr) {
  const map = {}
  for (const r of logs) map[r.date] = r
  let streak = 0
  const d = new Date(`${todayStr}T12:00:00`)
  if (!isFullDay(map[todayStr])) d.setDate(d.getDate() - 1)
  for (;;) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!isFullDay(map[key])) break
    streak += 1
    d.setDate(d.getDate() - 1)
  }
  return streak
}
