import React, { useEffect, useState } from 'react'
import { X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getSetting, setSetting } from '../lib/db'
import { isSupabaseConfigured } from '../lib/supabaseClient'

export default function SettingsDrawer({ open, onClose, theme, onToggleTheme }) {
  const { user, signInWithGoogle, signInWithEmailLink, signInWithPassword, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  useEffect(() => { if (open) getSetting('preferences', {}).then((p) => setName(p.display_name || '')) }, [open ])
  if (!open) return null
  async function saveName(v) { setName(v); const p = await getSetting('preferences', {}); await setSetting('preferences', { ...p, display_name: v }) }
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-end" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm h-full overflow-y-auto bg-[#0a3527] dark:bg-[#0a3527] bg-[#fffdf8] border-l border-gold/30 p-5">
        <div className="flex items-center justify-between"><h3 className="font-extrabold">Profile & Settings</h3><button onClick={onClose}><X /></button></div>
        {!isSupabaseConfigured && <p className="mt-4 text-xs rounded-xl border border-amber-400/40 bg-amber-400/10 p-3">Guest mode: cloud sync is not configured yet (no Supabase keys). Everything works offline and is saved on this device.</p>}
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
          <p className="text-sm font-bold mb-2">Appearance</p>
          <button onClick={onToggleTheme} className="px-3 py-2 rounded-full border border-gold/40 text-xs font-bold">{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</button>
          <p className="text-[11px] opacity-60 mt-4">Arabic font size and script visibility are adjusted inside each Wazifa reader (A− / A+) and are saved automatically.</p>
        </div>
      </div>
    </div>
  )
}
