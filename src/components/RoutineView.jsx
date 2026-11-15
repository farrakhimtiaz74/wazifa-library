import React, { useState } from 'react'
import { BarChart3, CalendarDays, Flame, Moon, Plus, Printer, Sun, Target, X } from 'lucide-react'
import { db, queueSync, todayLocal } from '../lib/db'
import { syncNow } from '../lib/sync'
import { t } from '../lib/i18n'

const PRESETS = [33, 100, 313, 450, 1000]

// Item 61: days-of-week scheduling. A routine row may carry `days` — an
// array of JS weekday numbers (0 = Sunday … 6 = Saturday). Missing/invalid
// means "every day" (the pre-Wave-5 behaviour, so nothing migrates).
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]
export function itemDays(routine) {
  const d = routine && routine.days
  if (Array.isArray(d) && d.length && d.every((x) => ALL_DAYS.includes(x))) return d
  return ALL_DAYS
}

export default function RoutineView({ items, streak, onOpen, onAddCustom, onOpenAdhkar, onOpenHistory, onRoutineChange, lang = 'en' }) {
  const [targetFor, setTargetFor] = useState(null)
  const [daysFor, setDaysFor] = useState(null)
  const [customVal, setCustomVal] = useState('')
  const [printOpen, setPrintOpen] = useState(false)
  const todayDow = new Date().getDay()
  const weekdays = t(lang, 'weekdays') || []
  const scheduledToday = items.filter(({ routine }) => itemDays(routine).includes(todayDow))
  const notTodayCount = items.length - scheduledToday.length

  async function persistRow(wazifa, routine, patch) {
    const row = {
      ...(routine || {}),
      wazifa_id: wazifa.id,
      is_bookmarked: routine?.is_bookmarked || true,
      current_count: routine?.current_count || 0,
      target_count: routine?.target_count || wazifa.target_count || 1,
      completed_today: routine?.completed_today || false,
      rounds_today: routine?.rounds_today || 0,
      lifetime_count: routine?.lifetime_count || 0,
      last_reset_date: todayLocal(),
      ...patch,
      updated_at: new Date().toISOString()
    }
    await db.routines.put(row)
    await queueSync('routine', row)
    onRoutineChange && onRoutineChange(row)
    syncNow()
    return row
  }

  async function applyTarget(wazifa, routine, n) {
    const v = Math.max(1, Math.floor(Number(n) || 0))
    if (!v) return
    const cur = routine?.current_count || 0
    await persistRow(wazifa, routine, { target_count: v, completed_today: cur >= v })
    setTargetFor(null)
  }

  async function toggleDay(wazifa, routine, day) {
    const cur = itemDays(routine)
    const next = cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day].sort()
    if (next.length === 0) return // an item must run on at least one day
    await persistRow(wazifa, routine, { days: next })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="rounded-3xl border border-gold/25 p-5 bg-gold/10 flex items-center gap-3">
        <Flame className="text-gold" size={30} />
        <div><p className="font-extrabold text-lg">{streak} {t(lang, 'streakDay')}</p><p className={`text-xs opacity-75 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'streakHelp')}</p></div>
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
      <button onClick={() => setPrintOpen(true)} className="mt-2 w-full py-3 rounded-2xl border border-gold/30 font-bold text-sm inline-flex items-center justify-center gap-1.5">
        <Printer size={16} /> {t(lang, 'printSheetBtn')}
      </button>

      <button onClick={onAddCustom} className="mt-3 w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm inline-flex items-center justify-center gap-1"><Plus size={16} /> {t(lang, 'addCustom')}</button>

      {/* Item 61: weekly overview — which items run on which day. */}
      {items.length > 0 && (
        <div className="rounded-3xl border border-gold/25 p-4 mt-4 bg-white/5">
          <p className={`font-bold text-sm inline-flex items-center gap-1.5 ${lang === 'ur' ? 'font-urdu' : ''}`}><CalendarDays size={15} className="text-gold" /> {t(lang, 'weeklyOverviewTitle')}</p>
          <div className="grid grid-cols-7 gap-1 mt-3 text-center">
            {ALL_DAYS.map((d) => {
              const count = items.filter(({ routine }) => itemDays(routine).includes(d)).length
              const isToday = d === todayDow
              return (
                <div key={d} className={`rounded-xl border py-2 ${isToday ? 'border-gold bg-gold/15' : 'border-gold/15 bg-black/10'}`}>
                  <p className={`text-[10px] font-bold ${lang === 'ur' ? 'font-urdu' : ''}`}>{weekdays[d] || ''}</p>
                  <p className={`text-sm font-extrabold mt-0.5 ${isToday ? 'text-gold' : ''}`}>{count}</p>
                </div>
              )
            })}
          </div>
          {notTodayCount > 0 && <p className={`text-[11px] opacity-60 mt-2.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'notScheduledToday').replace('{n}', notTodayCount)}</p>}
        </div>
      )}

      <div className="space-y-3 mt-4">
        {items.length === 0 && <p className={`text-sm opacity-70 text-center py-8 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'noBookmarks')}</p>}
        {scheduledToday.length === 0 && items.length > 0 && <p className={`text-sm opacity-70 text-center py-6 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'noItemsToday')}</p>}
        {scheduledToday.map(({ wazifa, routine }) => {
          const target = routine?.target_count || wazifa.target_count || 1
          const cur = routine?.current_count || 0
          const pct = Math.min(100, Math.round((cur / target) * 100))
          return (
            <article key={wazifa.id} className="rounded-2xl border border-gold/20 p-4 bg-white/5">
              <div onClick={() => onOpen(wazifa)} className="cursor-pointer">
                <div className="flex justify-between gap-2"><h3 className="font-bold text-sm">{wazifa.title}</h3><span className="text-xs text-gold font-bold">{cur}/{target}</span></div>
                <div className="h-2 rounded-full bg-black/25 mt-2 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>
                <p className="text-[11px] mt-1.5 opacity-70">{routine?.completed_today ? t(lang, 'completedToday') : t(lang, 'pctDoneToday').replace('{pct}', pct)}{routine?.rounds_today ? ` · ${t(lang, 'rounds')}: ${routine.rounds_today}` : ''}</p>
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
              {/* Item 61: days-of-week editor for this item. */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <button onClick={() => setDaysFor(daysFor === wazifa.id ? null : wazifa.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gold/30 text-[11px] font-bold" aria-expanded={daysFor === wazifa.id}>
                  <CalendarDays size={11} /> {t(lang, 'editDays')}: {itemDays(routine).length === 7 ? t(lang, 'everyDay') : `${itemDays(routine).length}/7`}
                </button>
                {daysFor === wazifa.id && (
                  <span className="flex flex-wrap items-center gap-1.5">
                    {ALL_DAYS.map((d) => {
                      const on = itemDays(routine).includes(d)
                      return (
                        <button key={d} onClick={() => toggleDay(wazifa, routine, d)} aria-pressed={on} className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${on ? 'bg-gold text-black border-gold' : 'border-gold/30 opacity-70'}`}>{weekdays[d] || d}</button>
                      )
                    })}
                  </span>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {/* Item 73: printable routine sheet — @media print (index.css) hides
          everything except .print-sheet, so only this sheet is printed. */}
      {printOpen && (
        <div className="print-sheet fixed inset-0 z-[70] overflow-y-auto bg-[#fffdf8] text-black p-6">
          <div className="max-w-xl mx-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg">{t(lang, 'appName')} — {t(lang, 'routine')}</h3>
                <p className="text-xs opacity-70 mt-0.5">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <span className="print-hide flex gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 rounded-full bg-gold text-black text-xs font-bold inline-flex items-center gap-1.5"><Printer size={13} /> {t(lang, 'printBtn')}</button>
                <button onClick={() => setPrintOpen(false)} className="p-2 rounded-full border border-gold/50" aria-label={t(lang, 'closeBtn')}><X size={14} /></button>
              </span>
            </div>
            <div className="mt-5 space-y-2.5">
              {scheduledToday.length === 0 && <p className="text-sm">{t(lang, 'noItemsToday')}</p>}
              {scheduledToday.map(({ wazifa, routine }) => (
                <div key={wazifa.id} className="flex items-center gap-3 border border-black/30 rounded-xl px-3.5 py-3">
                  <span className="w-5 h-5 border-2 border-black/60 rounded shrink-0" />
                  <span className="flex-1 font-bold text-sm">{wazifa.title}</span>
                  <span className="text-xs font-bold">{routine?.target_count || wazifa.target_count || 1}x</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold mt-6">{t(lang, 'printNotesLabel')}</p>
            {[0, 1, 2].map((i) => <div key={i} className="border-b border-black/30 h-8" />)}
            <p className="text-[11px] opacity-60 mt-5">{t(lang, 'appName')} · {todayLocal()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
