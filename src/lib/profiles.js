// Multi-profile support (item 94).
// Design: each profile gets its OWN Dexie database. Profile 1 keeps the
// original 'wazifa-library' database name, so all existing data becomes
// Profile 1 with zero migration and zero data-loss risk. Profiles 2 and 3
// use their own database names. Switching profiles stores the active id in
// localStorage and reloads the app; db.js reads the active id synchronously
// at module load and opens the matching database.
export const PROFILE_IDS = ['p1', 'p2', 'p3']
export const PROFILE_DB_NAMES = {
  p1: 'wazifa-library',
  p2: 'wazifa-library-p2',
  p3: 'wazifa-library-p3'
}

const META_KEY = 'wl-profiles'
const ACTIVE_KEY = 'wl-active-profile'

export function getActiveProfileId() {
  try {
    const v = localStorage.getItem(ACTIVE_KEY)
    if (PROFILE_IDS.includes(v)) return v
  } catch { /* storage unavailable */ }
  return 'p1'
}

export function loadProfileMeta() {
  try {
    const v = JSON.parse(localStorage.getItem(META_KEY))
    if (Array.isArray(v)) {
      const clean = v.filter((p) => p && PROFILE_IDS.includes(p.id) && typeof p.name === 'string')
      if (clean.length) return clean
    }
  } catch { /* storage unavailable */ }
  return [{ id: 'p1', name: 'Profile 1' }]
}

export function saveProfileMeta(list) {
  try { localStorage.setItem(META_KEY, JSON.stringify(list)) } catch { /* storage unavailable */ }
}

export function ensureProfile(id) {
  const meta = loadProfileMeta()
  if (!meta.some((p) => p.id === id)) {
    const n = PROFILE_IDS.indexOf(id) + 1
    meta.push({ id, name: `Profile ${n}` })
    saveProfileMeta(meta)
  }
  return loadProfileMeta()
}

export function switchProfile(id) {
  if (!PROFILE_IDS.includes(id)) return
  ensureProfile(id)
  try { localStorage.setItem(ACTIVE_KEY, id) } catch { /* storage unavailable */ }
  window.location.reload()
}
