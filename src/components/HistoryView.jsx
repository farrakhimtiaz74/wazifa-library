import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Flame, Hash, Infinity as InfinityIcon, Trophy, CalendarCheck } from 'lucide-react'
import { db, getSetting, todayLocal } from '../lib/db'
import { t } from '../lib/i18n'
import { getAllPrayerLogs, isFullDay, prayerStreak } from '../lib/prayerLog'

function monthKey(y, m) { return `${y}-${String(m + 1).padStart(2, '0')}` }

// D3: History is the single Stats home — it also carries the lifetime totals
// (sum of every Wazifa's lifetime_count) that used to surface separately.
export default function HistoryView({ streak = 0, lang = 'en' }) {
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [history, setHistory] = useState({})
  const [totalTaps, setTotalTaps] = useState(0)
  const [lifetimeTotal, setLifetimeTotal] = useState(0)
  const [prayerLogs, setPrayerLogs] = useState([])

  useEffect(() => {
    ;(async () => {
      const rows = await db.history.toArray()
      const map = {}; rows.forEach((r) => { map[r.date] = r })
      setHistory(map)
      setTotalTaps(await getSetting('total_taps', 0))
      const routines = await db.routines.toArray()
      setLifetimeTotal(routines.reduce((s, r) => s + (r.lifetime_count || 0), 0))
      setPrayerLogs(await getAllPrayerLogs())
    })()
  }, [])

  const longest = useMemo(() => {
    const days = Object.values(history).filter((h) => h.allComplete).map((h) => h.date).sort()
    let best = 0; let run = 0; let prev = null
    for (const d of days) {
      if (prev) {
        const diff = (new Date(`${d}T12:00:00`) - new Date(`${prev}T12:00:00`)) / 86400000
        run = diff === 1 ? run + 1 : 1
      } else run = 1
      best = Math.max(best, run); prev = d
    }
    return Math.max(best, streak > 0 && days.includes(todayLocal()) ? streak : best)
  }, [history, streak])

  const weekCompletions = useMemo(() => {
    let sum = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      sum += history[key]?.completedCount || 0
    }
    return sum
  }, [history])

  const firstDay = new Date(cursor.y, cursor.m, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  const monthName = firstDay.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  const today = todayLocal()

  function shift(delta) {
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  const statCls = 'rounded-2xl border border-gold/20 bg-white/5 p-3 text-center'
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <h2 className={`text-lg font-extrabold ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'historyTitle')}</h2>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className={statCls}><Flame className="mx-auto text-gold" size={20} /><p className="text-xl font-extrabold mt-1">{streak}</p><p className="text-[11px] opacity-70">{t(lang, 'currentStreak')}</p></div>
        <div className={statCls}><Trophy className="mx-auto text-gold" size={20} /><p className="text-xl font-extrabold mt-1">{longest}</p><p className="text-[11px] opacity-70">{t(lang, 'longestStreak')}</p></div>
        <div className={statCls}><Hash className="mx-auto text-gold" size={20} /><p className="text-xl font-extrabold mt-1">{totalTaps.toLocaleString()}</p><p className="text-[11px] opacity-70">{t(lang, 'totalDhikr')}</p></div>
        <div className={statCls}><CalendarCheck className="mx-auto text-gold" size={20} /><p className="text-xl font-extrabold mt-1">{weekCompletions}</p><p className="text-[11px] opacity-70">{t(lang, 'thisWeek')}</p></div>
        <div className={`${statCls} col-span-2`}><InfinityIcon className="mx-auto text-gold" size={20} /><p className="text-xl font-extrabold mt-1">{lifetimeTotal.toLocaleString()}</p><p className="text-[11px] opacity-70">{t(lang, 'lifetimeTotalLabel')}</p></div>
      </div>

      {/* Item 20: prayer log summary — full 5-prayer days + current streak. */}
      <h3 className={`text-base font-extrabold mt-5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'prayerHistoryTitle')}</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className={statCls}><Flame className="mx-auto text-gold" size={20} /><p className="text-xl font-extrabold mt-1">{prayerStreak(prayerLogs, todayLocal())}</p><p className="text-[11px] opacity-70">{t(lang, 'prayerStreakLabel')}</p></div>
        <div className={statCls}><CalendarCheck className="mx-auto text-gold" size={20} /><p className="text-xl font-extrabold mt-1">{prayerLogs.filter(isFullDay).length}</p><p className="text-[11px] opacity-70">{t(lang, 'fullDaysLabel')}</p></div>
      </div>

      <div className="rounded-3xl border border-gold/25 p-4 mt-4 bg-white/5">
        <div className="flex items-center justify-between">
          <button onClick={() => shift(-1)} className="p-2 rounded-full border border-gold/30" aria-label="Previous month"><ChevronLeft size={16} /></button>
          <p className="font-bold text-sm">{monthName}</p>
          <button onClick={() => shift(1)} className="p-2 rounded-full border border-gold/30" aria-label="Next month"><ChevronRight size={16} /></button>
        </div>
        <div className={`grid grid-cols-7 gap-1 mt-3 text-center text-[10px] opacity-60 font-bold ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {(t(lang, 'weekdays') || []).map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {cells.map((d, i) => {
            if (!d) return <span key={`e-${i}`} />
            const key = `${monthKey(cursor.y, cursor.m)}-${String(d).padStart(2, '0')}`
            const h = history[key]
            const cls = h?.allComplete
              ? 'bg-gold text-black font-extrabold'
              : h && h.completedCount > 0
                ? 'bg-gold/25 text-gold font-bold'
                : 'opacity-70'
            return (
              <span key={key} title={h ? `${h.completedCount}/${h.totalCount} ${t(lang, 'completedWord')} · ${h.totalTaps || 0} ${t(lang, 'tapsLabel')}` : t(lang, 'noRecord')}
                className={`relative aspect-square grid place-items-center rounded-lg text-xs ${cls} ${key === today ? 'ring-2 ring-gold' : ''}`}>
                {d}
                {h?.allComplete && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-black/60" />}
              </span>
            )
          })}
        </div>
        <p className={`text-[11px] opacity-60 mt-3 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'historyLegend')}</p>
      </div>
    </div>
  )
}
