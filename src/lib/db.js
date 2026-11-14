import Dexie from 'dexie'

export const db = new Dexie('wazifa-library')

db.version(1).stores({
  routines: 'wazifa_id, is_bookmarked, updated_at',
  customWazaif: 'id, category, updated_at',
  settings: 'key',
  syncQueue: '++id, type, created_at'
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
