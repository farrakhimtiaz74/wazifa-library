import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Baby, CalendarClock, Check, Coins, Compass, HandCoins, Heart, MapPin, Moon, Plane, RotateCcw, ScrollText, Search, Trash2, Wallet } from 'lucide-react'
import { babyNames } from '../data/babyNames'
import { HAJJ_DAYS, JANAZA_STEPS, NIKAH_STEPS, TALBIYAH, UMRAH_STEPS } from '../data/toolsData'
import { situations } from '../data/duaPages'
import { wazifaData } from '../data/wazifaData'
import { todayLocal } from '../lib/db'
import { formatGreg, hijriParts, hijriToGregorian } from '../lib/hijri'
import { CITY_PRESETS, dateStamp, format12h, qiblaBearing } from '../lib/prayerTimes'
import { t } from '../lib/i18n'

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
const pick = (obj, lang) => (obj && (obj[lang] || obj.en)) || ''
function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); if (v !== null && v !== undefined) return v } catch { /* fresh */ }
  return fallback
}
function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const inputCls = 'rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold'

// ================= Hub =================
export default function ToolsHub({ lang = 'en', onBack, onNavigate }) {
  const btn = (target, Icon, title, sub) => (
    <button key={target} onClick={() => onNavigate(target)} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
      <Icon className="text-gold" size={18} />
      <span className={`block font-bold text-xs mt-1.5 ${urduCls(lang)}`}>{title}</span>
      <span className={`block text-[10px] opacity-60 mt-0.5 ${urduCls(lang)}`}>{sub}</span>
    </button>
  )
  return (
    <Shell title={t(lang, 'toolsTitle')} sub={t(lang, 'toolsSub')} lang={lang} onBack={onBack}>
      <div className="grid grid-cols-2 gap-2">
        {btn('converter', CalendarClock, t(lang, 'converterTitle'), t(lang, 'converterSub'))}
        {btn('babynames', Baby, t(lang, 'babyNamesTitle'), t(lang, 'babyNamesSub'))}
        {btn('travel', Plane, t(lang, 'travelTitle'), t(lang, 'travelSub'))}
        {btn('umrah', Moon, t(lang, 'umrahTitle'), t(lang, 'umrahSub'))}
        {btn('hajj', ScrollText, t(lang, 'hajjTitle'), t(lang, 'hajjSub'))}
        {btn('janaza', Heart, t(lang, 'janazaTitle'), t(lang, 'janazaSub'))}
        {btn('nikahlist', Check, t(lang, 'nikahCheckTitle'), t(lang, 'nikahCheckSub'))}
        {btn('sadaqah', HandCoins, t(lang, 'sadaqahTitle'), t(lang, 'sadaqahSub'))}
        {btn('debttracker', Wallet, t(lang, 'debtTrackerTitle'), t(lang, 'debtTrackerSub'))}
      </div>
      <div className="mt-3"><MosqueFinderButton lang={lang} wide /></div>
    </Shell>
  )
}

// ================= Item 83: Mosque finder =================
export function MosqueFinderButton({ lang = 'en', wide = false }) {
  function open() {
    const plain = 'https://www.google.com/maps/search/mosque/'
    if (!('geolocation' in navigator)) { window.open(plain, '_blank'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => { window.open(`https://www.google.com/maps/search/mosque/@${pos.coords.latitude},${pos.coords.longitude},15z`, '_blank') },
      () => { window.open(plain, '_blank') },
      { timeout: 6000 }
    )
  }
  return (
    <button onClick={open} className={`${wide ? 'w-full' : ''} rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]`}>
      <span className="flex items-center gap-2"><MapPin className="text-gold shrink-0" size={18} /><span className={`font-bold text-xs ${urduCls(lang)}`}>{t(lang, 'mosqueFinder')}</span></span>
      <span className={`block text-[10px] opacity-60 mt-1 ${urduCls(lang)}`}>{t(lang, 'mosqueFinderSub')}</span>
    </button>
  )
}

// ================= Item 76: Date converter =================
export function ConverterView({ lang = 'en', onBack }) {
  const [gDate, setGDate] = useState(todayLocal())
  const [hDay, setHDay] = useState('')
  const [hMonth, setHMonth] = useState('')
  const [hYear, setHYear] = useState('')
  const g = gDate ? new Date(`${gDate}T12:00:00`) : null
  const hp = g && !Number.isNaN(g.getTime()) ? hijriParts(g) : null
  const converted = useMemo(() => {
    const y = Number(hYear); const m = Number(hMonth); const d = Number(hDay)
    if (!y || !m || !d) return null
    return hijriToGregorian(y, m, d)
  }, [hDay, hMonth, hYear])
  const hInvalid = (hDay || hMonth || hYear) && !converted

  return (
    <Shell title={t(lang, 'converterTitle')} sub={t(lang, 'converterSub')} lang={lang} onBack={onBack}>
      <div className="rounded-3xl border border-gold/25 p-4 bg-white/5">
        <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'converterG2H')}</p>
        <input type="date" value={gDate} onChange={(e) => setGDate(e.target.value)} className={`${inputCls} w-full mt-2.5`} aria-label={t(lang, 'converterG2H')} />
        {hp && (
          <p className="mt-3 text-center">
            <span className="text-2xl font-extrabold text-gold">{hp.day} {lang === 'ur' ? hp.monthName.ur : lang === 'roman' ? hp.monthName.roman : hp.monthName.en} {hp.year}</span>
            <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'hijriSuffix')}</span>
          </p>
        )}
      </div>
      <div className="rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5">
        <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'converterH2G')}</p>
        <div className="grid grid-cols-3 gap-2 mt-2.5">
          <input type="number" min="1" max="30" value={hDay} onChange={(e) => setHDay(e.target.value)} placeholder={t(lang, 'hDayPh')} className={`${inputCls} text-center`} aria-label={t(lang, 'hDayPh')} />
          <input type="number" min="1" max="12" value={hMonth} onChange={(e) => setHMonth(e.target.value)} placeholder={t(lang, 'hMonthPh')} className={`${inputCls} text-center`} aria-label={t(lang, 'hMonthPh')} />
          <input type="number" min="1300" max="1600" value={hYear} onChange={(e) => setHYear(e.target.value)} placeholder={t(lang, 'hYearPh')} className={`${inputCls} text-center`} aria-label={t(lang, 'hYearPh')} />
        </div>
        {converted && <p className="mt-3 text-center text-lg font-extrabold text-gold">{formatGreg(converted, lang)}</p>}
        {hInvalid && <p className={`text-xs opacity-70 mt-3 text-center ${urduCls(lang)}`}>{t(lang, 'converterInvalid')}</p>}
      </div>
    </Shell>
  )
}

// ================= Item 77: Baby names =================
export function BabyNamesView({ lang = 'en', onBack }) {
  const [gender, setGender] = useState('all')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)
  const list = babyNames.filter((n) => (gender === 'all' || n.gender === gender) && (!q.trim() || n.name.toLowerCase().includes(q.trim().toLowerCase())))
  const meaning = (n) => (lang === 'ur' ? n.ur : lang === 'roman' ? n.roman : n.en)
  const chip = (id, label) => (
    <button key={id} onClick={() => setGender(id)} aria-pressed={gender === id} className={`px-4 py-2 rounded-full text-xs border ${gender === id ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30'}`}>{label}</button>
  )
  return (
    <Shell title={t(lang, 'babyNamesTitle')} sub={t(lang, 'babyNamesSub')} lang={lang} onBack={onBack}>
      <div className="flex gap-2">
        {chip('all', t(lang, 'namesAll'))}
        {chip('boy', t(lang, 'namesBoys'))}
        {chip('girl', t(lang, 'namesGirls'))}
      </div>
      <div className="relative mt-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, 'babySearchPh')} className={`${inputCls} w-full pl-9`} aria-label={t(lang, 'babySearchPh')} />
      </div>
      {selected && (
        <div className="rounded-3xl border border-gold/40 p-5 mt-3 bg-gold/5 text-center">
          <p className="font-arabic text-4xl" dir="rtl">{selected.arabic}</p>
          <p className="font-extrabold text-lg mt-2">{selected.name}</p>
          <p className={`text-sm opacity-85 mt-1 leading-relaxed ${urduCls(lang)}`}>{meaning(selected)}</p>
          <p className="text-[11px] text-gold font-bold mt-2">{selected.gender === 'boy' ? t(lang, 'namesBoys') : t(lang, 'namesGirls')}</p>
        </div>
      )}
      <div className="space-y-2 mt-3">
        {list.length === 0 && <p className="text-sm opacity-70 text-center py-6">{t(lang, 'noResults')}</p>}
        {list.map((n) => (
          <button key={n.name} onClick={() => setSelected(n)} className={`w-full rounded-2xl border p-3.5 text-left flex items-center gap-3 active:scale-[0.99] ${selected?.name === n.name ? 'border-gold bg-gold/10' : 'border-gold/20 bg-white/5'}`}>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-sm">{n.name}</span>
              <span className={`block text-[11px] opacity-70 mt-0.5 truncate ${urduCls(lang)}`}>{meaning(n)}</span>
            </span>
            <span className="font-arabic text-xl shrink-0" dir="rtl">{n.arabic}</span>
          </button>
        ))}
      </div>
      <p className="text-[11px] opacity-50 mt-3 text-center">{list.length} / {babyNames.length}</p>
    </Shell>
  )
}

// ================= Items 78 & 81: checklists =================
function ChecklistView({ lang, onBack, title, sub, steps, storeKey, sombre = false, children }) {
  const [checks, setChecks] = useState(() => loadJSON(storeKey, []))
  function toggle(i) {
    const next = checks.includes(i) ? checks.filter((x) => x !== i) : [...checks, i]
    setChecks(next); saveJSON(storeKey, next)
  }
  function reset() { setChecks([]); saveJSON(storeKey, []) }
  return (
    <Shell title={title} sub={sub} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {steps.map((s, i) => {
          const done = checks.includes(i)
          const text = s.text ? pick(s.text, lang) : pick(s, lang)
          const head = s.title ? pick(s.title, lang) : null
          return (
            <div key={i} className={`rounded-2xl border p-3.5 flex gap-3 ${done ? 'border-gold bg-gold/10' : sombre ? 'border-gold/15 bg-black/10' : 'border-gold/20 bg-white/5'}`}>
              <button onClick={() => toggle(i)} aria-pressed={done} aria-label={head || `Step ${i + 1}`} className={`w-6 h-6 rounded-lg border grid place-items-center shrink-0 mt-0.5 ${done ? 'bg-gold text-black border-gold' : 'border-gold/50 text-transparent'}`}><Check size={14} /></button>
              <div className="min-w-0">
                {head && <p className={`font-bold text-sm ${urduCls(lang)}`}>{head}</p>}
                <p className={`text-[13px] leading-relaxed ${head ? 'mt-0.5 opacity-85' : ''} ${urduCls(lang)}`}>{text}</p>
              </div>
            </div>
          )
        })}
      </div>
      {children}
      <button onClick={reset} className="mt-4 px-4 py-2 rounded-full border border-gold/40 text-xs font-bold inline-flex items-center gap-1.5"><RotateCcw size={12} /> {t(lang, 'checklistReset')}</button>
    </Shell>
  )
}

export function JanazaView({ lang = 'en', onBack, onNavigate }) {
  return (
    <ChecklistView lang={lang} onBack={onBack} title={t(lang, 'janazaTitle')} sub={t(lang, 'janazaSub')} steps={JANAZA_STEPS} storeKey="wl-janaza-checks" sombre>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button onClick={() => onNavigate('prayer')} className="py-3 rounded-2xl border border-gold/40 font-bold text-xs">{t(lang, 'janazaGuideLink')}</button>
        <button onClick={() => onNavigate('parents')} className="py-3 rounded-2xl border border-gold/40 font-bold text-xs">{t(lang, 'janazaDuasLink')}</button>
      </div>
    </ChecklistView>
  )
}

export function NikahChecklistView({ lang = 'en', onBack, onNavigate }) {
  return (
    <ChecklistView lang={lang} onBack={onBack} title={t(lang, 'nikahCheckTitle')} sub={t(lang, 'nikahCheckSub')} steps={NIKAH_STEPS} storeKey="wl-nikah-checks">
      <button onClick={() => onNavigate('nikah')} className="w-full mt-4 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'nikahDuasLink')}</button>
    </ChecklistView>
  )
}

// ================= Item 79: Umrah guide =================
export function UmrahView({ lang = 'en', onBack }) {
  return (
    <Shell title={t(lang, 'umrahTitle')} sub={t(lang, 'umrahSub')} lang={lang} onBack={onBack}>
      <div className="rounded-3xl border border-gold/30 p-5 bg-gold/5">
        <p className={`text-[11px] font-bold text-gold ${urduCls(lang)}`}>{t(lang, 'talbiyahTitle')}</p>
        <p className="font-arabic text-2xl leading-loose text-center mt-2" dir="rtl">{TALBIYAH.arabic}</p>
        <p className="text-sm italic opacity-90 mt-3">{TALBIYAH.transliteration}</p>
        <p className={`text-sm mt-2 leading-relaxed ${urduCls(lang)}`}>{lang === 'ur' ? TALBIYAH.ur : lang === 'roman' ? TALBIYAH.roman : TALBIYAH.en}</p>
      </div>
      <div className="space-y-2 mt-4">
        {UMRAH_STEPS.map((s, i) => (
          <div key={i} className="rounded-2xl border border-gold/20 p-4 bg-white/5">
            <p className={`font-bold text-sm text-gold ${urduCls(lang)}`}>{pick(s.title, lang)}</p>
            <p className={`text-[13px] leading-relaxed mt-1 opacity-90 ${urduCls(lang)}`}>{pick(s.text, lang)}</p>
          </div>
        ))}
      </div>
      <p className={`text-[11px] opacity-60 mt-4 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'guideScholarNote')}</p>
    </Shell>
  )
}

// ================= Item 80: Hajj guide =================
export function HajjView({ lang = 'en', onBack, onNavigate }) {
  return (
    <Shell title={t(lang, 'hajjTitle')} sub={t(lang, 'hajjSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {HAJJ_DAYS.map((s, i) => (
          <div key={i} className="rounded-2xl border border-gold/20 p-4 bg-white/5">
            <p className={`font-bold text-sm text-gold ${urduCls(lang)}`}>{pick(s.title, lang)}</p>
            <p className={`text-[13px] leading-relaxed mt-1 opacity-90 ${urduCls(lang)}`}>{pick(s.text, lang)}</p>
          </div>
        ))}
      </div>
      <button onClick={() => onNavigate('dhulhijjah')} className="w-full mt-4 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'hajjArafahLink')}</button>
      <p className={`text-[11px] opacity-60 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'guideScholarNote')}</p>
    </Shell>
  )
}

// ================= Item 82: Travel hub =================
function cleanTime(v) {
  const m = String(v || '').match(/(\d{1,2}):(\d{2})/)
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null
}
export function TravelView({ lang = 'en', onBack, onOpenWazifa }) {
  const [cityName, setCityName] = useState(CITY_PRESETS[12].name) // Makkah default
  const [times, setTimes] = useState(null)
  const [failed, setFailed] = useState(false)
  const city = CITY_PRESETS.find((c) => c.name === cityName) || CITY_PRESETS[0]
  const travelIds = (situations.find((s) => s.key === 'travel') || {}).ids || []
  const bearing = qiblaBearing(city.lat, city.lng)

  useEffect(() => {
    let alive = true
    setTimes(null); setFailed(false)
    ;(async () => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStamp()}?latitude=${city.lat}&longitude=${city.lng}&method=1`)
        if (!res.ok) throw new Error('http')
        const json = await res.json()
        const raw = json && json.data && json.data.timings
        if (!raw) throw new Error('shape')
        if (!alive) return
        const out = {}
        for (const k of ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) out[k] = cleanTime(raw[k])
        setTimes(out)
      } catch { if (alive) setFailed(true) }
    })()
    return () => { alive = false }
  }, [cityName])

  return (
    <Shell title={t(lang, 'travelTitle')} sub={t(lang, 'travelSub')} lang={lang} onBack={onBack}>
      <p className={`text-sm font-bold mb-2 ${urduCls(lang)}`}>{t(lang, 'sitTravel')}</p>
      <div className="space-y-2">
        {travelIds.map((id) => {
          const w = wazifaData.find((x) => x.id === id)
          if (!w) return null
          return (
            <button key={id} onClick={() => onOpenWazifa(w)} className="w-full rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <span className="block font-bold text-sm">{w.title}</span>
              <span className="font-arabic block text-lg mt-1 line-clamp-1" dir="rtl">{w.arabic}</span>
            </button>
          )
        })}
      </div>

      <p className={`text-sm font-bold mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'travelDestTitle')}</p>
      <select value={cityName} onChange={(e) => setCityName(e.target.value)} className={`${inputCls} w-full`} aria-label={t(lang, 'travelDestTitle')}>
        {CITY_PRESETS.map((c) => <option key={c.name} value={c.name} className="text-black">{c.name}{c.country ? `, ${c.country}` : ''}</option>)}
      </select>
      <p className={`text-[11px] opacity-60 mt-1.5 ${urduCls(lang)}`}>{t(lang, 'travelDestNote')}</p>
      {!times && !failed && <p className="text-xs opacity-70 mt-3">{t(lang, 'prayerLoading')}</p>}
      {failed && <p className={`text-xs opacity-70 mt-3 ${urduCls(lang)}`}>{t(lang, 'prayerLoadFail')}</p>}
      {times && (
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => (
            <div key={name} className="rounded-2xl px-1 py-2.5 text-center border border-gold/15 bg-black/10">
              <p className={`text-[10px] font-bold truncate ${urduCls(lang)}`}>{name === 'Sunrise' ? t(lang, 'sunrise') : t(lang, `prayer${name}`)}</p>
              <p className="text-xs font-extrabold mt-0.5">{format12h(times[name])}</p>
            </div>
          ))}
        </div>
      )}
      <div className="rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5 flex items-center gap-4">
        <span className="w-16 h-16 rounded-full border border-gold/40 grid place-items-center shrink-0">
          <Compass className="text-gold" size={26} style={{ transform: `rotate(${bearing}deg)` }} />
        </span>
        <div>
          <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'travelQiblaTitle').replace('{city}', city.name)}</p>
          <p className="text-xl font-extrabold text-gold mt-0.5">{Math.round(bearing)}°</p>
          <p className={`text-[11px] opacity-60 ${urduCls(lang)}`}>{t(lang, 'travelQiblaNote')}</p>
        </div>
      </div>
    </Shell>
  )
}

// ================= Item 84: Sadaqah tracker =================
const SAD_KEY = 'wl-sadaqah'
export function SadaqahView({ lang = 'en', onBack }) {
  const [entries, setEntries] = useState(() => loadJSON(SAD_KEY, []))
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [cur, setCur] = useState(() => { try { return localStorage.getItem('wl-sadaqah-cur') || 'PKR' } catch { return 'PKR' } })
  const monthPrefix = todayLocal().slice(0, 7)
  const monthTotal = entries.filter((e) => (e.date || '').startsWith(monthPrefix)).reduce((s, e) => s + (e.amount || 0), 0)
  const allTotal = entries.reduce((s, e) => s + (e.amount || 0), 0)

  function add() {
    const v = Math.max(0, Number(amount) || 0)
    if (!v) return
    const next = [{ id: `${Date.now()}`, amount: v, note: note.trim(), date: todayLocal() }, ...entries]
    setEntries(next); saveJSON(SAD_KEY, next)
    setAmount(''); setNote('')
  }
  function remove(id) {
    const next = entries.filter((e) => e.id !== id)
    setEntries(next); saveJSON(SAD_KEY, next)
  }
  function changeCur(v) { setCur(v); try { localStorage.setItem('wl-sadaqah-cur', v) } catch { /* storage */ } }

  return (
    <Shell title={t(lang, 'sadaqahTitle')} sub={t(lang, 'sadaqahSub')} lang={lang} onBack={onBack}>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-gold/20 bg-white/5 p-3 text-center"><p className="text-xl font-extrabold">{monthTotal.toLocaleString()} <span className="text-xs">{cur}</span></p><p className="text-[11px] opacity-70">{t(lang, 'sadaqahThisMonth')}</p></div>
        <div className="rounded-2xl border border-gold/20 bg-white/5 p-3 text-center"><p className="text-xl font-extrabold">{allTotal.toLocaleString()} <span className="text-xs">{cur}</span></p><p className="text-[11px] opacity-70">{t(lang, 'sadaqahAllTime')}</p></div>
      </div>
      <div className="rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5">
        <div className="flex gap-2">
          {[50, 100, 500, 1000].map((n) => (
            <button key={n} onClick={() => setAmount(String(n))} className={`px-3 py-1.5 rounded-full text-xs border ${amount === String(n) ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30'}`}>{n}</button>
          ))}
          <input value={cur} onChange={(e) => changeCur(e.target.value)} maxLength={5} className="w-16 rounded-full border border-gold/30 bg-white/5 px-2.5 py-1.5 text-xs text-center outline-none focus:border-gold ml-auto" aria-label={t(lang, 'currencyLabel')} />
        </div>
        <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t(lang, 'amountPh')} className={`${inputCls} w-full mt-3`} aria-label={t(lang, 'amountPh')} />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t(lang, 'noteOptionalPh')} className={`${inputCls} w-full mt-2 ${urduCls(lang)}`} aria-label={t(lang, 'noteOptionalPh')} />
        <button onClick={add} disabled={!(Number(amount) > 0)} className="w-full mt-3 py-3 rounded-2xl bg-gold text-black font-bold text-sm disabled:opacity-40">{t(lang, 'sadaqahAddBtn')}</button>
      </div>
      <div className="space-y-2 mt-4">
        {entries.length === 0 && <p className={`text-sm opacity-60 text-center py-4 ${urduCls(lang)}`}>{t(lang, 'sadaqahEmpty')}</p>}
        {entries.map((e) => (
          <div key={e.id} className="rounded-2xl border border-gold/20 p-3 bg-white/5 flex items-center gap-3">
            <Coins className="text-gold shrink-0" size={16} />
            <span className="flex-1 min-w-0">
              <span className="font-bold text-sm">{(e.amount || 0).toLocaleString()} {cur}</span>
              {e.note && <span className={`block text-[11px] opacity-70 truncate ${urduCls(lang)}`}>{e.note}</span>}
            </span>
            <span className="text-[11px] opacity-60">{e.date}</span>
            <button onClick={() => remove(e.id)} className="p-1.5 text-red-300" aria-label={t(lang, 'deleteBtn')}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <p className={`text-[11px] opacity-60 mt-4 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'deviceOnlyNote')}</p>
    </Shell>
  )
}

// ================= Item 85: Debt tracker =================
const DEBT_KEY = 'wl-debt'
export function DebtTrackerView({ lang = 'en', onBack, onNavigate }) {
  const [data, setData] = useState(() => loadJSON(DEBT_KEY, { total: 0, payments: [] }))
  const [totalInput, setTotalInput] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const paid = (data.payments || []).reduce((s, p) => s + (p.amount || 0), 0)
  const remaining = Math.max(0, (data.total || 0) - paid)
  const pct = data.total > 0 ? Math.min(100, Math.round((paid / data.total) * 100)) : 0

  function save(next) { setData(next); saveJSON(DEBT_KEY, next) }
  function setTotal() {
    const v = Math.max(0, Number(totalInput) || 0)
    if (!v) return
    save({ ...data, total: v })
    setTotalInput('')
  }
  function addPayment() {
    const v = Math.max(0, Number(amount) || 0)
    if (!v) return
    save({ ...data, payments: [{ id: `${Date.now()}`, amount: v, note: note.trim(), date: todayLocal() }, ...(data.payments || [])] })
    setAmount(''); setNote('')
  }
  function removePayment(id) { save({ ...data, payments: (data.payments || []).filter((p) => p.id !== id) }) }

  return (
    <Shell title={t(lang, 'debtTrackerTitle')} sub={t(lang, 'debtTrackerSub')} lang={lang} onBack={onBack}>
      {data.total > 0 ? (
        <div className="rounded-3xl border border-gold/25 p-4 bg-white/5">
          <div className="flex items-end justify-between">
            <div><p className="text-[11px] opacity-70">{t(lang, 'debtRemaining')}</p><p className="text-2xl font-extrabold text-gold">{remaining.toLocaleString()}</p></div>
            <p className="text-xs opacity-70">{t(lang, 'debtOfTotal').replace('{paid}', paid.toLocaleString()).replace('{total}', (data.total || 0).toLocaleString())}</p>
          </div>
          <div className="h-2.5 rounded-full bg-black/25 mt-3 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>
          <p className="text-[11px] opacity-70 mt-1.5">{pct}% {t(lang, 'debtPaidWord')}</p>
          {remaining === 0 && <p className="text-gold font-bold text-sm mt-2">{t(lang, 'debtClearedMsg')}</p>}
        </div>
      ) : (
        <div className="rounded-3xl border border-gold/25 p-4 bg-white/5">
          <p className={`text-sm font-bold ${urduCls(lang)}`}>{t(lang, 'debtSetTotal')}</p>
          <div className="flex gap-2 mt-2.5">
            <input type="number" min="0" value={totalInput} onChange={(e) => setTotalInput(e.target.value)} placeholder={t(lang, 'amountPh')} className={`${inputCls} flex-1`} aria-label={t(lang, 'debtSetTotal')} />
            <button onClick={setTotal} className="px-5 rounded-xl bg-gold text-black text-sm font-bold">{t(lang, 'saveBtn')}</button>
          </div>
        </div>
      )}

      {data.total > 0 && (
        <>
          <div className="rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5">
            <p className={`text-sm font-bold ${urduCls(lang)}`}>{t(lang, 'debtAddPayment')}</p>
            <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t(lang, 'amountPh')} className={`${inputCls} w-full mt-2.5`} aria-label={t(lang, 'amountPh')} />
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t(lang, 'noteOptionalPh')} className={`${inputCls} w-full mt-2 ${urduCls(lang)}`} aria-label={t(lang, 'noteOptionalPh')} />
            <button onClick={addPayment} disabled={!(Number(amount) > 0)} className="w-full mt-3 py-3 rounded-2xl bg-gold text-black font-bold text-sm disabled:opacity-40">{t(lang, 'debtAddPayment')}</button>
            <button onClick={() => { setTotalInput(String(data.total)); save({ ...data, total: 0 }) }} className="text-[11px] opacity-60 mt-2 underline">{t(lang, 'debtChangeTotal')}</button>
          </div>
          <div className="space-y-2 mt-4">
            {(data.payments || []).map((p) => (
              <div key={p.id} className="rounded-2xl border border-gold/20 p-3 bg-white/5 flex items-center gap-3">
                <Wallet className="text-gold shrink-0" size={16} />
                <span className="flex-1 min-w-0">
                  <span className="font-bold text-sm">{(p.amount || 0).toLocaleString()}</span>
                  {p.note && <span className={`block text-[11px] opacity-70 truncate ${urduCls(lang)}`}>{p.note}</span>}
                </span>
                <span className="text-[11px] opacity-60">{p.date}</span>
                <button onClick={() => removePayment(p.id)} className="p-1.5 text-red-300" aria-label={t(lang, 'deleteBtn')}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </>
      )}
      <button onClick={() => onNavigate('debtpack')} className="w-full mt-4 rounded-2xl border border-gold/25 p-4 bg-white/5 text-left active:scale-[0.99]">
        <span className={`block font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'debtPackTitle')}</span>
        <span className={`block text-[11px] opacity-70 mt-0.5 ${urduCls(lang)}`}>{t(lang, 'debtPackSub')}</span>
      </button>
      <p className={`text-[11px] opacity-60 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'deviceOnlyNote')}</p>
    </Shell>
  )
}
