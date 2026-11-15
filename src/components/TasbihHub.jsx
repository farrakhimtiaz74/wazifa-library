import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, BarChart3, BookOpen, Check, Layers, Moon, Play, RotateCcw, Sparkles, Square, Target, Timer, Trophy } from 'lucide-react'
import { dhikrPresets, duroodList, duroodWazifa, presetByKey, presetWazifa } from '../data/dhikrPresets'
import { addTaps, todayLocal } from '../lib/db'
import { getDhikrCountOn, getDhikrDayCounts, getDhikrStats, loadChallenge, recordDhikr, saveChallenge } from '../lib/dhikrStats'
import { t } from '../lib/i18n'
import TasbihCounter from './TasbihCounter'

function Shell({ title, sub, lang, onBack, children }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${lang === 'ur' ? 'font-urdu' : ''}`}>{title}</h2>
      {sub && <p className={`text-xs opacity-70 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{sub}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function labelForKey(key, lang) {
  const p = presetByKey(key)
  if (p) return lang === 'ur' ? p.transliteration : p.transliteration
  if (key === 'durood') return 'Durood'
  return key
}

// ---------- Item 22: timed guided session ----------
function GuidedSession({ lang, onBack }) {
  const [minutes, setMinutes] = useState(5)
  const [rotation, setRotation] = useState(['subhanallah', 'alhamdulillah', 'allahu-akbar', 'la-ilaha-illallah'])
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [segCount, setSegCount] = useState(0)
  const [done, setDone] = useState(false)
  const startRef = useRef(0)
  const baseRef = useRef(0)
  const segRef = useRef(0)

  const total = minutes * 60
  const segIndex = Math.min(rotation.length - 1, Math.floor(elapsed / 60) % Math.max(1, rotation.length))
  const current = presetByKey(rotation[segIndex]) || dhikrPresets[0]

  useEffect(() => {
    if (!running) return undefined
    startRef.current = Date.now()
    const id = setInterval(() => {
      const e = baseRef.current + (Date.now() - startRef.current) / 1000
      if (e >= total) {
        setElapsed(total)
        setRunning(false)
        setDone(true)
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300])
        try {
          if (localStorage.getItem('wl-tasbih-sound') === '1') {
            const Ctx = window.AudioContext || window.webkitAudioContext
            if (Ctx) { const ctx = new Ctx(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.frequency.value = 880; g.gain.setValueAtTime(0.15, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.45) }
          }
        } catch { /* sound optional */ }
        return
      }
      const newSeg = Math.floor(e / 60) % Math.max(1, rotation.length)
      if (newSeg !== segRef.current) { segRef.current = newSeg; setSegCount(0) }
      setElapsed(e)
    }, 250)
    return () => clearInterval(id)
  }, [running, total, rotation.length])

  function toggleRun() {
    if (running) { baseRef.current = elapsed; setRunning(false) }
    else { setDone(false); setRunning(true) }
  }

  function reset() {
    setRunning(false); setElapsed(0); baseRef.current = 0; segRef.current = 0; setSegCount(0); setDone(false)
  }

  function tap() {
    if (!running) return
    setSegCount((c) => c + 1)
    if (navigator.vibrate) navigator.vibrate(15)
    recordDhikr(current.key, 1)
    addTaps(1)
  }

  function toggleRotation(key) {
    setRotation((r) => (r.includes(key) ? r.filter((k) => k !== key) : [...r, key]))
  }

  const remain = Math.max(0, Math.ceil(total - elapsed))
  const mm = String(Math.floor(remain / 60)).padStart(2, '0')
  const ss = String(remain % 60).padStart(2, '0')
  const R = 84; const CIRC = 2 * Math.PI * R
  const progress = total ? Math.min(1, elapsed / total) : 0

  return (
    <Shell title={t(lang, 'sessionTitle')} sub={t(lang, 'sessionSub')} lang={lang} onBack={onBack}>
      {!running && elapsed === 0 && !done ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold mb-2">{t(lang, 'sessionLength')}</p>
            <div className="flex gap-2">
              {[5, 10, 15].map((m) => (
                <button key={m} onClick={() => setMinutes(m)} className={`px-4 py-2 rounded-full text-sm border ${minutes === m ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30'}`}>{m} {t(lang, 'minutesLabel')}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold mb-2">{t(lang, 'sessionRotation')}</p>
            <div className="flex flex-wrap gap-2">
              {dhikrPresets.map((p) => (
                <button key={p.key} onClick={() => toggleRotation(p.key)} aria-pressed={rotation.includes(p.key)} className={`px-3 py-1.5 rounded-full text-xs border ${rotation.includes(p.key) ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-75'}`}>{p.transliteration}</button>
              ))}
            </div>
            <p className="text-[11px] opacity-60 mt-2">{t(lang, 'sessionRotationHelp')}</p>
          </div>
          <button onClick={toggleRun} disabled={rotation.length === 0} className="w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm disabled:opacity-40 inline-flex items-center justify-center gap-2"><Play size={16} /> {t(lang, 'sessionStart')}</button>
        </div>
      ) : (
        <div className="text-center">
          <button onClick={tap} aria-label={t(lang, 'tapToCount')} className="relative mx-auto block w-[200px] h-[200px] rounded-full select-none touch-manipulation">
            <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0">
              <circle cx="100" cy="100" r={R} fill="rgba(212,175,55,0.08)" stroke="rgba(6,44,34,0.55)" strokeWidth="10" />
              <circle cx="100" cy="100" r={R} fill="none" stroke="#D4AF37" strokeWidth="10" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)} transform="rotate(-90 100 100)" />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <span className="text-4xl font-extrabold leading-none">{mm}:{ss}</span>
              <span className="text-xs font-bold mt-1.5 opacity-80">{done ? t(lang, 'sessionDone') : `${t(lang, 'sessionThisMinute')}: ${segCount}`}</span>
            </span>
          </button>
          <p className="font-arabic text-3xl mt-4" dir="rtl">{current.arabic}</p>
          <p className="font-bold mt-1">{current.transliteration}</p>
          <p className="text-xs opacity-70">{current.english}</p>
          <div className="flex gap-2 justify-center mt-5">
            {!done && <button onClick={toggleRun} className="px-4 py-2 rounded-full border border-gold/40 text-xs font-bold inline-flex items-center gap-1">{running ? <Square size={12} /> : <Play size={12} />} {running ? t(lang, 'sessionPause') : t(lang, 'sessionResume')}</button>}
            <button onClick={reset} className="px-4 py-2 rounded-full border border-gold/40 text-xs font-bold inline-flex items-center gap-1"><RotateCcw size={12} /> {t(lang, 'resetCounter')}</button>
          </div>
          {done && <p className="text-gold font-bold text-sm mt-4">{t(lang, 'sessionDoneMsg')}</p>}
        </div>
      )}
    </Shell>
  )
}

// ---------- Item 30: multi-counter ----------
const MULTI_KEY = 'wl-multi-counter-v1'
function loadMulti() {
  try {
    const v = JSON.parse(localStorage.getItem(MULTI_KEY))
    if (Array.isArray(v) && v.length === 3) return v
  } catch { /* fresh */ }
  return [
    { key: 'subhanallah', count: 0, target: 33 },
    { key: 'alhamdulillah', count: 0, target: 33 },
    { key: 'allahu-akbar', count: 0, target: 34 }
  ]
}

function MultiCounter({ lang, onBack }) {
  const [slots, setSlots] = useState(loadMulti)
  useEffect(() => { try { localStorage.setItem(MULTI_KEY, JSON.stringify(slots)) } catch { /* storage */ } }, [slots])

  function update(i, patch) { setSlots((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x))) }
  function tap(i) {
    const slot = slots[i]
    if (slot.count >= slot.target) return
    update(i, { count: slot.count + 1 })
    if (navigator.vibrate) navigator.vibrate(15)
    recordDhikr(slot.key, 1)
    addTaps(1)
  }

  return (
    <Shell title={t(lang, 'multiTitle')} sub={t(lang, 'multiSub')} lang={lang} onBack={onBack}>
      <div className="space-y-3">
        {slots.map((slot, i) => {
          const done = slot.count >= slot.target
          return (
            <div key={i} className="rounded-3xl border border-gold/25 p-4 bg-white/5">
              <div className="flex items-center gap-2">
                <select value={slot.key} onChange={(e) => update(i, { key: e.target.value, count: 0 })} className="flex-1 min-w-0 rounded-xl border border-gold/25 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold" aria-label={t(lang, 'multiTitle')}>
                  {dhikrPresets.map((p) => <option key={p.key} value={p.key} className="text-black">{p.transliteration}</option>)}
                </select>
                <input type="number" min="1" value={slot.target} onChange={(e) => update(i, { target: Math.max(1, Number(e.target.value) || 1) })} className="w-20 rounded-xl border border-gold/25 bg-white/5 px-2 py-2 text-sm outline-none focus:border-gold" aria-label={t(lang, 'targetLabel')} />
                <button onClick={() => update(i, { count: 0 })} className="p-2 border border-gold/30 rounded-full" aria-label={t(lang, 'resetCounter')}><RotateCcw size={14} /></button>
              </div>
              <button onClick={() => tap(i)} className={`w-full mt-3 py-4 rounded-2xl text-center active:scale-[0.99] ${done ? 'bg-gold/25 border border-gold' : 'bg-gold text-black'}`}>
                <span className="font-arabic block text-2xl" dir="rtl">{presetByKey(slot.key)?.arabic}</span>
                <span className="block text-2xl font-extrabold mt-1">{slot.count} / {slot.target}</span>
                <span className="block text-[10px] font-bold tracking-widest opacity-70">{done ? t(lang, 'completed') : t(lang, 'tapToCount')}</span>
              </button>
            </div>
          )
        })}
      </div>
    </Shell>
  )
}

// ---------- Item 24: Istighfar challenge ----------
function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T12:00:00`)
  d.setDate(d.getDate() + n)
  const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function Challenge({ lang, onBack }) {
  const [challenge, setChallenge] = useState(undefined)
  const [todayCount, setTodayCount] = useState(0)
  const [dayCounts, setDayCounts] = useState([])
  const [days, setDays] = useState(7)
  const [target, setTarget] = useState(100)

  async function refresh(c) {
    if (!c) { setDayCounts([]); setTodayCount(0); return }
    setTodayCount(await getDhikrCountOn('astaghfirullah', todayLocal()))
    const rows = []
    for (let i = 0; i < c.days; i++) {
      const date = addDays(c.startDate, i)
      rows.push({ date, count: await getDhikrCountOn('astaghfirullah', date) })
    }
    setDayCounts(rows)
  }

  useEffect(() => { loadChallenge().then((c) => { setChallenge(c); refresh(c) }) }, [])

  async function start() {
    const c = { days, target, startDate: todayLocal() }
    await saveChallenge(c)
    setChallenge(c)
    refresh(c)
  }

  async function stop() {
    await saveChallenge(null)
    setChallenge(null)
    refresh(null)
  }

  function tap() {
    setTodayCount((c) => c + 1)
    if (navigator.vibrate) navigator.vibrate(15)
    recordDhikr('astaghfirullah', 1)
    addTaps(1)
    setDayCounts((rows) => rows.map((r) => (r.date === todayLocal() ? { ...r, count: r.count + 1 } : r)))
  }

  if (challenge === undefined) return <Shell title={t(lang, 'challengeTitle')} lang={lang} onBack={onBack}><p className="text-sm opacity-70">…</p></Shell>

  if (!challenge) {
    return (
      <Shell title={t(lang, 'challengeTitle')} sub={t(lang, 'challengeSub')} lang={lang} onBack={onBack}>
        <p className="text-sm font-bold mb-2">{t(lang, 'challengeLength')}</p>
        <div className="flex gap-2">
          {[7, 30].map((d) => (
            <button key={d} onClick={() => setDays(d)} className={`px-4 py-2 rounded-full text-sm border ${days === d ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30'}`}>{d} {t(lang, 'daysLabel')}</button>
          ))}
          <input type="number" min="1" max="365" value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))} className="w-20 rounded-full border border-gold/30 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold" aria-label={t(lang, 'challengeLength')} />
        </div>
        <p className="text-sm font-bold mt-4 mb-2">{t(lang, 'challengeDailyTarget')}</p>
        <input type="number" min="1" value={target} onChange={(e) => setTarget(Math.max(1, Number(e.target.value) || 1))} className="w-28 rounded-xl border border-gold/25 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold" />
        <button onClick={start} className="w-full mt-5 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'challengeStart')}</button>
        <p className="text-[11px] opacity-60 mt-3 leading-relaxed">{t(lang, 'challengeNote')}</p>
      </Shell>
    )
  }

  const todayIdx = dayCounts.findIndex((r) => r.date === todayLocal())
  const dayNum = todayIdx >= 0 ? todayIdx + 1 : challenge.days
  const finished = todayLocal() > addDays(challenge.startDate, challenge.days - 1)
  const metDays = dayCounts.filter((r) => r.count >= challenge.target).length

  return (
    <Shell title={t(lang, 'challengeTitle')} sub={`${t(lang, 'challengeDayOf').replace('{x}', Math.min(dayNum, challenge.days)).replace('{n}', challenge.days)} · ${metDays}/${challenge.days} ✓`} lang={lang} onBack={onBack}>
      <div className="flex gap-1.5 flex-wrap">
        {dayCounts.map((r, i) => (
          <div key={r.date} className={`w-9 rounded-xl border p-1.5 text-center ${r.date === todayLocal() ? 'border-gold bg-gold/15' : 'border-gold/20'}`} title={r.date}>
            <span className="block text-[9px] opacity-60">{i + 1}</span>
            <span className={`block text-[11px] font-extrabold ${r.count >= challenge.target ? 'text-gold' : ''}`}>{r.count >= challenge.target ? <Check size={12} className="mx-auto" /> : r.count}</span>
          </div>
        ))}
      </div>
      {!finished ? (
        <>
          <button onClick={tap} className="w-full mt-5 py-6 rounded-3xl bg-gold text-black text-center active:scale-[0.99]">
            <span className="font-arabic block text-3xl" dir="rtl">أَسْتَغْفِرُ اللَّهَ</span>
            <span className="block text-4xl font-extrabold mt-2">{todayCount} / {challenge.target}</span>
            <span className="block text-[10px] font-bold tracking-widest opacity-70 mt-1">{t(lang, 'tapToCount')}</span>
          </button>
          {todayCount >= challenge.target && <p className="text-gold font-bold text-sm text-center mt-3 inline-flex items-center gap-1 w-full justify-center"><Trophy size={15} /> {t(lang, 'challengeDayDone')}</p>}
        </>
      ) : (
        <p className="text-gold font-bold text-sm text-center mt-5">{t(lang, 'challengeFinished').replace('{n}', metDays).replace('{total}', challenge.days)}</p>
      )}
      <button onClick={stop} className="w-full mt-5 py-2.5 rounded-2xl border border-red-400/50 text-red-300 text-xs font-bold">{t(lang, 'challengeEnd')}</button>
    </Shell>
  )
}

// ---------- Item 29: per-dhikr history ----------
function DhikrHistory({ lang, onBack }) {
  const [stats, setStats] = useState(null)
  const [selected, setSelected] = useState('subhanallah')
  const [bars, setBars] = useState([])

  useEffect(() => { getDhikrStats().then(setStats) }, [])
  useEffect(() => { getDhikrDayCounts(selected, 7).then(setBars) }, [selected])

  const keys = useMemo(() => {
    const set = new Set(dhikrPresets.map((p) => p.key))
    if (stats) Object.keys(stats).forEach((k) => set.add(k))
    return [...set]
  }, [stats])
  const maxBar = Math.max(1, ...bars.map((b) => b.count))

  return (
    <Shell title={t(lang, 'dhikrHistoryTitle')} sub={t(lang, 'dhikrHistorySub')} lang={lang} onBack={onBack}>
      {!stats ? <p className="text-sm opacity-70">…</p> : (
        <>
          <div className="space-y-2">
            {keys.map((k) => {
              const s = stats[k] || { today: 0, week: 0, lifetime: 0 }
              return (
                <button key={k} onClick={() => setSelected(k)} className={`w-full rounded-2xl border p-3 text-left ${selected === k ? 'border-gold bg-gold/10' : 'border-gold/20 bg-white/5'}`}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">{labelForKey(k, lang)}</span>
                    <span className="font-arabic text-lg" dir="rtl">{presetByKey(k)?.arabic || ''}</span>
                  </span>
                  <span className="block text-[11px] opacity-70 mt-1">{t(lang, 'todayLabel')}: {s.today} · {t(lang, 'thisWeek')}: {s.week} · {t(lang, 'lifetime')}: {s.lifetime.toLocaleString()}</span>
                </button>
              )
            })}
          </div>
          <p className="text-sm font-bold mt-5 mb-2">{labelForKey(selected, lang)} — {t(lang, 'last7Days')}</p>
          <div className="flex items-end gap-2 h-28 rounded-2xl border border-gold/20 p-3 bg-white/5">
            {bars.map((b) => (
              <div key={b.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <span className="text-[10px] font-bold">{b.count}</span>
                <div className="w-full rounded-t-md bg-gold/70" style={{ height: `${Math.max(4, (b.count / maxBar) * 64)}px` }} />
                <span className="text-[9px] opacity-60">{b.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Shell>
  )
}

// ---------- Hub root (items 21 + 23 + entries) ----------
export default function TasbihHub({ lang = 'en', routines = {}, onRoutineChange, onBack }) {
  const [page, setPage] = useState('menu')
  const [countWazifa, setCountWazifa] = useState(null)
  const [durood, setDurood] = useState(null)

  if (page === 'session') return <GuidedSession lang={lang} onBack={() => setPage('menu')} />
  if (page === 'multi') return <MultiCounter lang={lang} onBack={() => setPage('menu')} />
  if (page === 'challenge') return <Challenge lang={lang} onBack={() => setPage('menu')} />
  if (page === 'history') return <DhikrHistory lang={lang} onBack={() => setPage('menu')} />

  if (page === 'count' && countWazifa) {
    return (
      <Shell title={countWazifa.title} lang={lang} onBack={() => setPage(countWazifa.id.startsWith('durood-') ? 'durood' : 'presets')}>
        <div className="rounded-3xl border border-gold/25 p-5 bg-white/5 text-center">
          <p className="font-arabic text-3xl leading-relaxed" dir="rtl">{countWazifa.arabic}</p>
          {countWazifa.transliteration && <p className="text-sm italic opacity-90 mt-3">{countWazifa.transliteration}</p>}
          {countWazifa.english_translation && <p className="text-sm mt-2">{countWazifa.english_translation}</p>}
          {countWazifa.urdu_translation && <p className="font-urdu text-base mt-2" dir="rtl">{countWazifa.urdu_translation}</p>}
        </div>
        <TasbihCounter wazifa={countWazifa} routine={routines[countWazifa.id]} onRoutineChange={onRoutineChange} lang={lang} />
      </Shell>
    )
  }

  if (page === 'duroodDetail' && durood) {
    return (
      <Shell title={durood.name} lang={lang} onBack={() => setPage('durood')}>
        <div className="rounded-3xl border border-gold/25 p-5 bg-white/5">
          <p className="font-arabic text-2xl leading-loose text-center" dir="rtl">{durood.arabic}</p>
          <p className="text-sm italic opacity-90 mt-4">{durood.transliteration}</p>
          <p className="text-sm mt-3 leading-relaxed">{durood.english}</p>
          <p className="font-urdu text-base mt-3 text-right" dir="rtl">{durood.urdu}</p>
        </div>
        <p className="text-[11px] opacity-70 mt-3 leading-relaxed">{t(lang, 'referenceLabel')}: {durood.source}</p>
        <button onClick={() => { setCountWazifa(duroodWazifa(durood)); setPage('count') }} className="w-full mt-4 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'countThisDurood')}</button>
      </Shell>
    )
  }

  if (page === 'durood') {
    return (
      <Shell title={t(lang, 'duroodHubTitle')} sub={t(lang, 'duroodHubSub')} lang={lang} onBack={() => setPage('menu')}>
        <div className="space-y-2">
          {duroodList.map((d) => (
            <button key={d.id} onClick={() => { setDurood(d); setPage('duroodDetail') }} className="w-full rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <span className="block font-bold text-sm">{d.name}</span>
              <span className="font-arabic block text-lg mt-1 line-clamp-1" dir="rtl">{d.arabic}</span>
              <span className="block text-[11px] opacity-60 mt-1">{t(lang, 'targetLabel')} {d.target}x</span>
            </button>
          ))}
        </div>
      </Shell>
    )
  }

  if (page === 'presets') {
    return (
      <Shell title={t(lang, 'presetsTitle')} sub={t(lang, 'presetsSub')} lang={lang} onBack={() => setPage('menu')}>
        <div className="grid grid-cols-2 gap-2">
          {dhikrPresets.map((p) => (
            <button key={p.key} onClick={() => { setCountWazifa(presetWazifa(p)); setPage('count') }} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <span className="font-arabic block text-xl leading-snug" dir="rtl">{p.arabic}</span>
              <span className="block font-bold text-[13px] mt-1.5">{p.transliteration}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">{lang === 'ur' ? p.urdu : p.english}</span>
              <span className="block text-[10px] text-gold mt-1.5">{t(lang, 'targetLabel')} {p.target}x</span>
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {dhikrPresets.map((p) => (
            <p key={p.key} className="text-[11px] opacity-70 leading-relaxed"><b className="text-gold">{p.transliteration}:</b> {p.virtues}</p>
          ))}
        </div>
      </Shell>
    )
  }

  const menuBtn = (target, Icon, title, sub) => (
    <button onClick={() => setPage(target)} className="w-full rounded-2xl border border-gold/25 p-4 bg-white/5 text-left flex items-center gap-3 active:scale-[0.99]">
      <Icon className="text-gold shrink-0" size={20} />
      <span className="min-w-0">
        <span className={`block font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{title}</span>
        <span className={`block text-[11px] opacity-70 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{sub}</span>
      </span>
    </button>
  )

  return (
    <Shell title={t(lang, 'dhikrHubTitle')} sub={t(lang, 'dhikrHubSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {menuBtn('presets', Sparkles, t(lang, 'presetsTitle'), t(lang, 'presetsSub'))}
        {menuBtn('durood', BookOpen, t(lang, 'duroodHubTitle'), t(lang, 'duroodHubSub'))}
        {menuBtn('session', Timer, t(lang, 'sessionTitle'), t(lang, 'sessionSub'))}
        {menuBtn('multi', Layers, t(lang, 'multiTitle'), t(lang, 'multiSub'))}
        {menuBtn('challenge', Trophy, t(lang, 'challengeTitle'), t(lang, 'challengeSub'))}
        {menuBtn('history', BarChart3, t(lang, 'dhikrHistoryTitle'), t(lang, 'dhikrHistorySub'))}
      </div>
      <p className="text-[11px] opacity-60 mt-4 leading-relaxed inline-flex gap-1.5"><Moon size={12} className="shrink-0 mt-0.5" /> {t(lang, 'mosqueModeHelp')}</p>
      <p className="text-[11px] opacity-60 mt-2 leading-relaxed inline-flex gap-1.5"><Target size={12} className="shrink-0 mt-0.5" /> {t(lang, 'goalsHint')}</p>
    </Shell>
  )
}
