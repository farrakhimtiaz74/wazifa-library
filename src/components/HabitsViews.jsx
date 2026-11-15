import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Award, BarChart3, CalendarDays, Check, ChevronLeft, ChevronRight, Flame, Heart, ListChecks, Moon, NotebookPen, Sparkles, Sunrise, Sunset, Trophy } from 'lucide-react'
import { wazifaData } from '../data/wazifaData'
import { presetByKey } from '../data/dhikrPresets'
import { addTaps, db, getSetting, setSetting, todayLocal } from '../lib/db'
import { getDhikrCountOn, loadChallenge, recordDhikr } from '../lib/dhikrStats'
import { getAllPrayerLogs, getPrayerLog, getQaza, isFullDay, LOG_PRAYERS, togglePrayer } from '../lib/prayerLog'
import { getKhatamPlan } from '../lib/quran'
import { hijriParts } from '../lib/hijri'
import { t } from '../lib/i18n'

export function byId(id) { return wazifaData.find((w) => w.id === id) || null }

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); if (v !== null && v !== undefined) return v } catch { /* fresh */ }
  return fallback
}
function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }

export function addDaysStr(dateStr, n) {
  const d = new Date(`${dateStr}T12:00:00`)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

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

const urduCls = (lang) => (lang === 'ur' ? 'font-urdu' : '')

// ================= Hub =================
export default function HabitsHub({ lang = 'en', onBack, onNavigate }) {
  const btn = (target, Icon, title, sub) => (
    <button key={target} onClick={() => onNavigate(target)} className="w-full rounded-2xl border border-gold/25 p-4 bg-white/5 text-left flex items-center gap-3 active:scale-[0.99]">
      <Icon className="text-gold shrink-0" size={20} />
      <span className="min-w-0">
        <span className={`block font-bold text-sm ${urduCls(lang)}`}>{title}</span>
        <span className={`block text-[11px] opacity-70 mt-0.5 ${urduCls(lang)}`}>{sub}</span>
      </span>
    </button>
  )
  return (
    <Shell title={t(lang, 'habitsTitle')} sub={t(lang, 'habitsSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {btn('morningflow', Sunrise, t(lang, 'morningFlowTitle'), t(lang, 'morningFlowSub'))}
        {btn('eveningflow', Sunset, t(lang, 'eveningFlowTitle'), t(lang, 'eveningFlowSub'))}
        {btn('routine', ListChecks, t(lang, 'weeklyBuilderTitle'), t(lang, 'weeklyBuilderSub'))}
        {btn('challenges', Trophy, t(lang, 'challengesTitle'), t(lang, 'challengesSub'))}
        {btn('gratitude', NotebookPen, t(lang, 'gratitudeTitle'), t(lang, 'gratitudeSub'))}
        {btn('sleep', Moon, t(lang, 'sleepTitle'), t(lang, 'sleepSub'))}
        {btn('fasting', CalendarDays, t(lang, 'fastingTitle'), t(lang, 'fastingSub'))}
        {btn('report', BarChart3, t(lang, 'reportTitle'), t(lang, 'reportSub'))}
        {btn('achievements', Award, t(lang, 'achievementsTitle'), t(lang, 'achievementsSub'))}
      </div>
    </Shell>
  )
}

// ================= Item 62: Challenges hub =================
export const CHALLENGE_DEFS = [
  { id: 'durood7', key: 'durood', days: 7, target: 100, nameKey: 'chDurood7' },
  { id: 'subhanallah30', key: 'subhanallah', days: 30, target: 100, nameKey: 'chSubhanallah30' },
  { id: 'alhamdulillah7', key: 'alhamdulillah', days: 7, target: 100, nameKey: 'chAlhamdulillah7' },
  { id: 'kalima7', key: 'la-ilaha-illallah', days: 7, target: 100, nameKey: 'chKalima7' }
]

export function ChallengesView({ lang = 'en', onBack, onNavigate }) {
  const [active, setActive] = useState(undefined) // undefined = loading, null = none
  const [rows, setRows] = useState([])
  const [doneList, setDoneList] = useState([])

  async function refresh(a) {
    if (!a) { setRows([]); return }
    const def = CHALLENGE_DEFS.find((d) => d.id === a.id)
    if (!def) { setRows([]); return }
    const out = []
    for (let i = 0; i < def.days; i++) {
      const date = addDaysStr(a.startDate, i)
      out.push({ date, count: await getDhikrCountOn(def.key, date) })
    }
    setRows(out)
  }

  useEffect(() => {
    ;(async () => {
      const a = await getSetting('generic_challenge', null)
      setActive(a && a.id ? a : null)
      setDoneList(await getSetting('generic_challenge_done', []))
      if (a && a.id) refresh(a)
    })()
  }, [])

  async function start(def) {
    const a = { id: def.id, startDate: todayLocal() }
    await setSetting('generic_challenge', a)
    setActive(a)
    refresh(a)
  }

  async function abandon() {
    await setSetting('generic_challenge', null)
    setActive(null)
    setRows([])
  }

  async function recordFinish(def, metDays) {
    const entry = { id: def.id, finishedAt: todayLocal(), metDays, days: def.days }
    const next = [entry, ...doneList.filter((d) => d.id !== def.id)]
    await setSetting('generic_challenge_done', next)
    await setSetting('generic_challenge', null)
    setDoneList(next)
    setActive(null)
    setRows([])
  }

  if (active === undefined) return <Shell title={t(lang, 'challengesTitle')} lang={lang} onBack={onBack}><p className="text-sm opacity-70">…</p></Shell>

  const activeDef = active ? CHALLENGE_DEFS.find((d) => d.id === active.id) : null
  const finished = activeDef ? todayLocal() > addDaysStr(active.startDate, activeDef.days - 1) : false
  const metDays = activeDef ? rows.filter((r) => r.count >= activeDef.target).length : 0
  const todayRow = rows.find((r) => r.date === todayLocal())

  return (
    <Shell title={t(lang, 'challengesTitle')} sub={t(lang, 'challengesSub')} lang={lang} onBack={onBack}>
      {/* The original Istighfar challenge lives in the Dhikr (Tasbih) hub. */}
      <button onClick={() => onNavigate('tasbih')} className="w-full rounded-2xl border border-gold/25 p-4 bg-white/5 text-left flex items-center gap-3 active:scale-[0.99]">
        <Trophy className="text-gold shrink-0" size={19} />
        <span className="min-w-0">
          <span className={`block font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'challengeTitle')}</span>
          <span className={`block text-[11px] opacity-70 mt-0.5 ${urduCls(lang)}`}>{t(lang, 'istighfarChallengeLinkSub')}</span>
        </span>
      </button>

      {activeDef ? (
        <div className="rounded-3xl border border-gold/30 p-4 mt-4 bg-gold/5">
          <p className={`font-extrabold ${urduCls(lang)}`}>{t(lang, activeDef.nameKey)}</p>
          <p className="text-[11px] opacity-70 mt-0.5">{presetByKey(activeDef.key)?.transliteration} · {activeDef.target}× / {t(lang, 'dayLabel')} · {activeDef.days} {t(lang, 'daysLabel')}</p>
          <div className="flex gap-1.5 flex-wrap mt-3">
            {rows.map((r, i) => (
              <div key={r.date} className={`w-9 rounded-xl border p-1.5 text-center ${r.date === todayLocal() ? 'border-gold bg-gold/15' : 'border-gold/20'}`} title={r.date}>
                <span className="block text-[9px] opacity-60">{i + 1}</span>
                <span className={`block text-[11px] font-extrabold ${r.count >= activeDef.target ? 'text-gold' : ''}`}>{r.count >= activeDef.target ? <Check size={12} className="mx-auto" /> : r.count}</span>
              </div>
            ))}
          </div>
          {!finished ? (
            <>
              <p className="text-sm mt-3">{t(lang, 'todayLabel')}: <b>{todayRow ? todayRow.count : 0} / {activeDef.target}</b></p>
              <button onClick={() => onNavigate('tasbih')} className="w-full mt-3 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'countInTasbih')}</button>
              <button onClick={abandon} className="w-full mt-2 py-2.5 rounded-2xl border border-red-400/50 text-red-300 text-xs font-bold">{t(lang, 'challengeAbandon')}</button>
            </>
          ) : (
            <>
              <p className="text-gold font-bold text-sm mt-3">{t(lang, 'challengeFinished').replace('{n}', metDays).replace('{total}', activeDef.days)}</p>
              <button onClick={() => recordFinish(activeDef, metDays)} className="w-full mt-3 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'challengeRecordBtn')}</button>
              <button onClick={abandon} className="w-full mt-2 py-2.5 rounded-2xl border border-gold/30 text-xs font-bold">{t(lang, 'challengeDiscard')}</button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {CHALLENGE_DEFS.map((def) => {
            const done = doneList.find((d) => d.id === def.id)
            return (
              <div key={def.id} className="rounded-2xl border border-gold/25 p-4 bg-white/5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, def.nameKey)}</p>
                  <p className="text-[11px] opacity-70 mt-0.5">{presetByKey(def.key)?.transliteration} · {def.target}× / {t(lang, 'dayLabel')} · {def.days} {t(lang, 'daysLabel')}</p>
                  {done && <p className="text-[11px] text-gold mt-1 inline-flex items-center gap-1"><Check size={11} /> {t(lang, 'challengeDoneOn').replace('{date}', done.finishedAt)} · {done.metDays}/{done.days}</p>}
                </div>
                <button onClick={() => start(def)} className="px-4 py-2 rounded-full bg-gold text-black text-xs font-bold shrink-0">{t(lang, 'challengeStart')}</button>
              </div>
            )
          })}
        </div>
      )}
      <p className="text-[11px] opacity-60 mt-4 leading-relaxed">{t(lang, 'challengeHubNote')}</p>
    </Shell>
  )
}

// ================= Item 63: Gratitude journal =================
const GRAT_KEY = 'wl-gratitude'
export function GratitudeView({ lang = 'en', onBack }) {
  const today = todayLocal()
  const [entries, setEntries] = useState(() => loadJSON(GRAT_KEY, {}))
  const [draft, setDraft] = useState(() => loadJSON(GRAT_KEY, {})[today] || '')
  const [saved, setSaved] = useState(false)
  const prompts = t(lang, 'gratitudePrompts')
  const doy = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const prompt = Array.isArray(prompts) ? prompts[doy % prompts.length] : ''
  const past = Object.keys(entries).filter((d) => d !== today && entries[d]).sort().reverse()

  function save() {
    const next = { ...entries, [today]: draft.trim() }
    if (!draft.trim()) delete next[today]
    setEntries(next)
    saveJSON(GRAT_KEY, next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Shell title={t(lang, 'gratitudeTitle')} sub={t(lang, 'gratitudeSub')} lang={lang} onBack={onBack}>
      <div className="rounded-3xl border border-gold/25 p-4 bg-white/5">
        <p className={`text-sm font-bold text-gold ${urduCls(lang)}`}>{prompt}</p>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} placeholder={t(lang, 'gratitudePlaceholder')}
          className={`w-full mt-3 rounded-2xl border border-gold/25 bg-black/10 px-3.5 py-3 text-sm outline-none focus:border-gold ${urduCls(lang)}`} />
        <button onClick={save} className="w-full mt-3 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{saved ? t(lang, 'savedLabel') : t(lang, 'saveBtn')}</button>
      </div>
      {past.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className={`text-sm font-bold ${urduCls(lang)}`}>{t(lang, 'gratitudePast')}</p>
          {past.map((d) => (
            <div key={d} className="rounded-2xl border border-gold/20 p-3.5 bg-white/5">
              <p className="text-[11px] font-bold text-gold">{d}</p>
              <p className={`text-sm mt-1 leading-relaxed ${urduCls(lang)}`}>{entries[d]}</p>
            </div>
          ))}
        </div>
      )}
    </Shell>
  )
}

// ================= Item 64: Sleep adhkar =================
const SLEEP_LINKS = ['ayat-ul-kursi', 'surah-al-ikhlas', 'surah-al-falaq', 'surah-an-nas', 'dua-before-sleep']
const SLEEP_TASBIH = [
  { key: 'subhanallah', target: 33 },
  { key: 'alhamdulillah', target: 33 },
  { key: 'allahu-akbar', target: 34 }
]
export function SleepView({ lang = 'en', onBack, onOpenWazifa }) {
  const today = todayLocal()
  const [state, setState] = useState(() => {
    const v = loadJSON('wl-sleep', null)
    return v && v.date === today ? v : { date: today, checks: [], counts: {} }
  })
  const [dim, setDim] = useState(false)

  function persist(next) { setState(next); saveJSON('wl-sleep', next) }
  function toggleCheck(id) {
    const checks = state.checks.includes(id) ? state.checks.filter((x) => x !== id) : [...state.checks, id]
    persist({ ...state, checks })
  }
  function tap(key, target) {
    const cur = state.counts[key] || 0
    if (cur >= target) return
    persist({ ...state, counts: { ...state.counts, [key]: cur + 1 } })
    if (navigator.vibrate) navigator.vibrate(12)
    recordDhikr(key, 1)
    addTaps(1)
  }

  const tasbihDone = SLEEP_TASBIH.every((s) => (state.counts[s.key] || 0) >= s.target)
  const doneUnits = state.checks.length + (tasbihDone ? 1 : 0)
  const totalUnits = SLEEP_LINKS.length + 1
  const brightness = dim ? Math.max(0.45, 1 - 0.08 * doneUnits) : 1

  return (
    <Shell title={t(lang, 'sleepTitle')} sub={t(lang, 'sleepSub')} lang={lang} onBack={onBack}>
      <div style={{ filter: `brightness(${brightness})` }} className="transition-all duration-700">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-black/25 overflow-hidden"><div className="h-full bg-gold transition-all" style={{ width: `${(doneUnits / totalUnits) * 100}%` }} /></div>
          <span className="text-xs font-bold">{doneUnits}/{totalUnits}</span>
          <button onClick={() => setDim(!dim)} aria-pressed={dim} className={`px-3 py-1.5 rounded-full border text-[11px] font-bold inline-flex items-center gap-1 ${dim ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}><Moon size={11} /> {t(lang, 'sleepDim')}</button>
        </div>

        <div className="space-y-2 mt-4">
          {SLEEP_LINKS.map((id) => {
            const w = byId(id)
            if (!w) return null
            const done = state.checks.includes(id)
            return (
              <div key={id} className={`rounded-2xl border p-3.5 flex items-center gap-3 ${done ? 'border-gold bg-gold/10' : 'border-gold/25 bg-white/5'}`}>
                <button onClick={() => toggleCheck(id)} aria-pressed={done} aria-label={w.title} className={`w-6 h-6 rounded-lg border grid place-items-center shrink-0 ${done ? 'bg-gold text-black border-gold' : 'border-gold/50 text-transparent'}`}><Check size={14} /></button>
                <button onClick={() => onOpenWazifa(w)} className="flex-1 text-left min-w-0">
                  <span className="block font-bold text-sm">{w.title}</span>
                  <span className="font-arabic block text-base mt-0.5 line-clamp-1" dir="rtl">{w.arabic}</span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5">
          <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'sleepTasbihTitle')}</p>
          <p className={`text-[11px] opacity-70 mt-0.5 ${urduCls(lang)}`}>{t(lang, 'sleepTasbihSub')}</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {SLEEP_TASBIH.map((s) => {
              const c = state.counts[s.key] || 0
              const done = c >= s.target
              return (
                <button key={s.key} onClick={() => tap(s.key, s.target)} className={`rounded-2xl border py-3 px-1 text-center active:scale-[0.98] ${done ? 'border-gold bg-gold/15' : 'border-gold/25 bg-black/10'}`}>
                  <span className="font-arabic block text-lg leading-snug" dir="rtl">{presetByKey(s.key)?.arabic}</span>
                  <span className="block text-[10px] font-bold mt-1 opacity-80">{presetByKey(s.key)?.transliteration}</span>
                  <span className="block text-base font-extrabold mt-0.5">{c} / {s.target}</span>
                </button>
              )
            })}
          </div>
        </div>
        {doneUnits === totalUnits && <p className="text-gold font-bold text-sm text-center mt-4">{t(lang, 'sleepDoneMsg')}</p>}
      </div>
    </Shell>
  )
}

// ================= Items 65 & 66: Morning / Evening flow wizards =================
function FlowWizard({ lang, onBack, kind, onNavigate, onOpenAdhkar, quote, streak }) {
  const isMorning = kind === 'morning'
  const storeKey = isMorning ? 'wl-flow-morning' : 'wl-flow-evening'
  const prayerName = isMorning ? 'Fajr' : 'Maghrib'
  const today = todayLocal()
  const [stored, setStored] = useState(() => {
    const v = loadJSON(storeKey, null)
    return v && v.date === today ? v : { date: today, step: 0, done: false }
  })
  const [prayed, setPrayed] = useState(false)
  const [plan, setPlan] = useState(null)

  useEffect(() => {
    getPrayerLog(today).then((row) => setPrayed(!!row.prayers[prayerName]))
    if (isMorning) getKhatamPlan().then(setPlan)
  }, [])

  const step = stored.step
  function go(n) {
    const next = { ...stored, step: Math.max(0, Math.min(4, n)) }
    setStored(next); saveJSON(storeKey, next)
  }
  function finish() {
    const next = { ...stored, done: true }
    setStored(next); saveJSON(storeKey, next)
    onBack()
  }
  async function togglePrayed() {
    const row = await togglePrayer(today, prayerName)
    setPrayed(!!row.prayers[prayerName])
  }

  const titles = [t(lang, `prayer${prayerName}`), isMorning ? t(lang, 'morningAdhkar') : t(lang, 'eveningAdhkar'), isMorning ? t(lang, 'flowQuranStep') : t(lang, 'flowMulkStep'), isMorning ? t(lang, 'flowDuaStep') : t(lang, 'gratitudeTitle'), t(lang, 'flowDoneStep')]

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{isMorning ? t(lang, 'morningFlowTitle') : t(lang, 'eveningFlowTitle')}</h2>
      <div className="flex gap-1.5 mt-3">
        {titles.map((x, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-gold' : 'bg-gold/20'}`} />
        ))}
      </div>
      <p className="text-[11px] font-bold text-gold mt-2">{t(lang, 'flowStepOf').replace('{x}', step + 1).replace('{n}', 5)} · <span className={urduCls(lang)}>{titles[step]}</span></p>

      <div className="rounded-3xl border border-gold/25 p-5 mt-3 bg-white/5 min-h-[220px]">
        {step === 0 && (
          <div>
            <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'flowPrayerText').replace('{prayer}', t(lang, `prayer${prayerName}`))}</p>
            <button onClick={togglePrayed} aria-pressed={prayed} className={`w-full mt-4 rounded-2xl border px-4 py-3.5 flex items-center gap-3 ${prayed ? 'border-gold bg-gold/10' : 'border-gold/25 bg-black/10'}`}>
              <span className={`w-6 h-6 rounded-lg border grid place-items-center shrink-0 ${prayed ? 'bg-gold text-black border-gold' : 'border-gold/50 text-transparent'}`}><Check size={14} /></span>
              <span className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, `prayer${prayerName}`)} — {prayed ? t(lang, 'prayedWord') : t(lang, 'flowMarkPrayed')}</span>
            </button>
            <button onClick={() => onNavigate('prayer')} className="w-full mt-2 py-2.5 rounded-2xl border border-gold/30 text-xs font-bold">{t(lang, 'openPrayerHub')}</button>
          </div>
        )}
        {step === 1 && (
          <div>
            <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'flowAdhkarText')}</p>
            <button onClick={() => onOpenAdhkar(isMorning ? 'morning' : 'evening')} className="w-full mt-4 py-3.5 rounded-2xl bg-gold text-black font-bold text-sm">{isMorning ? t(lang, 'morningAdhkar') : t(lang, 'eveningAdhkar')}</button>
          </div>
        )}
        {step === 2 && isMorning && (
          <div>
            <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'flowQuranText')}</p>
            {plan ? (
              <p className="text-sm font-bold text-gold mt-3">{t(lang, 'khatamTitle')} · {t(lang, 'dayLabel')} {Math.min(plan.dayIndex + 1, plan.targetDays)} / {plan.targetDays}</p>
            ) : (
              <p className={`text-xs opacity-70 mt-3 ${urduCls(lang)}`}>{t(lang, 'flowNoPlan')}</p>
            )}
            <button onClick={() => onNavigate('quran')} className="w-full mt-4 py-3.5 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'quran')}</button>
          </div>
        )}
        {step === 2 && !isMorning && (
          <div>
            <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'flowMulkText')}</p>
            <button onClick={() => onNavigate('quran')} className="w-full mt-4 py-3.5 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'flowOpenMulk')}</button>
          </div>
        )}
        {step === 3 && isMorning && quote && (
          <div>
            <p className={`text-[11px] font-bold text-gold ${urduCls(lang)}`}>{t(lang, 'flowDuaStep')}</p>
            <p className="font-arabic text-2xl leading-loose mt-3 text-center" dir="rtl">{quote.arabic}</p>
            <p className="text-sm mt-3 leading-relaxed">{lang === 'ur' ? quote.urdu : quote.english}</p>
            <p className="text-[11px] text-gold mt-2">{quote.reference}</p>
          </div>
        )}
        {step === 3 && !isMorning && (
          <div>
            <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'flowGratitudeText')}</p>
            <button onClick={() => onNavigate('gratitude')} className="w-full mt-4 py-3.5 rounded-2xl bg-gold text-black font-bold text-sm inline-flex items-center justify-center gap-2"><NotebookPen size={15} /> {t(lang, 'gratitudeTitle')}</button>
          </div>
        )}
        {step === 4 && (
          <div className="text-center py-4">
            <Sparkles className="mx-auto text-gold" size={30} />
            <p className={`font-extrabold text-lg mt-3 ${urduCls(lang)}`}>{t(lang, 'flowDoneTitle')}</p>
            <p className={`text-sm opacity-80 mt-1.5 ${urduCls(lang)}`}>{t(lang, 'flowDoneStreak').replace('{n}', streak)}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        {step > 0 && <button onClick={() => go(step - 1)} className="px-5 py-3 rounded-2xl border border-gold/40 text-sm font-bold">{t(lang, 'back')}</button>}
        {step < 4 ? (
          <button onClick={() => go(step + 1)} className="flex-1 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'obNext')}</button>
        ) : (
          <button onClick={finish} className="flex-1 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'flowFinishBtn')}</button>
        )}
      </div>
    </div>
  )
}

export function MorningFlowView(props) { return <FlowWizard kind="morning" {...props} /> }
export function EveningFlowView(props) { return <FlowWizard kind="evening" {...props} /> }

// ================= Item 67: Monthly report =================
export function ReportView({ lang = 'en', onBack }) {
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [data, setData] = useState(null)

  useEffect(() => {
    ;(async () => {
      const [history, dhikr, prayers] = await Promise.all([db.history.toArray(), db.dhikrLog.toArray(), db.prayerLog.toArray()])
      setData({ history, dhikr, prayers })
    })()
  }, [])

  const prefix = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}`
  const stats = useMemo(() => {
    if (!data) return null
    const h = data.history.filter((r) => r.date.startsWith(prefix))
    const d = data.dhikr.filter((r) => r.date.startsWith(prefix))
    const p = data.prayers.filter((r) => r.date.startsWith(prefix))
    const perKey = {}
    let dhikrTotal = 0
    for (const r of d) { perKey[r.key] = (perKey[r.key] || 0) + r.count; dhikrTotal += r.count }
    const top = Object.entries(perKey).sort((a, b) => b[1] - a[1]).slice(0, 3)
    const quiz = loadJSON('wl-quiz-history', []).filter((q) => (q.date || '').startsWith(prefix))
    return {
      routineCompletions: h.reduce((s, r) => s + (r.completedCount || 0), 0),
      fullRoutineDays: h.filter((r) => r.allComplete).length,
      taps: h.reduce((s, r) => s + (r.totalTaps || 0), 0),
      dhikrTotal,
      top,
      fullPrayerDays: p.filter(isFullDay).length,
      prayerLoggedDays: p.length,
      quizSessions: quiz.length,
      quizBest: quiz.reduce((s, q) => Math.max(s, q.score || 0), 0)
    }
  }, [data, prefix])

  const monthName = new Date(cursor.y, cursor.m, 1).toLocaleDateString('en', { month: 'long', year: 'numeric' })
  function shift(delta) { setCursor((c) => { const d = new Date(c.y, c.m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() } }) }
  const card = 'rounded-2xl border border-gold/20 bg-white/5 p-3 text-center'
  const maxTop = stats && stats.top.length ? stats.top[0][1] : 1

  return (
    <Shell title={t(lang, 'reportTitle')} sub={t(lang, 'reportSub')} lang={lang} onBack={onBack}>
      <div className="flex items-center justify-between">
        <button onClick={() => shift(-1)} className="p-2 rounded-full border border-gold/30" aria-label="Previous month"><ChevronLeft size={16} /></button>
        <p className="font-bold text-sm">{monthName}</p>
        <button onClick={() => shift(1)} className="p-2 rounded-full border border-gold/30" aria-label="Next month"><ChevronRight size={16} /></button>
      </div>
      {!stats ? <p className="text-sm opacity-70 mt-4">…</p> : (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className={card}><p className="text-xl font-extrabold">{stats.routineCompletions}</p><p className="text-[11px] opacity-70 mt-0.5">{t(lang, 'reportRoutine')}</p></div>
            <div className={card}><p className="text-xl font-extrabold">{stats.fullRoutineDays}</p><p className="text-[11px] opacity-70 mt-0.5">{t(lang, 'reportFullRoutineDays')}</p></div>
            <div className={card}><p className="text-xl font-extrabold">{stats.dhikrTotal.toLocaleString()}</p><p className="text-[11px] opacity-70 mt-0.5">{t(lang, 'reportDhikrTotal')}</p></div>
            <div className={card}><p className="text-xl font-extrabold">{stats.taps.toLocaleString()}</p><p className="text-[11px] opacity-70 mt-0.5">{t(lang, 'totalDhikr')}</p></div>
            <div className={card}><p className="text-xl font-extrabold">{stats.fullPrayerDays}</p><p className="text-[11px] opacity-70 mt-0.5">{t(lang, 'fullDaysLabel')}</p></div>
            <div className={card}><p className="text-xl font-extrabold">{stats.quizSessions ? `${stats.quizBest}` : '—'}</p><p className="text-[11px] opacity-70 mt-0.5">{t(lang, 'reportQuizBest').replace('{n}', stats.quizSessions)}</p></div>
          </div>
          <p className={`text-sm font-bold mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'reportTopDhikr')}</p>
          {stats.top.length === 0 ? <p className="text-xs opacity-60">{t(lang, 'reportNoData')}</p> : (
            <div className="space-y-2">
              {stats.top.map(([key, count]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs"><span className="font-bold">{presetByKey(key)?.transliteration || (key === 'durood' ? 'Durood' : key)}</span><span>{count.toLocaleString()}</span></div>
                  <div className="h-2 rounded-full bg-black/25 mt-1 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${(count / maxTop) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Shell>
  )
}

// ================= Item 68: Achievements =================
export function AchievementsView({ lang = 'en', onBack }) {
  const [result, setResult] = useState(null)

  useEffect(() => {
    ;(async () => {
      const [streak, totalTaps, logs, qaza, plan, namesLearnedRaw, istighfar, genDone, khatam] = await Promise.all([
        getSetting('daily_streak', 0),
        getSetting('total_taps', 0),
        getAllPrayerLogs(),
        getQaza(),
        getSetting('qaza_plan', null),
        Promise.resolve(loadJSON('wl-names-learned', [])),
        loadChallenge(),
        getSetting('generic_challenge_done', []),
        getKhatamPlan()
      ])
      const hist = await db.history.toArray()
      const fullDays = hist.filter((h) => h.allComplete).map((h) => h.date).sort()
      let longest = 0; let run = 0; let prev = null
      for (const d of fullDays) {
        if (prev) { const diff = (new Date(`${d}T12:00:00`) - new Date(`${prev}T12:00:00`)) / 86400000; run = diff === 1 ? run + 1 : 1 } else run = 1
        longest = Math.max(longest, run); prev = d
      }
      const bestStreak = Math.max(streak || 0, longest)
      const fullPrayerDays = logs.filter(isFullDay).length
      const snapshotTotal = plan && plan.snapshot ? Object.values(plan.snapshot).reduce((s, v) => s + (Number(v) || 0), 0) : 0
      const owedTotal = LOG_PRAYERS.reduce((s, p) => s + (qaza[p] || 0), 0)
      const quizHist = loadJSON('wl-quiz-history', [])
      const istighfarDone = !!(istighfar && istighfar.startDate && todayLocal() > addDaysStr(istighfar.startDate, (istighfar.days || 7) - 1))
      const checks = {
        streak7: bestStreak >= 7,
        streak30: bestStreak >= 30,
        taps1000: (totalTaps || 0) >= 1000,
        taps10000: (totalTaps || 0) >= 10000,
        taps100000: (totalTaps || 0) >= 100000,
        prayer1: fullPrayerDays >= 1,
        prayer7: fullPrayerDays >= 7,
        qazaClear: !!plan && snapshotTotal > 0 && owedTotal === 0,
        names25: (namesLearnedRaw || []).length >= 25,
        names50: (namesLearnedRaw || []).length >= 50,
        names99: (namesLearnedRaw || []).length >= 99,
        quizPerfect: quizHist.some((h) => h.total > 0 && h.score === h.total),
        challengeDone: istighfarDone || (genDone || []).length > 0,
        khatamWeek: !!khatam && (khatam.dayIndex || 0) >= 7
      }
      const earned = loadJSON('wl-badges-earned', {})
      let changed = false
      for (const [id, ok] of Object.entries(checks)) {
        if (ok && !earned[id]) { earned[id] = todayLocal(); changed = true }
      }
      if (changed) saveJSON('wl-badges-earned', earned)
      setResult({ checks, earned })
    })()
  }, [])

  const BADGES = [
    { id: 'streak7', Icon: Flame }, { id: 'streak30', Icon: Flame },
    { id: 'taps1000', Icon: Heart }, { id: 'taps10000', Icon: Heart }, { id: 'taps100000', Icon: Heart },
    { id: 'prayer1', Icon: Check }, { id: 'prayer7', Icon: Check },
    { id: 'qazaClear', Icon: Sparkles },
    { id: 'names25', Icon: Award }, { id: 'names50', Icon: Award }, { id: 'names99', Icon: Award },
    { id: 'quizPerfect', Icon: Trophy }, { id: 'challengeDone', Icon: Trophy }, { id: 'khatamWeek', Icon: CalendarDays }
  ]

  return (
    <Shell title={t(lang, 'achievementsTitle')} sub={t(lang, 'achievementsSub')} lang={lang} onBack={onBack}>
      {!result ? <p className="text-sm opacity-70">…</p> : (
        <div className="grid grid-cols-2 gap-2">
          {BADGES.map(({ id, Icon }) => {
            const ok = !!result.checks[id]
            return (
              <div key={id} className={`rounded-2xl border p-3.5 ${ok ? 'border-gold bg-gold/10' : 'border-gold/15 bg-white/5 opacity-60'}`}>
                <Icon className={ok ? 'text-gold' : 'opacity-50'} size={20} />
                <p className={`font-bold text-[13px] mt-1.5 ${urduCls(lang)}`}>{t(lang, `badge_${id}`)}</p>
                <p className={`text-[11px] opacity-70 mt-0.5 leading-relaxed ${urduCls(lang)}`}>{t(lang, `badgeReq_${id}`)}</p>
                {ok && result.earned[id] && <p className="text-[10px] text-gold font-bold mt-1.5">{t(lang, 'badgeEarnedOn').replace('{date}', result.earned[id])}</p>}
              </div>
            )
          })}
        </div>
      )}
    </Shell>
  )
}

// ================= Item 70: Fasting tracker =================
const FAST_KEY = 'wl-fasts'
export function FastingView({ lang = 'en', onBack }) {
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [fasts, setFasts] = useState(() => loadJSON(FAST_KEY, []))
  const today = todayLocal()

  function toggle(dateStr) {
    const next = fasts.includes(dateStr) ? fasts.filter((d) => d !== dateStr) : [...fasts, dateStr]
    setFasts(next)
    saveJSON(FAST_KEY, next)
  }
  function shift(delta) { setCursor((c) => { const d = new Date(c.y, c.m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() } }) }

  const firstDay = new Date(cursor.y, cursor.m, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  const monthName = firstDay.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  const prefix = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}`
  const monthCount = fasts.filter((d) => d.startsWith(prefix)).length

  return (
    <Shell title={t(lang, 'fastingTitle')} sub={t(lang, 'fastingSub')} lang={lang} onBack={onBack}>
      <button onClick={() => toggle(today)} aria-pressed={fasts.includes(today)} className={`w-full py-3 rounded-2xl font-bold text-sm ${fasts.includes(today) ? 'bg-gold/20 border border-gold text-gold' : 'bg-gold text-black'}`}>
        {fasts.includes(today) ? t(lang, 'fastedTodayDone') : t(lang, 'fastedTodayBtn')}
      </button>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="rounded-2xl border border-gold/20 bg-white/5 p-3 text-center"><p className="text-xl font-extrabold">{monthCount}</p><p className="text-[11px] opacity-70">{t(lang, 'fastingThisMonth')}</p></div>
        <div className="rounded-2xl border border-gold/20 bg-white/5 p-3 text-center"><p className="text-xl font-extrabold">{fasts.length}</p><p className="text-[11px] opacity-70">{t(lang, 'fastingTotal')}</p></div>
      </div>
      <div className="rounded-3xl border border-gold/25 p-4 mt-4 bg-white/5">
        <div className="flex items-center justify-between">
          <button onClick={() => shift(-1)} className="p-2 rounded-full border border-gold/30" aria-label="Previous month"><ChevronLeft size={16} /></button>
          <p className="font-bold text-sm">{monthName}</p>
          <button onClick={() => shift(1)} className="p-2 rounded-full border border-gold/30" aria-label="Next month"><ChevronRight size={16} /></button>
        </div>
        <div className={`grid grid-cols-7 gap-1 mt-3 text-center text-[10px] opacity-60 font-bold ${urduCls(lang)}`}>
          {(t(lang, 'weekdays') || []).map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {cells.map((d, i) => {
            if (!d) return <span key={`e-${i}`} />
            const date = new Date(cursor.y, cursor.m, d)
            const key = `${prefix}-${String(d).padStart(2, '0')}`
            const hijriDay = hijriParts(date).day
            const isWhite = hijriDay >= 13 && hijriDay <= 15
            const isMonThu = date.getDay() === 1 || date.getDay() === 4
            const fasted = fasts.includes(key)
            return (
              <button key={key} onClick={() => toggle(key)} aria-pressed={fasted} title={`${key} · ${hijriDay} ${hijriParts(date).monthName.en}`}
                className={`relative aspect-square rounded-lg text-xs flex flex-col items-center justify-center ${fasted ? 'bg-gold text-black font-extrabold' : isMonThu ? 'border border-gold/40' : 'opacity-80'}`}>
                <span>{d}</span>
                <span className={`text-[8px] leading-none ${fasted ? 'opacity-70' : 'opacity-50'}`}>{hijriDay}</span>
                {isWhite && <span className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${fasted ? 'bg-black/60' : 'bg-gold'}`} />}
              </button>
            )
          })}
        </div>
        <p className={`text-[11px] opacity-60 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'fastingLegend')}</p>
      </div>
    </Shell>
  )
}
