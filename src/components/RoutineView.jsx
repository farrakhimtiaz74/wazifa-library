import React, { useState } from 'react'
import { BarChart3, Flame, Moon, Plus, Sun, Target } from 'lucide-react'
import { db, queueSync, todayLocal } from '../lib/db'
import { syncNow } from '../lib/sync'
import { t } from '../lib/i18n'

const PRESETS = [33, 100, 313, 450, 1000]

export default function RoutineView({ items, streak, onOpen, onAddCustom, onOpenAdhkar, onOpenHistory, onRoutineChange, lang = 'en' }) {
  const [targetFor, setTargetFor] = useState(null)
  const [customVal, setCustomVal] = useState('')

  async function applyTarget(wazifa, routine, n) {
    const v = Math.max(1, Math.floor(Number(n) || 0))
    if (!v) return
    const cur = routine?.current_count || 0
    const row = {
      wazifa_id: wazifa.id,
      is_bookmarked: routine?.is_bookmarked || true,
      current_count: cur,
      target_count: v,
      completed_today: cur >= v,
      rounds_today: routine?.rounds_today || 0,
      last_reset_date: todayLocal(),
      updated_at: new Date().toISOString()
    }
    await db.routines.put(row)
    await queueSync('routine', row)
    onRoutineChange && onRoutineChange(row)
    syncNow()
    setTargetFor(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="rounded-3xl border border-gold/25 p-5 bg-gold/10 flex items-center gap-3">
        <Flame className="text-gold" size={30} />
        <div><p className="font-extrabold text-lg">{streak} {t(lang, 'streakDay')}</p><p className="text-xs opacity-75">Complete all routine items each day to grow your streak. Resets daily at midnight (your timezone).</p></div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <button onClick={() => onOpenAdhkar && onOpenAdhkar('morning')} className="rounded-2xl border border-gold/25 p-4 bg-white/5 text-left active:scale-[0.99]">
          <Sun className="text-gold" size={20} />
          <p className="font-bold text-sm mt-1.5">{t(lang, 'morningAdhkar')}</p>
          <p className="text-[11px] opacity-70 mt-0.5">{t(lang, 'morningAdhkarSub')}</p>
        </button>
        <button onClick={() => onOpenAdhkar && onOpenAdhkar('evening')} className="rounded-2xl border border-gold/25 p-4 bg-white/5 text-left active:scale-[0.99]">
          <Moon className="text-gold" size={20} />
          <p className="font-bold text-sm mt-1.5">{t(lang, 'eveningAdhkar')}</p>
          <p className="text-[11px] opacity-70 mt-0.5">{t(lang, 'eveningAdhkarSub')}</p>
        </button>
      </div>
      <button onClick={() => onOpenHistory && onOpenHistory()} className="mt-2 w-full py-3 rounded-2xl border border-gold/30 font-bold text-sm inline-flex items-center justify-center gap-1.5">
        <BarChart3 size={16} /> {t(lang, 'historyTitle')}
      </button>

      <button onClick={onAddCustom} className="mt-3 w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm inline-flex items-center justify-center gap-1"><Plus size={16} /> {t(lang, 'addCustom')}</button>
      <div className="space-y-3 mt-4">
        {items.length === 0 && <p className="text-sm opacity-70 text-center py-8">No bookmarked Wazaif yet. Tap the bookmark icon on any Wazifa to add it to your daily routine.</p>}
        {items.map(({ wazifa, routine }) => {
          const target = routine?.target_count || wazifa.target_count || 1
          const cur = routine?.current_count || 0
          const pct = Math.min(100, Math.round((cur / target) * 100))
          return (
            <article key={wazifa.id} className="rounded-2xl border border-gold/20 p-4 bg-white/5">
              <div onClick={() => onOpen(wazifa)} className="cursor-pointer">
                <div className="flex justify-between gap-2"><h3 className="font-bold text-sm">{wazifa.title}</h3><span className="text-xs text-gold font-bold">{cur}/{target}</span></div>
                <div className="h-2 rounded-full bg-black/25 mt-2 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>
                <p className="text-[11px] mt-1.5 opacity-70">{routine?.completed_today ? 'Completed today ✓' : `${pct}% done today`}{routine?.rounds_today ? ` · ${t(lang, 'rounds')}: ${routine.rounds_today}` : ''}</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => setTargetFor(targetFor === wazifa.id ? null : wazifa.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gold/30 text-[11px] font-bold" aria-expanded={targetFor === wazifa.id}>
                  <Target size={11} /> {t(lang, 'setTarget')}: {target}x
                </button>
                {targetFor === wazifa.id && (
                  <span className="flex flex-wrap items-center gap-1.5">
                    {PRESETS.map((p) => <button key={p} onClick={() => applyTarget(wazifa, routine, p)} className="px-2 py-1 rounded-full border border-gold/30 text-[11px]">{p}</button>)}
                    <input type="number" min="1" value={customVal} onChange={(e) => setCustomVal(e.target.value)} placeholder={t(lang, 'customTarget')} className="w-24 rounded-full border border-gold/25 bg-white/5 px-2.5 py-1 text-[11px] outline-none focus:border-gold" />
                    <button onClick={() => applyTarget(wazifa, routine, customVal)} className="px-2.5 py-1 rounded-full bg-gold text-black text-[11px] font-bold">{t(lang, 'apply')}</button>
                    <button onClick={() => applyTarget(wazifa, routine, wazifa.target_count)} className="px-2 py-1 rounded-full border border-gold/30 text-[11px]">{t(lang, 'resetDefaultTarget')}</button>
                  </span>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
