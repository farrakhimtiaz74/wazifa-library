import React, { useMemo, useState } from 'react'
import { ArrowLeft, CalendarDays, Calculator, Check, ChevronRight, Info, Moon, Sparkles, Sun } from 'lucide-react'
import { wazifaData } from '../data/wazifaData'
import { arafahDua, eidGreetingDua, eventDetails, monthNotes, qadrDua, ramadanDuaPlan, takbeerat } from '../data/seasonsData'
import { HIJRI_MONTHS, HIJRI_YEAR_EVENTS, addDays, daysBetween, formatGreg, gregorianForHijri, hijriParts, ramadanStartFor } from '../lib/hijri'
import { todayLocal } from '../lib/db'
import { t } from '../lib/i18n'
import { Shell, pick, urduCls } from './LearnHub'

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); if (v !== null && v !== undefined) return v } catch { /* fresh */ }
  return fallback
}
function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }

function MoonNote({ lang }) {
  return <p className={`text-[11px] opacity-60 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'moonNote')}</p>
}

function DuaTextCard({ dua, lang }) {
  return (
    <div className="rounded-3xl border border-gold/30 p-5 bg-white/5">
      <p className="font-arabic text-2xl leading-loose text-center" dir="rtl">{dua.arabic}</p>
      <p className="text-sm italic opacity-90 mt-4">{dua.trans}</p>
      <p className="text-sm mt-3 leading-relaxed">{pick(dua, lang)}</p>
      {lang !== 'ur' && dua.ur && <p className="font-urdu text-base mt-3 text-right" dir="rtl">{dua.ur}</p>}
      {dua.reference && <p className="text-[11px] text-gold mt-3">{dua.reference}</p>}
    </div>
  )
}

// ---------- Seasons hub ----------
export default function SeasonsHub({ lang, onBack, onNavigate }) {
  const rows = [
    ['ramadan', Moon, 'ramadanTitle', 'ramadanSub'],
    ['qadr', Sparkles, 'qadrTitle', 'qadrSub'],
    ['ramadanduas', CalendarDays, 'ramadanDuasTitle', 'ramadanDuasSub'],
    ['zakat', Calculator, 'zakatTitle', 'zakatSub'],
    ['fidya', Info, 'fidyaTitle', 'fidyaSub'],
    ['eid', Sun, 'eidTitle', 'eidSub'],
    ['dhulhijjah', Moon, 'dhulHijjahTitle', 'dhulHijjahSub'],
    ['muharram', CalendarDays, 'muharramTitle', 'muharramSub'],
    ['islamicyear', CalendarDays, 'islamicYearTitle', 'islamicYearSub']
  ]
  const hp = hijriParts(new Date())
  return (
    <Shell title={t(lang, 'seasonsTitle')} sub={`${hp.day} ${pick(hp.monthName, lang)} ${hp.year} AH`} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {rows.map(([view, Icon, titleKey, subKey]) => (
          <button key={view} onClick={() => onNavigate(view)} className="w-full flex items-center gap-3 rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
            <Icon size={19} className="text-gold shrink-0" />
            <span className="flex-1">
              <span className={`block font-bold text-sm ${urduCls(lang)}`}>{t(lang, titleKey)}</span>
              <span className={`block text-[11px] opacity-70 ${urduCls(lang)}`}>{t(lang, subKey)}</span>
            </span>
            <ChevronRight size={15} className="opacity-50 shrink-0" />
          </button>
        ))}
      </div>
    </Shell>
  )
}

// ---------- Item 51: Ramadan dashboard ----------
const RAMADAN_GOALS = [['taraweeh', 'goalTaraweeh'], ['quran', 'goalQuranPortion'], ['sadaqah', 'goalSadaqah'], ['kahf', 'goalKahfFriday']]

export function RamadanView({ lang, onBack, onNavigate }) {
  const now = new Date()
  const hp = hijriParts(now)
  const inRamadan = hp.month === 9
  const start = useMemo(() => ramadanStartFor(now), [])
  const daysUntil = start ? daysBetween(now, start) : null
  const todayKey = todayLocal()
  const [goals, setGoals] = useState(() => loadJSON('wl-ramadan-goals', {}))
  const todayGoals = goals[todayKey] || {}
  function toggleGoal(k) {
    const next = { ...goals, [todayKey]: { ...todayGoals, [k]: !todayGoals[k] } }
    setGoals(next); saveJSON('wl-ramadan-goals', next)
  }
  const isFriday = now.getDay() === 5
  return (
    <Shell title={t(lang, 'ramadanTitle')} sub={t(lang, 'ramadanSub')} lang={lang} onBack={onBack}>
      {inRamadan ? (
        <div className="rounded-3xl border border-gold/30 p-6 bg-white/5 text-center">
          <Moon className="text-gold mx-auto" size={30} />
          <p className="font-extrabold text-2xl mt-2">{t(lang, 'ramadanDayLabel')} {hp.day}</p>
          <p className={`text-xs opacity-70 mt-1 ${urduCls(lang)}`}>{t(lang, 'ramadanBlessedNote')}</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-gold/30 p-6 bg-white/5 text-center">
          <Moon className="text-gold mx-auto" size={30} />
          {daysUntil !== null && daysUntil > 0 ? (
            <>
              <p className="font-extrabold text-4xl mt-2">{daysUntil}</p>
              <p className={`text-sm mt-1 ${urduCls(lang)}`}>{t(lang, 'daysUntilRamadan')}</p>
              {start && <p className="text-xs opacity-70 mt-2">{t(lang, 'expectedStart')}: {formatGreg(start, lang)}</p>}
            </>
          ) : (
            <p className={`text-sm mt-2 ${urduCls(lang)}`}>{t(lang, 'ramadanBlessedNote')}</p>
          )}
        </div>
      )}
      <MoonNote lang={lang} />
      <p className={`font-bold text-sm mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'todayGoalsTitle')}</p>
      <div className="space-y-2">
        {RAMADAN_GOALS.filter(([k]) => k !== 'kahf' || isFriday).map(([k, labelKey]) => {
          const on = !!todayGoals[k]
          return (
            <div key={k} className="flex items-center gap-2 rounded-2xl border border-gold/25 p-3 bg-white/5">
              <span className={`flex-1 font-bold text-sm ${urduCls(lang)}`}>{t(lang, labelKey)}</span>
              {k === 'quran' && <button onClick={() => onNavigate('quran')} className="px-2.5 py-1.5 rounded-full border border-gold/40 text-[11px] font-bold">{t(lang, 'openBtn')}</button>}
              <button onClick={() => toggleGoal(k)} aria-pressed={on} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold ${on ? 'bg-gold text-black' : 'border border-gold/40'}`}>
                <Check size={12} /> {on ? t(lang, 'doneLabel') : t(lang, 'markDone')}
              </button>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button onClick={() => onNavigate('ramadanduas')} className="py-3 rounded-2xl border border-gold/40 font-bold text-sm">{t(lang, 'ramadanDuasTitle')}</button>
        <button onClick={() => onNavigate('qadr')} className="py-3 rounded-2xl border border-gold/40 font-bold text-sm">{t(lang, 'qadrTitle')}</button>
      </div>
    </Shell>
  )
}

// ---------- Item 53: Laylatul Qadr ----------
export function QadrView({ lang, onBack }) {
  const now = new Date()
  const start = useMemo(() => ramadanStartFor(now), [])
  const oddNights = [21, 23, 25, 27, 29]
  return (
    <Shell title={t(lang, 'qadrTitle')} sub={t(lang, 'qadrSub')} lang={lang} onBack={onBack}>
      <div className="rounded-3xl border border-gold/25 p-5 bg-white/5">
        <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'qadrExplain')}</p>
      </div>
      <div className="mt-3"><DuaTextCard dua={qadrDua} lang={lang} /></div>
      <p className={`font-bold text-sm mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'qadrOddNights')}</p>
      <div className="space-y-1.5">
        {oddNights.map((n) => {
          const d = start ? addDays(start, n - 1) : null
          return (
            <div key={n} className="flex items-center justify-between rounded-xl border border-gold/15 bg-white/5 px-3 py-2.5 text-sm">
              <span className="font-bold">{t(lang, 'nightLabel')} {n}</span>
              <span className="text-xs opacity-75">{d ? formatGreg(d, lang) : '—'}</span>
            </div>
          )
        })}
      </div>
      <p className={`text-[11px] opacity-60 mt-2 ${urduCls(lang)}`}>{t(lang, 'qadrNightNote')}</p>
      <MoonNote lang={lang} />
    </Shell>
  )
}

// ---------- Item 54: Ramadan 30 duas ----------
export function RamadanDuasView({ lang, onBack, onOpenWazifa }) {
  const hp = hijriParts(new Date())
  const todayDay = hp.month === 9 ? hp.day : null
  return (
    <Shell title={t(lang, 'ramadanDuasTitle')} sub={t(lang, 'ramadanDuasSub')} lang={lang} onBack={onBack}>
      <p className={`text-[11px] opacity-70 leading-relaxed rounded-xl border border-gold/25 bg-gold/10 p-3 ${urduCls(lang)}`}>{t(lang, 'ramadanDuasHonestNote')}</p>
      <div className="space-y-2 mt-3">
        {ramadanDuaPlan.map((id, i) => {
          const w = wazifaData.find((x) => x.id === id)
          if (!w) return null
          const isToday = todayDay === i + 1
          return (
            <button key={id} onClick={() => onOpenWazifa(w)} className={`w-full flex items-center gap-3 rounded-2xl border p-3.5 text-left active:scale-[0.99] ${isToday ? 'border-gold bg-gold/10' : 'border-gold/25 bg-white/5'}`}>
              <span className="w-8 h-8 rounded-full bg-gold/20 text-gold text-xs font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="flex-1">
                <span className="block font-bold text-sm">{w.title}</span>
                <span className="font-arabic block text-base mt-0.5 line-clamp-1" dir="rtl">{w.arabic}</span>
              </span>
              {isToday && <span className="text-[10px] font-bold text-gold">{t(lang, 'todayLabel')}</span>}
            </button>
          )
        })}
      </div>
    </Shell>
  )
}

// ---------- Item 55: Zakat calculator ----------
const NISAB = { gold: 87.48, silver: 612.36 }
const NISAB_TOLA = { gold: '7.5 tola', silver: '52.5 tola' }

export function ZakatView({ lang, onBack }) {
  const [f, setF] = useState({ cash: '', bank: '', goldG: '', goldPrice: '', silverG: '', silverPrice: '', goods: '', debts: '', currency: 'PKR', nisab: 'silver' })
  const [showInfo, setShowInfo] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const num = (v) => { const n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n }
  const goldValue = num(f.goldG) * num(f.goldPrice)
  const silverValue = num(f.silverG) * num(f.silverPrice)
  const total = num(f.cash) + num(f.bank) + goldValue + silverValue + num(f.goods)
  const net = total - num(f.debts)
  const nisabPrice = f.nisab === 'gold' ? num(f.goldPrice) : num(f.silverPrice)
  const nisabValue = NISAB[f.nisab] * nisabPrice
  const hasPrice = nisabPrice > 0
  const due = hasPrice && net >= nisabValue ? net * 0.025 : 0
  const field = (labelKey, key, placeholder) => (
    <label className="block">
      <span className={`block text-xs font-bold mb-1 ${urduCls(lang)}`}>{t(lang, labelKey)}</span>
      <input value={f[key]} onChange={set(key)} inputMode="decimal" type="number" min="0" placeholder={placeholder || '0'} className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm" />
    </label>
  )
  const money = (n) => `${f.currency || 'PKR'} ${Math.round(n).toLocaleString()}`
  return (
    <Shell title={t(lang, 'zakatTitle')} sub={t(lang, 'zakatSub')} lang={lang} onBack={onBack}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {field('zakatCash', 'cash')}
          {field('zakatBank', 'bank')}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {field('zakatGoldG', 'goldG')}
          {field('zakatGoldPrice', 'goldPrice')}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {field('zakatSilverG', 'silverG')}
          {field('zakatSilverPrice', 'silverPrice')}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {field('zakatGoods', 'goods')}
          {field('zakatDebts', 'debts')}
        </div>
        <label className="block">
          <span className={`block text-xs font-bold mb-1 ${urduCls(lang)}`}>{t(lang, 'zakatCurrency')}</span>
          <input value={f.currency} onChange={set('currency')} className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm" />
        </label>
        <div>
          <span className={`block text-xs font-bold mb-1.5 ${urduCls(lang)}`}>{t(lang, 'zakatNisabChoice')}</span>
          <div className="grid grid-cols-2 gap-2">
            {['silver', 'gold'].map((k) => (
              <button key={k} onClick={() => setF({ ...f, nisab: k })} className={`py-2.5 rounded-xl border text-xs font-bold ${f.nisab === k ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>
                {t(lang, k === 'gold' ? 'nisabGold' : 'nisabSilver')} · {NISAB[k]}g ({NISAB_TOLA[k]})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gold/30 p-5 bg-white/5 mt-4">
        <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'zakatResultTitle')}</p>
        <div className="text-xs space-y-1.5 mt-2">
          <p className="flex justify-between"><span>{t(lang, 'zakatTotalAssets')}</span><b>{money(total)}</b></p>
          <p className="flex justify-between"><span>{t(lang, 'zakatMinusDebts')}</span><b>− {money(num(f.debts))}</b></p>
          <p className="flex justify-between"><span>{t(lang, 'zakatNet')}</span><b>{money(Math.max(0, net))}</b></p>
          <p className="flex justify-between"><span>{t(lang, 'zakatNisabValue')}</span><b>{hasPrice ? money(nisabValue) : '—'}</b></p>
        </div>
        {!hasPrice ? (
          <p className={`text-xs opacity-75 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'zakatNeedPrice')}</p>
        ) : due > 0 ? (
          <p className="mt-3 rounded-2xl bg-gold text-black font-extrabold text-center py-3 px-2">{t(lang, 'zakatDueLabel')}: {money(due)}</p>
        ) : (
          <p className={`text-xs opacity-80 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'zakatBelowNisab')}</p>
        )}
      </div>

      <button onClick={() => setShowInfo(!showInfo)} className="mt-3 w-full py-3 rounded-2xl border border-gold/50 text-gold font-bold text-sm inline-flex items-center justify-center gap-1">
        <Info size={14} /> {t(lang, 'zakatInfoTitle')}
      </button>
      {showInfo && (
        <div className="rounded-3xl border border-gold/25 p-5 bg-white/5 mt-3">
          <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'zakatInfoBody')}</p>
          <p className={`text-xs opacity-75 leading-relaxed mt-2 ${urduCls(lang)}`}>{t(lang, 'scholarNote')}</p>
        </div>
      )}
    </Shell>
  )
}

// ---------- Item 56: Fidya / Kaffarah ----------
const FIDYA_TEXT = {
  fidya: {
    en: 'Fidya is paid when a person cannot fast in Ramadan and cannot make the fasts up later — for example because of old age or a long-term illness (Quran 2:184). The fidya for each missed fast is to feed one poor person for a day (two meals), or give its local cost. What that costs depends on where you live and local food prices, so this app does not name a figure — ask locally.',
    ur: 'فدیہ اس وقت دیا جاتا ہے جب کوئی شخص رمضان کے روزے نہ رکھ سکتا ہو اور بعد میں قضا بھی نہ کر سکتا ہو — مثلاً بڑھاپے یا دائمی بیماری کی وجہ سے (قرآن 2:184)۔ ہر چھوٹے روزے کا فدیہ ایک مسکین کو ایک دن کا کھانا (دو وقت) کھلانا ہے، یا اس کی مقامی قیمت ادا کرنا ہے۔ یہ قیمت ہر علاقے میں مختلف ہوتی ہے، اس لیے یہ ایپ کوئی رقم نہیں بتاتی — مقامی طور پر معلوم کریں۔',
    roman: 'Fidya is waqt diya jata hai jab koi shakhs Ramadan ke roze na rakh sakta ho aur baad mein qaza bhi na kar sakta ho — misal barhape ya daimi bemari ki wajah se (Quran 2:184). Har chhoote roze ka fidya ek miskeen ko ek din ka khana (do waqt) khilana hai, ya us ki muqami qeemat ada karna hai. Ye qeemat har ilaqe mein mukhtalif hoti hai, is liye ye app koi raqam nahi batati — muqami tor par maloom karein.'
  },
  kaffarahFast: {
    en: 'Kaffarah (expiation) for deliberately breaking a Ramadan fast without a valid excuse is a serious matter with a set order in the Shariah: freeing a slave (not applicable today), then fasting two consecutive months, then feeding sixty poor people. Which applies to your case is a question for a qualified scholar — do not decide it from an app.',
    ur: 'رمضان کا روزہ بغیر شرعی عذر کے جان بوجھ کر توڑنے کا کفارہ ایک سنجیدہ مسئلہ ہے جس کی شریعت میں مقررہ ترتیب ہے: غلام آزاد کرنا (آج قابلِ عمل نہیں)، پھر دو مہینے مسلسل روزے، پھر ساٹھ مسکینوں کو کھانا کھلانا۔ آپ کے معاملے پر کیا لاگو ہوتا ہے، یہ کسی مستند عالم سے پوچھیں — ایپ سے فیصلہ نہ کریں۔',
    roman: 'Ramadan ka roza baghair sharai uzr ke jaan boojh kar todne ka kaffarah ek sanjeeda masla hai jis ki Shariat mein muqarrara tarteeb hai: ghulam azad karna (aaj qabil-e-amal nahi), phir do mahine musalsal roze, phir saath miskeenon ko khana khilana. Aap ke maamle par kya lagu hota hai, ye kisi mustanad aalim se poochein — app se faisla na karein.'
  },
  kaffarahOath: {
    en: 'For a broken oath, the Quran (5:89) gives the expiation: feeding ten poor people from the average food of your family, or clothing them, or freeing a slave; whoever cannot do that fasts three days.',
    ur: 'قسم توڑنے کا کفارہ قرآن (5:89) میں یوں بیان ہوا ہے: دس مسکینوں کو اپنے گھر کے اوسط کھانے سے کھانا کھلانا، یا انہیں کپڑے پہنانا، یا غلام آزاد کرنا؛ اور جو اس کی استطاعت نہ رکھے وہ تین دن کے روزے رکھے۔',
    roman: 'Qasam todne ka kaffarah Quran (5:89) mein yun bayan hua hai: das miskeenon ko apne ghar ke ausat khane se khana khilana, ya unhein kapre pehnana, ya ghulam azad karna; aur jo is ki istitaat na rakhe wo teen din ke roze rakhe.'
  }
}

export function FidyaView({ lang, onBack }) {
  const sections = [['fidyaTitle2', FIDYA_TEXT.fidya], ['kaffarahFastTitle', FIDYA_TEXT.kaffarahFast], ['kaffarahOathTitle', FIDYA_TEXT.kaffarahOath]]
  return (
    <Shell title={t(lang, 'fidyaTitle')} sub={t(lang, 'fidyaSub')} lang={lang} onBack={onBack}>
      <div className="space-y-3">
        {sections.map(([titleKey, body]) => (
          <div key={titleKey} className="rounded-3xl border border-gold/25 p-5 bg-white/5">
            <p className={`font-bold text-sm text-gold ${urduCls(lang)}`}>{t(lang, titleKey)}</p>
            <p className={`text-sm leading-relaxed mt-2 ${urduCls(lang)}`}>{pick(body, lang)}</p>
            {lang !== 'en' && <p className="text-xs opacity-70 leading-relaxed mt-2">{body.en}</p>}
          </div>
        ))}
      </div>
      <p className={`text-xs font-bold leading-relaxed rounded-xl border border-gold/40 bg-gold/10 p-3 mt-4 ${urduCls(lang)}`}>{t(lang, 'scholarNoteStrong')}</p>
    </Shell>
  )
}

// ---------- Item 57: Eid ----------
const EID_CHECKLIST = {
  fitr: ['eidGhusl', 'eidBestClothes', 'eidEatBefore', 'eidTakbeerRoute', 'eidFitrDone', 'eidGreet'],
  adha: ['eidGhusl', 'eidBestClothes', 'eidEatAfter', 'eidTakbeerRoute', 'eidSacrifice', 'eidGreet']
}

export function EidView({ lang, onBack }) {
  const [tab, setTab] = useState('fitr')
  const [ticks, setTicks] = useState(() => loadJSON('wl-eid-checklist', {}))
  const items = EID_CHECKLIST[tab]
  function toggle(k) {
    const id = `${tab}:${k}`
    const next = { ...ticks, [id]: !ticks[id] }
    setTicks(next); saveJSON('wl-eid-checklist', next)
  }
  return (
    <Shell title={t(lang, 'eidTitle')} sub={t(lang, 'eidSub')} lang={lang} onBack={onBack}>
      <DuaTextCard dua={takbeerat} lang={lang} />
      <div className="mt-3"><DuaTextCard dua={eidGreetingDua} lang={lang} /></div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {['fitr', 'adha'].map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`py-2.5 rounded-xl border text-xs font-bold ${tab === k ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>{t(lang, k === 'fitr' ? 'eidFitrLabel' : 'eidAdhaLabel')}</button>
        ))}
      </div>
      <div className="space-y-2 mt-3">
        {items.map((k) => {
          const on = !!ticks[`${tab}:${k}`]
          return (
            <button key={k} onClick={() => toggle(k)} aria-pressed={on} className="w-full flex items-center gap-2.5 rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${on ? 'bg-gold text-black' : 'border border-gold/40'}`}>{on && <Check size={13} />}</span>
              <span className={`flex-1 text-sm font-bold ${on ? 'line-through opacity-60' : ''} ${urduCls(lang)}`}>{t(lang, k)}</span>
            </button>
          )
        })}
      </div>
      {tab === 'fitr' && <p className={`text-[11px] opacity-70 leading-relaxed mt-3 ${urduCls(lang)}`}>{t(lang, 'eidFitrNote')}</p>}
    </Shell>
  )
}

// ---------- Item 58: Dhul Hijjah ----------
export function DhulHijjahView({ lang, onBack, onNavigate }) {
  const now = new Date()
  const hp = hijriParts(now)
  const year = hp.year // Dhul Hijjah of the current Hijri year (ahead of us unless we are in it)
  const firstDay = useMemo(() => gregorianForHijri(year, 12, 1, now, 380), [year])
  const [ticks, setTicks] = useState(() => loadJSON('wl-dh-checklist', {}))
  function toggle(dayNum) {
    const id = `${year}:${dayNum}`
    const next = { ...ticks, [id]: !ticks[id] }
    setTicks(next); saveJSON('wl-dh-checklist', next)
  }
  return (
    <Shell title={t(lang, 'dhulHijjahTitle')} sub={t(lang, 'dhulHijjahSub')} lang={lang} onBack={onBack}>
      <div className="rounded-3xl border border-gold/25 p-5 bg-white/5">
        <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'dhVirtues')}</p>
      </div>
      <p className={`font-bold text-sm mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'arafahDuaTitle')}</p>
      <DuaTextCard dua={arafahDua} lang={lang} />
      <p className={`font-bold text-sm mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'dhChecklistTitle')}</p>
      <div className="space-y-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => {
          const date = firstDay ? addDays(firstDay, d - 1) : null
          const on = !!ticks[`${year}:${d}`]
          const label = d === 9 ? t(lang, 'dhDayArafah') : d === 10 ? t(lang, 'dhDayEid') : `${t(lang, 'dayLabel')} ${d}`
          return (
            <div key={d} className="flex items-center gap-2 rounded-xl border border-gold/15 bg-white/5 px-3 py-2.5">
              <span className="flex-1 text-sm font-bold">{label}</span>
              <span className="text-[11px] opacity-70">{date ? formatGreg(date, lang) : '—'}</span>
              <button onClick={() => toggle(d)} aria-pressed={on} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold ${on ? 'bg-gold text-black' : 'border border-gold/40'}`}>
                <Check size={11} /> {on ? t(lang, 'doneLabel') : t(lang, 'markDone')}
              </button>
            </div>
          )
        })}
      </div>
      <MoonNote lang={lang} />
      <button onClick={() => onNavigate('eid')} className="mt-3 w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'eidTitle')}</button>
    </Shell>
  )
}

// ---------- Item 59: Muharram ----------
export function MuharramView({ lang, onBack, onNavigate }) {
  const now = new Date()
  const hp = hijriParts(now)
  const d9 = useMemo(() => gregorianForHijri(hp.year, 1, 9, now, 380), [hp.year])
  const d10 = useMemo(() => gregorianForHijri(hp.year, 1, 10, now, 380), [hp.year])
  const d11 = useMemo(() => gregorianForHijri(hp.year, 1, 11, now, 380), [hp.year])
  return (
    <Shell title={t(lang, 'muharramTitle')} sub={t(lang, 'muharramSub')} lang={lang} onBack={onBack}>
      <div className="rounded-3xl border border-gold/25 p-5 bg-white/5">
        <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'ashuraGuide')}</p>
      </div>
      <div className="space-y-1.5 mt-3">
        {[[9, d9], [10, d10], [11, d11]].map(([d, date]) => (
          <div key={d} className="flex items-center justify-between rounded-xl border border-gold/15 bg-white/5 px-3 py-2.5 text-sm">
            <span className="font-bold">{d} {pick(HIJRI_MONTHS[0], lang)}</span>
            <span className="text-xs opacity-75">{date ? formatGreg(date, lang) : '—'}</span>
          </div>
        ))}
      </div>
      <MoonNote lang={lang} />
      <div className="rounded-3xl border border-gold/25 p-5 bg-white/5 mt-3">
        <p className={`font-bold text-sm text-gold ${urduCls(lang)}`}>{t(lang, 'karbalaHeading')}</p>
        <p className={`text-sm leading-relaxed mt-2 ${urduCls(lang)}`}>{pick(eventDetails.evAshura, lang)}</p>
      </div>
      <button onClick={() => onNavigate('duas')} className="mt-3 w-full py-3 rounded-2xl border border-gold/50 text-gold font-bold text-sm">{t(lang, 'duaHubTitle')}</button>
    </Shell>
  )
}

// ---------- Item 60: Islamic year ----------
export function IslamicYearView({ lang, onBack }) {
  const now = new Date()
  const hp = hijriParts(now)
  const year = hp.year
  const [month, setMonth] = useState(null)
  const [event, setEvent] = useState(null)
  const eventsFor = (m) => HIJRI_YEAR_EVENTS.filter((e) => e.month === m).map((e) => ({ ...e, date: gregorianForHijri(year, e.month, e.day, now, 380) }))
  if (month !== null) {
    const evs = eventsFor(month)
    return (
      <Shell title={`${pick(HIJRI_MONTHS[month - 1], lang)} ${year} AH`} lang={lang} onBack={() => { setMonth(null); setEvent(null) }}>
        <p className={`text-sm leading-relaxed rounded-2xl border border-gold/20 p-4 bg-white/5 ${urduCls(lang)}`}>{pick(monthNotes[month - 1], lang)}</p>
        <div className="space-y-2 mt-3">
          {evs.length === 0 && <p className="text-xs opacity-70">{t(lang, 'noEventsMonth')}</p>}
          {evs.map((e) => (
            <button key={e.key} onClick={() => setEvent(event && event.key === e.key ? null : e)} className="w-full rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left">
              <span className="flex items-center justify-between gap-2">
                <span className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, e.key)}</span>
                <span className="text-[11px] opacity-75 shrink-0">{e.date ? formatGreg(e.date, lang) : '—'}</span>
              </span>
              {e.observed && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-bold">{t(lang, 'observedLabel')}</span>}
              {event && event.key === e.key && <span className={`block text-xs opacity-85 leading-relaxed mt-2 ${urduCls(lang)}`}>{pick(eventDetails[e.key], lang)}</span>}
            </button>
          ))}
        </div>
        <MoonNote lang={lang} />
      </Shell>
    )
  }
  return (
    <Shell title={t(lang, 'islamicYearTitle')} sub={`${year} AH`} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {HIJRI_MONTHS.map((m, i) => {
          const count = HIJRI_YEAR_EVENTS.filter((e) => e.month === i + 1).length
          const isCurrent = hp.month === i + 1
          return (
            <button key={m.en} onClick={() => setMonth(i + 1)} className={`w-full flex items-center gap-3 rounded-2xl border p-3.5 text-left active:scale-[0.99] ${isCurrent ? 'border-gold bg-gold/10' : 'border-gold/25 bg-white/5'}`}>
              <span className="w-8 h-8 rounded-full bg-gold/20 text-gold text-xs font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className={`flex-1 font-bold text-sm ${urduCls(lang)}`}>{pick(m, lang)}</span>
              {count > 0 && <span className="text-[10px] opacity-60">{count} {t(lang, 'eventsLabel')}</span>}
              {isCurrent && <span className="text-[10px] font-bold text-gold">{t(lang, 'todayLabel')}</span>}
              <ChevronRight size={15} className="opacity-50 shrink-0" />
            </button>
          )
        })}
      </div>
      <MoonNote lang={lang} />
    </Shell>
  )
}
