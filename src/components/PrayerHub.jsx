import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Bell, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, ClipboardList, Expand, ListChecks, Minus, Plus, RefreshCw, X } from 'lucide-react'
import { t } from '../lib/i18n'
import { getSetting, setSetting, todayLocal } from '../lib/db'
import { currentPrayer, fetchPrayerTimes, format12h, loadLocation, nextPrayer } from '../lib/prayerTimes'
import { ALERT_PRAYERS, loadPrayerAlerts, savePrayerAlerts } from '../lib/quran'
import { LOG_PRAYERS, adjustQaza, getPrayerLog, getQaza, logQazaPrayed, setQaza, togglePrayer } from '../lib/prayerLog'
import { OCCASION_GUIDES, RAKAH_TABLE, SALAH_STEPS, WUDU_STEPS } from '../data/prayerGuides'
import { MosqueFinderButton } from './ToolsViews'

const urduCls = (lang) => (lang === 'ur' ? 'font-urdu' : '')
const pick = (obj, lang) => (obj && (obj[lang] || obj.en)) || ''

function toMin(hhmm) {
  if (!hhmm) return null
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
function toHHMM(mins) {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

function extraTimes(timings) {
  const sunrise = toMin(timings.Sunrise)
  const dhuhr = toMin(timings.Dhuhr)
  const maghrib = toMin(timings.Maghrib)
  const fajr = toMin(timings.Fajr)
  if (sunrise === null || dhuhr === null || maghrib === null || fajr === null) return null
  const night = fajr + 1440 - maghrib
  return {
    ishraq: toHHMM(sunrise + 15),
    duha: toHHMM(sunrise + (dhuhr - sunrise) / 2),
    tahajjud: toHHMM(fajr + 1440 - night / 3 - 1440 + 1440) // last third begins (same clock time next night)
  }
}

const GUIDE_LIST = [
  { id: 'wudu', key: 'wuduGuide' },
  { id: 'salah', key: 'salahGuide' },
  { id: 'janaza', key: 'janazaGuide' },
  { id: 'eid', key: 'eidGuide' },
  { id: 'taraweeh', key: 'taraweehGuide' }
]

export default function PrayerHub({ lang = 'en', onBack }) {
  const [page, setPage] = useState('main')
  const [guideId, setGuideId] = useState('wudu')
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [log, setLog] = useState(null)
  const [qaza, setQazaState] = useState(null)
  const [timetable, setTimetable] = useState(false)
  const loc = useMemo(() => loadLocation(), [])
  const today = todayLocal()

  useEffect(() => {
    let alive = true
    fetchPrayerTimes(loadLocation()).then((r) => {
      if (!alive) return
      if (r) { setData(r); setFailed(false) } else setFailed(true)
    })
    getPrayerLog(today).then(setLog)
    getQaza().then(setQazaState)
    return () => { alive = false }
  }, [today])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Item 14: keep the screen awake while the full-screen timetable is open
  // (same guarded navigator.wakeLock pattern as Focus Mode in the reader).
  const lockRef = useRef(null)
  useEffect(() => {
    if (!timetable) return
    let released = false
    async function acquire() {
      try {
        if (!('wakeLock' in navigator)) return
        lockRef.current = await navigator.wakeLock.request('screen')
      } catch { /* wake lock optional */ }
    }
    acquire()
    function onVis() { if (document.visibilityState === 'visible' && !released) acquire() }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      released = true
      document.removeEventListener('visibilitychange', onVis)
      if (lockRef.current) { lockRef.current.release().catch(() => {}); lockRef.current = null }
    }
  }, [timetable])

  const timings = data && data.timings
  const next = timings ? nextPrayer(timings, now) : null
  const current = timings ? currentPrayer(timings, now) : null
  const extra = timings ? extraTimes(timings) : null
  const totalOwed = qaza ? LOG_PRAYERS.reduce((s, p) => s + (qaza[p] || 0), 0) : 0

  async function onTogglePrayer(name) {
    const row = await togglePrayer(today, name)
    setLog(row)
  }

  const navBtn = (target, Icon, label) => (
    <button onClick={() => setPage(target)} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
      <Icon className="text-gold" size={18} />
      <span className={`block font-bold text-xs mt-1.5 ${urduCls(lang)}`}>{label}</span>
    </button>
  )

  // ---------- sub-pages ----------
  if (page === 'qaza') return <QazaPage lang={lang} onBack={() => setPage('main')} qaza={qaza} setQazaState={setQazaState} onOpenPlan={() => setPage('plan')} />
  if (page === 'plan') return <QazaPlanPage lang={lang} onBack={() => setPage('qaza')} qaza={qaza} />
  if (page === 'calendar') return <CalendarPage lang={lang} onBack={() => setPage('main')} loc={loc} />
  if (page === 'alerts') return <AlertsPage lang={lang} onBack={() => setPage('main')} />
  if (page === 'guides') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <button onClick={() => setPage('main')} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
        <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, 'guidesTitle')}</h2>
        <div className="space-y-2 mt-3">
          {GUIDE_LIST.map((g) => (
            <button key={g.id} onClick={() => { setGuideId(g.id); setPage('guide') }} className="w-full flex items-center gap-3 rounded-2xl border border-gold/20 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <BookOpen className="text-gold shrink-0" size={18} />
              <span className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, g.key)}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }
  if (page === 'guide') return <GuidePage lang={lang} guideId={guideId} onBack={() => setPage('guides')} />

  // ---------- main ----------
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-2 ${urduCls(lang)}`}>{t(lang, 'prayerHub')}</h2>
      <p className="text-xs opacity-70 mt-0.5">{loc.name}</p>

      {!timings && !failed && <p className="text-xs opacity-70 mt-4">{t(lang, 'prayerLoading')}</p>}
      {failed && <p className={`text-xs opacity-70 mt-4 ${urduCls(lang)}`}>{t(lang, 'prayerLoadFail')}</p>}

      {timings && (
        <>
          <div className="grid grid-cols-3 gap-1.5 mt-4">
            {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => {
              const isNext = next && next.name === name
              const isCurrent = current === name && !isNext
              return (
                <div key={name} className={`rounded-2xl px-1 py-2.5 text-center border ${isNext ? 'bg-gold text-black border-gold' : isCurrent ? 'border-gold/60 bg-gold/10' : 'border-gold/15 bg-black/10'}`}>
                  <p className={`text-[10px] font-bold truncate ${urduCls(lang)}`}>{name === 'Sunrise' ? t(lang, 'sunrise') : t(lang, `prayer${name}`)}</p>
                  <p className="text-xs font-extrabold mt-0.5">{format12h(timings[name])}</p>
                </div>
              )
            })}
          </div>

          {extra && (
            <div className="rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5">
              <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'extraTimes')}</p>
              <div className="grid grid-cols-3 gap-1.5 mt-2.5 text-center">
                <div className="rounded-2xl border border-gold/15 bg-black/10 py-2 px-1"><p className={`text-[10px] font-bold ${urduCls(lang)}`}>{t(lang, 'ishraq')}</p><p className="text-xs font-extrabold mt-0.5">{format12h(extra.ishraq)}</p></div>
                <div className="rounded-2xl border border-gold/15 bg-black/10 py-2 px-1"><p className={`text-[10px] font-bold ${urduCls(lang)}`}>{t(lang, 'duha')}</p><p className="text-xs font-extrabold mt-0.5">{format12h(extra.duha)}</p></div>
                <div className="rounded-2xl border border-gold/15 bg-black/10 py-2 px-1"><p className={`text-[10px] font-bold ${urduCls(lang)}`}>{t(lang, 'tahajjud')}</p><p className="text-xs font-extrabold mt-0.5">{format12h(extra.tahajjud)}</p></div>
              </div>
              <p className={`text-[10px] opacity-60 mt-2 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'approxNote')}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button onClick={() => setTimetable(true)} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <Expand className="text-gold" size={18} />
              <span className={`block font-bold text-xs mt-1.5 ${urduCls(lang)}`}>{t(lang, 'timetableBtn')}</span>
            </button>
            {navBtn('calendar', CalendarDays, t(lang, 'calendarTitle'))}
            {navBtn('alerts', Bell, t(lang, 'alertsTitle'))}
            {navBtn('guides', BookOpen, t(lang, 'guidesTitle'))}
            {/* Item 83 (Wave 5): mosque finder — opens Google Maps. */}
            <MosqueFinderButton lang={lang} />
          </div>
        </>
      )}

      <div className="rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5">
        <p className={`font-bold text-sm inline-flex items-center gap-1.5 ${urduCls(lang)}`}><ListChecks size={15} className="text-gold" /> {t(lang, 'prayerLogTitle')}</p>
        <p className={`text-[11px] opacity-60 mt-1 ${urduCls(lang)}`}>{t(lang, 'prayerLogHelp')}</p>
        <div className="mt-2.5 space-y-1.5">
          {LOG_PRAYERS.map((name) => {
            const done = !!(log && log.prayers[name])
            return (
              <button key={name} onClick={() => onTogglePrayer(name)} aria-pressed={done} className={`w-full flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 ${done ? 'border-gold bg-gold/10' : 'border-gold/20 bg-black/10'}`}>
                <span className={`w-6 h-6 rounded-lg border grid place-items-center shrink-0 ${done ? 'bg-gold text-black border-gold' : 'border-gold/50 text-transparent'}`}><Check size={14} /></span>
                <span className={`flex-1 text-left text-sm font-bold ${urduCls(lang)}`}>{t(lang, `prayer${name}`)}</span>
                {timings && <span className="text-xs opacity-70">{format12h(timings[name])}</span>}
                {done && <span className={`text-[10px] font-bold text-gold ${urduCls(lang)}`}>{t(lang, 'prayedWord')}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <button onClick={() => setPage('qaza')} className="w-full rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5 text-left active:scale-[0.99]">
        <span className={`font-bold text-sm inline-flex items-center gap-1.5 ${urduCls(lang)}`}><ClipboardList size={15} className="text-gold" /> {t(lang, 'qazaTitle')}</span>
        <span className="block text-[11px] opacity-70 mt-1">{totalOwed > 0 ? `${totalOwed} ${t(lang, 'owedLabel')}` : t(lang, 'noQazaLabel')}</span>
      </button>

      {timetable && timings && (
        <div className="fixed inset-0 z-50 bg-[#062C22] text-[#f5f1e6] flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold opacity-80">{loc.name}</p>
            <button onClick={() => setTimetable(false)} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-gold/50 text-xs font-bold"><X size={14} /> {t(lang, 'exitBtn')}</button>
          </div>
          <p className="text-center font-extrabold mt-8" style={{ fontSize: 64, lineHeight: 1.05 }}>
            {`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`}
            <span className="text-gold" style={{ fontSize: 28 }}>:{String(now.getSeconds()).padStart(2, '0')}</span>
          </p>
          <p className="text-center text-sm opacity-70 mt-1">{now.toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          {next && <p className="text-center mt-3 text-gold font-bold">{t(lang, 'nextPrayerLabel')}: {t(lang, `prayer${next.name}`)} · {format12h(timings[next.name])}</p>}
          <div className="grid grid-cols-2 gap-2 mt-8 max-w-md w-full mx-auto">
            {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => {
              const isNext = next && next.name === name
              return (
                <div key={name} className={`rounded-3xl border p-4 text-center ${isNext ? 'bg-gold text-black border-gold' : 'border-gold/30 bg-white/5'}`}>
                  <p className={`text-xs font-bold ${urduCls(lang)}`}>{name === 'Sunrise' ? t(lang, 'sunrise') : t(lang, `prayer${name}`)}</p>
                  <p className="text-2xl font-extrabold mt-1">{format12h(timings[name])}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Item 11: Qaza counters ----------
function QazaPage({ lang, onBack, qaza, setQazaState, onOpenPlan }) {
  if (!qaza) return <div className="max-w-2xl mx-auto px-4 py-4 pb-28"><p className="text-xs opacity-70">{t(lang, 'prayerLoading')}</p></div>
  const total = LOG_PRAYERS.reduce((s, p) => s + (qaza[p] || 0), 0)

  async function adj(name, delta) {
    const owed = await adjustQaza(name, delta)
    setQazaState((q) => ({ ...q, [name]: owed }))
  }
  async function setDirect(name, v) {
    const owed = await setQaza(name, v)
    setQazaState((q) => ({ ...q, [name]: owed }))
  }
  async function prayed(name) {
    const r = await logQazaPrayed(name)
    setQazaState((q) => ({ ...q, [name]: r.owed }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, 'qazaTitle')}</h2>
      <p className={`text-xs opacity-70 mt-1 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'qazaHelp')}</p>
      <div className="space-y-2 mt-4">
        {LOG_PRAYERS.map((name) => (
          <div key={name} className="rounded-2xl border border-gold/20 p-3.5 bg-white/5">
            <div className="flex items-center gap-2">
              <span className={`flex-1 font-bold text-sm ${urduCls(lang)}`}>{t(lang, `prayer${name}`)}</span>
              <button onClick={() => adj(name, -1)} className="w-8 h-8 rounded-lg border border-gold/40 grid place-items-center" aria-label="-1"><Minus size={14} /></button>
              <input
                value={qaza[name]} inputMode="numeric" aria-label={t(lang, `prayer${name}`)}
                onChange={(e) => setQazaState((q) => ({ ...q, [name]: e.target.value }))}
                onBlur={(e) => setDirect(name, e.target.value)}
                className="w-16 text-center rounded-lg border border-gold/25 bg-white/5 py-1.5 text-sm font-extrabold outline-none focus:border-gold"
              />
              <button onClick={() => adj(name, 1)} className="w-8 h-8 rounded-lg border border-gold/40 grid place-items-center" aria-label="+1"><Plus size={14} /></button>
              <button onClick={() => adj(name, 10)} className="h-8 px-2 rounded-lg border border-gold/40 text-[11px] font-bold" aria-label="+10">+10</button>
            </div>
            <button onClick={() => prayed(name)} disabled={!qaza[name]} className="w-full mt-2.5 py-2 rounded-xl bg-gold text-black text-[11px] font-bold disabled:opacity-40 inline-flex items-center justify-center gap-1">
              <Check size={12} /> {t(lang, 'qazaPrayedBtn')}
            </button>
          </div>
        ))}
      </div>
      <p className="text-sm font-bold mt-4">{t(lang, 'totalLabel')}: {total} {t(lang, 'owedLabel')}</p>
      {total > 0 && (
        <button onClick={onOpenPlan} className="w-full mt-3 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'qazaPlanTitle')}</button>
      )}
    </div>
  )
}

// ---------- Item 19: Qaza plan builder ----------
function QazaPlanPage({ lang, onBack, qaza }) {
  const [extra, setExtra] = useState(1)
  const [saved, setSaved] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => { getSetting('qaza_plan', null).then((p) => { if (p) { setSaved(p); setExtra(p.extraPerDay || 1) } }) }, [])

  const owed = qaza || { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 }
  const perPrayerDays = LOG_PRAYERS.map((p) => ({ p, owed: owed[p] || 0, days: extra > 0 ? Math.ceil((owed[p] || 0) / extra) : 0 }))
  const daysNeeded = Math.max(0, ...perPrayerDays.map((x) => x.days))
  const finish = new Date(); finish.setDate(finish.getDate() + daysNeeded)
  const finishStr = finish.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })

  async function save() {
    const snapshot = { ...owed }
    const plan = { extraPerDay: extra, daysNeeded, finishDate: finish.toISOString().slice(0, 10), snapshot, savedAt: new Date().toISOString() }
    await setSetting('qaza_plan', plan)
    setSaved(plan)
    setMsg(t(lang, 'planSavedMsg'))
    setTimeout(() => setMsg(''), 2500)
  }

  const prayedSince = saved ? LOG_PRAYERS.reduce((s, p) => s + Math.max(0, (saved.snapshot[p] || 0) - (owed[p] || 0)), 0) : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, 'qazaPlanTitle')}</h2>
      <p className={`text-sm font-bold mt-4 ${urduCls(lang)}`}>{t(lang, 'extraPerDayLabel')}</p>
      <div className="flex items-center gap-2 mt-2">
        <button onClick={() => setExtra(Math.max(1, extra - 1))} className="w-9 h-9 rounded-lg border border-gold/40 grid place-items-center" aria-label="-1"><Minus size={15} /></button>
        <span className="w-12 text-center text-lg font-extrabold">{extra}</span>
        <button onClick={() => setExtra(Math.min(20, extra + 1))} className="w-9 h-9 rounded-lg border border-gold/40 grid place-items-center" aria-label="+1"><Plus size={15} /></button>
      </div>
      <div className="rounded-3xl border border-gold/25 p-4 mt-4 bg-white/5 space-y-1.5">
        <p className="text-sm">{t(lang, 'daysNeededLabel')}: <b>{daysNeeded}</b></p>
        <p className="text-sm">{t(lang, 'finishByLabel')}: <b>{finishStr}</b></p>
        {perPrayerDays.filter((x) => x.owed > 0).map((x) => (
          <p key={x.p} className="text-xs opacity-75">{t(lang, `prayer${x.p}`)}: {x.owed} {t(lang, 'owedLabel')} → {x.days} {t(lang, 'dayLabel').toLowerCase()}</p>
        ))}
        {daysNeeded === 0 && <p className={`text-xs ${urduCls(lang)}`}>{t(lang, 'noQazaLabel')}</p>}
      </div>
      <button onClick={save} disabled={daysNeeded === 0} className="w-full mt-3 py-3 rounded-2xl bg-gold text-black font-bold text-sm disabled:opacity-40">{t(lang, 'savePlanBtn')}</button>
      {msg && <p className="text-xs text-gold mt-2">{msg}</p>}
      {saved && (
        <p className="text-[11px] opacity-60 mt-3">
          {t(lang, 'qazaPlanTitle')} · {saved.extraPerDay}/day · {t(lang, 'finishByLabel')}: {saved.finishDate} · {t(lang, 'prayedWord')}: {prayedSince}
        </p>
      )}
    </div>
  )
}

// ---------- Item 12: Monthly calendar ----------
function CalendarPage({ lang, onBack, loc }) {
  const nowD = new Date()
  const [cursor, setCursor] = useState({ y: nowD.getFullYear(), m: nowD.getMonth() })
  const [days, setDays] = useState(null)
  const [fail, setFail] = useState(false)
  const [openDay, setOpenDay] = useState(null)

  useEffect(() => {
    let alive = true
    setDays(null); setFail(false); setOpenDay(null)
    const ck = `wl-prayer-cal-${cursor.y}-${cursor.m + 1}-${loc.lat},${loc.lng}`
    try {
      const cached = JSON.parse(localStorage.getItem(ck))
      if (Array.isArray(cached) && cached.length) { setDays(cached); return }
    } catch { /* no cache */ }
    ;(async () => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/calendar/${cursor.y}/${cursor.m + 1}?latitude=${loc.lat}&longitude=${loc.lng}&method=1`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!json || !Array.isArray(json.data)) throw new Error('Bad calendar')
        const clean = (v) => { const m = String(v || '').match(/(\d{1,2}):(\d{2})/); return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null }
        const out = json.data.map((d) => ({
          date: d.date.gregorian.date,
          day: Number(d.date.gregorian.day),
          hijri: `${d.date.hijri.day} ${d.date.hijri.month.en} ${d.date.hijri.year} AH`,
          timings: Object.fromEntries(['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((k) => [k, clean(d.timings[k])]))
        }))
        try { localStorage.setItem(ck, JSON.stringify(out)) } catch { /* storage full */ }
        if (alive) setDays(out)
      } catch { if (alive) setFail(true) }
    })()
    return () => { alive = false }
  }, [cursor, loc])

  function shift(delta) {
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }
  const monthName = new Date(cursor.y, cursor.m, 1).toLocaleDateString('en', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, 'calendarTitle')}</h2>
      <div className="flex items-center justify-between mt-3">
        <button onClick={() => shift(-1)} className="p-2 rounded-full border border-gold/30" aria-label="Previous month"><ChevronLeft size={16} /></button>
        <p className="font-bold text-sm">{monthName} · {loc.name}</p>
        <button onClick={() => shift(1)} className="p-2 rounded-full border border-gold/30" aria-label="Next month"><ChevronRight size={16} /></button>
      </div>
      {!days && !fail && <p className="text-xs opacity-70 mt-4">{t(lang, 'prayerLoading')}</p>}
      {fail && (
        <div className="flex items-center gap-2 mt-4">
          <p className={`text-xs opacity-70 flex-1 ${urduCls(lang)}`}>{t(lang, 'calendarLoadFail')}</p>
          <button onClick={() => setCursor({ ...cursor })} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gold/40 text-[11px] font-bold shrink-0"><RefreshCw size={12} /> {t(lang, 'retry')}</button>
        </div>
      )}
      <div className="space-y-1.5 mt-3">
        {(days || []).map((d) => (
          <div key={d.date} className="rounded-2xl border border-gold/15 bg-white/5 overflow-hidden">
            <button onClick={() => setOpenDay(openDay === d.day ? null : d.day)} className="w-full flex items-center gap-2 px-3.5 py-2.5 text-left">
              <span className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 grid place-items-center text-xs font-extrabold text-gold shrink-0">{d.day}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] opacity-60 truncate">{d.hijri}</span>
                <span className="block text-[11px] opacity-80">{t(lang, 'prayerFajr')} {format12h(d.timings.Fajr)} · {t(lang, 'prayerMaghrib')} {format12h(d.timings.Maghrib)}</span>
              </span>
              {openDay === d.day ? <ChevronLeft size={15} className="rotate-90 opacity-50" /> : <ChevronRight size={15} className="opacity-50" />}
            </button>
            {openDay === d.day && (
              <div className="grid grid-cols-3 gap-1.5 px-3.5 pb-3">
                {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => (
                  <div key={name} className="rounded-xl border border-gold/15 bg-black/10 py-1.5 text-center">
                    <p className={`text-[10px] font-bold ${urduCls(lang)}`}>{name === 'Sunrise' ? t(lang, 'sunrise') : t(lang, `prayer${name}`)}</p>
                    <p className="text-[11px] font-extrabold">{format12h(d.timings[name])}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Item 13: Alert settings ----------
function AlertsPage({ lang, onBack }) {
  const [alerts, setAlerts] = useState(loadPrayerAlerts)
  function update(name, patch) {
    const next = { ...alerts, [name]: { on: false, offset: 0, ...(alerts[name] || {}), ...patch } }
    setAlerts(next)
    savePrayerAlerts(next)
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, 'alertsTitle')}</h2>
      <p className={`text-[11px] opacity-60 mt-1.5 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'alertsHelp')}</p>
      <div className="mt-3 space-y-2">
        {ALERT_PRAYERS.map((name) => {
          const a = alerts[name] || { on: false, offset: 0 }
          return (
            <div key={name} className="rounded-2xl border border-gold/20 p-3.5 bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <span className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, `prayer${name}`)}</span>
                <button onClick={() => update(name, { on: !a.on })} aria-pressed={a.on} className={`px-3 py-1.5 rounded-full border text-xs font-bold ${a.on ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>{a.on ? t(lang, 'on') : t(lang, 'off')}</button>
              </div>
              {a.on && (
                <div className="flex items-center gap-2 mt-2.5">
                  <span className={`text-[11px] opacity-70 ${urduCls(lang)}`}>{t(lang, 'alertBeforeLabel')}</span>
                  <select value={a.offset} onChange={(e) => update(name, { offset: Number(e.target.value) })} className="rounded-lg border border-gold/25 bg-white/5 px-2 py-1.5 text-xs outline-none" aria-label={t(lang, 'alertBeforeLabel')}>
                    {[0, 5, 10, 15, 30, 45, 60].map((m) => <option key={m} value={m} className="text-black">{m === 0 ? t(lang, 'alertAtTimeLabel') : `${m} min`}</option>)}
                  </select>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Items 16-18: Guide pages ----------
function GuidePage({ lang, guideId, onBack }) {
  const steps = guideId === 'wudu' ? WUDU_STEPS : guideId === 'salah' ? SALAH_STEPS : (OCCASION_GUIDES[guideId] || {}).steps || []
  const titleKey = { wudu: 'wuduGuide', salah: 'salahGuide', janaza: 'janazaGuide', eid: 'eidGuide', taraweeh: 'taraweehGuide' }[guideId]
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, titleKey)}</h2>

      {guideId === 'salah' && (
        <div className="rounded-3xl border border-gold/25 p-4 mt-4 bg-white/5 overflow-x-auto">
          <p className={`font-bold text-sm mb-2 ${urduCls(lang)}`}>{t(lang, 'rakahTableTitle')}</p>
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="opacity-70">
                <th className="py-1.5 px-1 text-left font-bold"></th>
                <th className="py-1.5 px-1 font-bold">{t(lang, 'sunnahBefore')}</th>
                <th className="py-1.5 px-1 font-bold">{t(lang, 'fardLabel')}</th>
                <th className="py-1.5 px-1 font-bold">{t(lang, 'sunnahAfter')}</th>
                <th className="py-1.5 px-1 font-bold">{t(lang, 'witrLabel')}</th>
                <th className="py-1.5 px-1 font-bold">{t(lang, 'totalLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {RAKAH_TABLE.map((r) => (
                <tr key={r.prayer} className="border-t border-gold/10">
                  <td className={`py-1.5 px-1 text-left font-bold ${urduCls(lang)}`}>{t(lang, `prayer${r.prayer}`)}</td>
                  <td className="py-1.5 px-1">{r.before || '—'}</td>
                  <td className="py-1.5 px-1 font-extrabold text-gold">{r.fard}</td>
                  <td className="py-1.5 px-1">{r.after || '—'}</td>
                  <td className="py-1.5 px-1">{r.witr || '—'}</td>
                  <td className="py-1.5 px-1 font-bold">{r.before + r.fard + r.after + r.witr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-2.5 mt-4">
        {steps.map((s, i) => (
          <div key={i} className="rounded-3xl border border-gold/20 p-4 bg-white/5">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/30 grid place-items-center text-[11px] font-extrabold text-gold shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${urduCls(lang)}`}>{pick(s.title, lang)}</p>
                <p className={`text-xs opacity-80 leading-relaxed mt-1 ${urduCls(lang)}`}>{pick(s.body, lang)}</p>
                {s.arabic && <p className="font-arabic text-right mt-3 whitespace-pre-line" dir="rtl" style={{ fontSize: 21 }}>{s.arabic}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className={`text-[11px] opacity-60 mt-4 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'scholarNote')}</p>
    </div>
  )
}
