import React, { useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { todayLocal } from '../lib/db'
import { t } from '../lib/i18n'

// D6: Friday checklist — replaces the old separate Friday Durood counter.
// Ticks are stored per-Friday in localStorage. The Durood row opens the
// normal Tasbih (via the reader) instead of a special counter.
function loadState() {
  try {
    const v = JSON.parse(localStorage.getItem(`wl-friday-${todayLocal()}`))
    if (v && typeof v === 'object') return v
  } catch { /* storage unavailable */ }
  return {}
}

export default function FridayChecklist({ lang = 'en', onOpenKahf, onOpenDurood }) {
  const [state, setState] = useState(loadState)

  function toggle(key) {
    const next = { ...state, [key]: !state[key] }
    setState(next)
    try { localStorage.setItem(`wl-friday-${todayLocal()}`, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }

  const items = [
    { key: 'ghusl', label: t(lang, 'fridayGhusl') },
    { key: 'kahf', label: t(lang, 'fridayKahfItem'), open: onOpenKahf },
    { key: 'durood', label: t(lang, 'fridayDuroodItem'), open: onOpenDurood },
    { key: 'early', label: t(lang, 'fridayEarly') },
    { key: 'duaHour', label: t(lang, 'fridayDuaHour') }
  ]

  return (
    <div className="rounded-3xl border border-gold/50 bg-gold/15 p-4">
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold text-gold uppercase tracking-wider ${lang === 'ur' ? 'font-urdu normal-case tracking-normal text-sm' : ''}`}><Sparkles size={12} /> {t(lang, 'fridayTitle')}</span>
      <div className="space-y-2 mt-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2.5 rounded-2xl bg-black/20 border border-gold/30 px-3 py-2.5">
            <button onClick={() => toggle(item.key)} role="checkbox" aria-checked={!!state[item.key]} aria-label={item.label}
              className={`w-6 h-6 rounded-lg border grid place-items-center shrink-0 text-sm font-extrabold ${state[item.key] ? 'bg-gold text-black border-gold' : 'border-gold/50 text-transparent'}`}>✓</button>
            <span className={`flex-1 text-sm font-semibold ${state[item.key] ? 'line-through opacity-60' : ''} ${lang === 'ur' ? 'font-urdu' : ''}`}>{item.label}</span>
            {item.open && (
              <button onClick={item.open} className="p-1.5 shrink-0 text-gold" aria-label={`${item.label} — ${t(lang, 'openBtn')}`}><ArrowUpRight size={16} /></button>
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] opacity-60 mt-2.5">{t(lang, 'fridayNote')}</p>
    </div>
  )
}
