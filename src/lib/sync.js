import { supabase } from './supabaseClient'
import { db, getSetting, setSetting, todayLocal } from './db'

let status = navigator.onLine ? 'local' : 'offline'
const listeners = new Set()

export function getSyncStatus() { return status }
export function subscribeSync(fn) { listeners.add(fn); fn(status); return () => listeners.delete(fn) }
function setStatus(s) { status = s; listeners.forEach((f) => f(s)) }

let currentUser = null
export function setSyncUser(user) { currentUser = user; if (user) syncNow() }

export async function syncNow() {
  if (!supabase || !currentUser) { setStatus(navigator.onLine ? 'local' : 'offline'); return }
  if (!navigator.onLine) { setStatus('offline'); return }
  setStatus('syncing')
  try {
    const userId = currentUser.id
    const routines = await db.routines.toArray()
    for (const r of routines) {
      await supabase.from('user_routines').upsert({
        user_id: userId, wazifa_id: r.wazifa_id, is_bookmarked: !!r.is_bookmarked,
        current_count: r.current_count || 0, target_count: r.target_count || 0,
        completed_today: !!r.completed_today, last_reset_date: r.last_reset_date || todayLocal(),
        updated_at: r.updated_at || new Date().toISOString()
      }, { onConflict: 'user_id,wazifa_id' })
    }
    const customs = await db.customWazaif.toArray()
    for (const c of customs) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id)
      const payload = {
        user_id: userId, title: c.title, category: c.category, arabic: c.arabic,
        transliteration: c.transliteration, english_translation: c.english_translation,
        urdu_translation: c.urdu_translation, target_count: c.target_count || 33,
        recommended_time: c.recommended_time, instructions: c.instructions,
        updated_at: c.updated_at || new Date().toISOString()
      }
      if (isUuid) payload.id = c.id
      const { data } = await supabase.from('custom_wazaif').upsert(payload).select().single()
      if (data && data.id !== c.id) { await db.customWazaif.delete(c.id); await db.customWazaif.put({ ...c, id: data.id }) }
    }
    const streak = await getSetting('daily_streak', 0)
    const prefs = await getSetting('preferences', {})
    await supabase.from('profiles').upsert({
      id: userId, email: currentUser.email || null,
      display_name: prefs.display_name || '', daily_streak: streak,
      last_active_date: todayLocal(), preferences_json: prefs,
      updated_at: new Date().toISOString()
    })

    const { data: remoteRoutines } = await supabase.from('user_routines').select('*').eq('user_id', userId)
    for (const rr of remoteRoutines || []) {
      const local = await db.routines.get(rr.wazifa_id)
      if (!local || new Date(rr.updated_at) > new Date(local.updated_at || 0)) {
        await db.routines.put({ wazifa_id: rr.wazifa_id, is_bookmarked: rr.is_bookmarked, current_count: rr.current_count, target_count: rr.target_count, completed_today: rr.completed_today, last_reset_date: rr.last_reset_date, updated_at: rr.updated_at })
      }
    }
    const { data: remoteCustom } = await supabase.from('custom_wazaif').select('*').eq('user_id', userId)
    for (const rc of remoteCustom || []) {
      const local = await db.customWazaif.get(rc.id)
      if (!local || new Date(rc.updated_at) > new Date(local.updated_at || 0)) {
        await db.customWazaif.put({ id: rc.id, title: rc.title, category: rc.category, arabic: rc.arabic, transliteration: rc.transliteration, english_translation: rc.english_translation, urdu_translation: rc.urdu_translation, target_count: rc.target_count, recommended_time: rc.recommended_time, instructions: rc.instructions, updated_at: rc.updated_at })
      }
    }
    await db.syncQueue.clear()
    setStatus('synced')
  } catch (e) {
    console.warn('Sync failed, data remains local', e)
    setStatus(navigator.onLine ? 'local' : 'offline')
  }
}

export async function mergeGuestIntoAccount(user) {
  currentUser = user
  const merged = await getSetting('guest_merged_for', null)
  if (merged === user.id) { await syncNow(); return }
  await syncNow()
  await setSetting('guest_merged_for', user.id)
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { setStatus('local'); syncNow() })
  window.addEventListener('offline', () => setStatus('offline'))
}
