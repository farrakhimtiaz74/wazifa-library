import React, { useEffect, useRef, useState } from 'react'
import { X, LogOut, Bell, Download, MapPin, Navigation, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { db, getSetting, setSetting } from '../lib/db'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { CITY_PRESETS, loadLocation, saveLocation } from '../lib/prayerTimes'
import { t } from '../lib/i18n'

export default function SettingsDrawer({ open, onClose, theme, onToggleTheme, lang = 'en', onSetLang, onDataRestored }) {
  const { user, signInWithGoogle, signInWithEmailLink, signInWithPassword, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [reminderOn, setReminderOn] = useState(false)
  const [reminderTime, setReminderTime] = useState('07:00')
  const [backupMsg, setBackupMsg] = useState('')
  const [loc, setLoc] = useState(null)
  const [locMsg, setLocMsg] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    if (!open) return
    getSetting('preferences', {}).then((p) => setName(p.display_name || ''))
    getSetting('reminder', { enabled: false, time: '07:00' }).then((r) => { setReminderOn(!!r.enabled); setReminderTime(r.time || '07:00') })
    setLoc(loadLocation())
  }, [open ])

  function pickCity(name) {
    const city = CITY_PRESETS.find((c) => c.name === name)
    if (!city) return
    const next = { ...city }
    saveLocation(next)
    setLoc(next)
    setLocMsg(t(lang, 'locationSet'))
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) { setLocMsg(t(lang, 'locationFail')); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { name: 'My Location', country: '', lat: Math.round(pos.coords.latitude * 10000) / 10000, lng: Math.round(pos.coords.longitude * 10000) / 10000 }
        saveLocation(next)
        setLoc(next)
        setLocMsg(t(lang, 'locationSet'))
      },
      () => setLocMsg(t(lang, 'locationFail')),
      { timeout: 10000 }
    )
  }

  if (!open) return null

  async function saveName(v) { setName(v); const p = await getSetting('preferences', {}); await setSetting('preferences', { ...p, display_name: v }) }

  async function saveReminder(enabled, time) {
    setReminderOn(enabled); setReminderTime(time)
    await setSetting('reminder', { enabled, time })
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission() } catch { /* permission optional */ }
    }
    if (enabled && 'Notification' in window && Notification.permission === 'denied') {
      setMsg('Notifications are blocked in your browser settings — the in-app reminder banner will still show.')
    }
  }

  async function exportBackup() {
    const data = {
      app: 'wazifa-library',
      version: 2,
      exported_at: new Date().toISOString(),
      routines: await db.routines.toArray(),
      customWazaif: await db.customWazaif.toArray(),
      settings: await db.settings.toArray(),
      history: await db.history.toArray()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wazifa-library-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    setBackupMsg('Backup downloaded.')
  }

  async function importBackup(e) {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (!parsed || parsed.app !== 'wazifa-library' || !Array.isArray(parsed.routines) || !Array.isArray(parsed.customWazaif) || !Array.isArray(parsed.settings)) {
        throw new Error('shape')
      }
      const ok = window.confirm('Import this backup? It will overwrite your current routines, custom Wazaif, settings and history on this device.')
      if (!ok) return
      await db.routines.clear(); await db.routines.bulkPut(parsed.routines)
      await db.customWazaif.clear(); await db.customWazaif.bulkPut(parsed.customWazaif)
      await db.settings.clear(); await db.settings.bulkPut(parsed.settings)
      if (Array.isArray(parsed.history)) { await db.history.clear(); await db.history.bulkPut(parsed.history) }
      for (const r of parsed.routines) await db.syncQueue.add({ type: 'routine', payload: r, created_at: new Date().toISOString() })
      for (const c of parsed.customWazaif) await db.syncQueue.add({ type: 'custom', payload: c, created_at: new Date().toISOString() })
      setBackupMsg('Backup restored. Reloading…')
      onDataRestored && onDataRestored()
      setTimeout(() => window.location.reload(), 600)
    } catch {
      setBackupMsg('That file is not a valid Wazifa Library backup.')
    }
  }

  const sectionTitle = 'text-sm font-bold mb-2'
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-end" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm h-full overflow-y-auto bg-[#0a3527] dark:bg-[#0a3527] bg-[#fffdf8] border-l border-gold/30 p-5">
        <div className="flex items-center justify-between"><h3 className="font-extrabold">Profile & Settings</h3><button onClick={onClose}><X /></button></div>
        {!isSupabaseConfigured && <p className="mt-4 text-xs rounded-xl border border-amber-400/40 bg-amber-400/10 p-3">Guest mode: cloud sync is off. Add Supabase keys to enable sync (set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, e.g. as GitHub repo Secrets, then rebuild). Everything works offline and is saved on this device.</p>}
        {user ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm">Signed in as <b>{user.email}</b></p>
            <input value={name} onChange={(e) => saveName(e.target.value)} placeholder="Display name" className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm" />
            <button onClick={async () => { await signOut(); onClose() }} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-red-400/50 text-red-300 text-xs font-bold"><LogOut size={13} /> Sign out</button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-xs opacity-75">You are using the app as a Guest — no login needed. Sign in only if you want your progress backed up and synced across devices. Your guest progress merges automatically on first sign-in.</p>
            <button disabled={!isSupabaseConfigured} onClick={async () => { const r = await signInWithGoogle(); if (r?.error) setMsg(r.error.message) }} className="w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm disabled:opacity-40">Continue with Google</button>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (optional — or use magic link)" type="password" className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <button disabled={!isSupabaseConfigured || !email} onClick={async () => { const r = await signInWithEmailLink(email); setMsg(r?.error ? r.error.message : 'Magic link sent — check your email.') }} className="py-2.5 rounded-xl border border-gold font-bold text-xs disabled:opacity-40">Email Magic Link</button>
              <button disabled={!isSupabaseConfigured || !email || !password} onClick={async () => { const r = await signInWithPassword(email, password); setMsg(r?.error ? r.error.message : 'Signed in.') }} className="py-2.5 rounded-xl border border-gold font-bold text-xs disabled:opacity-40">Email + Password</button>
            </div>
            {msg && <p className="text-xs text-gold">{msg}</p>}
          </div>
        )}

        <div className="mt-6 border-t border-gold/20 pt-4">
          <p className={sectionTitle}>{t(lang, 'language')}</p>
          <div className="flex gap-2">
            <button onClick={() => onSetLang && onSetLang('en')} className={`px-3 py-2 rounded-full border text-xs font-bold ${lang === 'en' ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>English</button>
            <button onClick={() => onSetLang && onSetLang('ur')} className={`px-3 py-2 rounded-full border text-xs font-bold font-urdu ${lang === 'ur' ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>اردو</button>
          </div>
        </div>

        <div className="mt-6 border-t border-gold/20 pt-4">
          <p className={`${sectionTitle} inline-flex items-center gap-1.5`}><Bell size={14} /> {t(lang, 'reminderTitle')}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => saveReminder(!reminderOn, reminderTime)} className={`px-3 py-2 rounded-full border text-xs font-bold ${reminderOn ? 'bg-gold text-black border-gold' : 'border-gold/40'}`} aria-pressed={reminderOn}>{reminderOn ? 'On' : 'Off'}</button>
            <input type="time" value={reminderTime} onChange={(e) => saveReminder(reminderOn, e.target.value)} className="rounded-xl border border-gold/25 bg-white/5 px-3 py-2 text-sm" aria-label="Reminder time" />
          </div>
          <p className="text-[11px] opacity-60 mt-2">{t(lang, 'reminderHelp')}</p>
        </div>

        <div className="mt-6 border-t border-gold/20 pt-4">
          <p className={`${sectionTitle} inline-flex items-center gap-1.5`}><MapPin size={14} /> {t(lang, 'locationTitle')}</p>
          <div className="flex flex-wrap items-center gap-2">
            <select value={loc && CITY_PRESETS.some((c) => c.name === loc.name) ? loc.name : ''} onChange={(e) => pickCity(e.target.value)} className="flex-1 min-w-[150px] rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold" aria-label={t(lang, 'locationTitle')}>
              <option value="" disabled>{loc ? loc.name : 'Select city'}</option>
              {CITY_PRESETS.map((c) => <option key={c.name} value={c.name} className="text-black">{c.name}{c.country ? `, ${c.country}` : ''}</option>)}
            </select>
            <button onClick={useMyLocation} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-gold/40 text-xs font-bold"><Navigation size={13} /> {t(lang, 'useMyLocation')}</button>
          </div>
          {loc && <p className="text-[11px] opacity-60 mt-2">{loc.name} · {loc.lat}, {loc.lng}{loc.isDefault ? ` (${t(lang, 'defaultCity')})` : ''}</p>}
          {locMsg && <p className="text-xs text-gold mt-1">{locMsg}</p>}
          <p className="text-[11px] opacity-60 mt-2">{t(lang, 'locationHelp')}</p>
        </div>

        <div className="mt-6 border-t border-gold/20 pt-4">
          <p className={sectionTitle}>{t(lang, 'backupTitle')}</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportBackup} className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gold text-black text-xs font-bold"><Download size={13} /> {t(lang, 'exportBtn')}</button>
            <button onClick={() => fileRef.current && fileRef.current.click()} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-gold/40 text-xs font-bold"><Upload size={13} /> {t(lang, 'importBtn')}</button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={importBackup} />
          </div>
          {backupMsg && <p className="text-xs text-gold mt-2">{backupMsg}</p>}
          <p className="text-[11px] opacity-60 mt-2">Backup includes routines, custom Wazaif, preferences, streak, history and total dhikr count. Keep the file somewhere safe.</p>
        </div>

        <div className="mt-6 border-t border-gold/20 pt-4">
          <p className={sectionTitle}>Appearance</p>
          <button onClick={onToggleTheme} className="px-3 py-2 rounded-full border border-gold/40 text-xs font-bold">{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</button>
          <p className="text-[11px] opacity-60 mt-4">Arabic font size and script visibility are adjusted inside each Wazifa reader (A− / A+) and are saved automatically.</p>
        </div>
      </div>
    </div>
  )
}
