import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookHeart, Check, ChevronRight, Heart, NotebookPen, ScrollText, Smile, Sparkles, Trash2 } from 'lucide-react'
import { wazifaData } from '../data/wazifaData'
import { dailyQuotes } from '../data/dailyQuotes'
import { childrenProtectionDua, deceasedDua, hannahDua, hisnulChapters, moodMap, situations, spouseHarmonyDua, weddingDua } from '../data/duaPages'
import { db, todayLocal } from '../lib/db'
import { dateOffset } from '../lib/dhikrStats'
import { t } from '../lib/i18n'

export function byId(id) { return wazifaData.find((w) => w.id === id) || null }

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

export function DuaCardRow({ w, lang, onOpen }) {
  if (!w) return null
  return (
    <button onClick={() => onOpen(w)} className="w-full rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
      <span className="block font-bold text-sm">{w.title}</span>
      <span className="font-arabic block text-lg mt-1 line-clamp-2" dir="rtl">{w.arabic}</span>
      <span className="block text-[11px] opacity-60 mt-1">{w.reference}</span>
    </button>
  )
}

export function StaticDuaCard({ dua, lang }) {
  return (
    <div className="rounded-3xl border border-gold/25 p-5 bg-white/5">
      <p className="font-arabic text-2xl leading-loose text-center" dir="rtl">{dua.arabic}</p>
      {dua.transliteration && <p className="text-sm italic opacity-90 mt-4">{dua.transliteration}</p>}
      {dua.english && <p className="text-sm mt-3 leading-relaxed">{dua.english}</p>}
      {dua.urdu && <p className="font-urdu text-base mt-3 text-right" dir="rtl">{dua.urdu}</p>}
      {dua.reference && <p className="text-[11px] text-gold mt-3">{t(lang, 'referenceLabel')}: {dua.reference}</p>}
    </div>
  )
}

function DuaList({ ids, lang, onOpen }) {
  return (
    <div className="space-y-2">
      {ids.map((id) => <DuaCardRow key={id} w={byId(id)} lang={lang} onOpen={onOpen} />)}
    </div>
  )
}

// ---------- Item 32: Hisnul Muslim ----------
export function HisnulView({ lang, onBack, onOpenWazifa, onOpenAdhkar }) {
  const [chapter, setChapter] = useState(null)
  if (chapter) {
    return (
      <Shell title={t(lang, chapter.labelKey)} lang={lang} onBack={() => setChapter(null)}>
        <DuaList ids={chapter.ids || []} lang={lang} onOpen={onOpenWazifa} />
      </Shell>
    )
  }
  return (
    <Shell title={t(lang, 'hisnulTitle')} sub={t(lang, 'hisnulSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {hisnulChapters.map((c) => (
          <button key={c.key} onClick={() => (c.adhkar ? onOpenAdhkar(c.adhkar) : setChapter(c))} className="w-full rounded-2xl border border-gold/25 p-4 bg-white/5 text-left flex items-center gap-3 active:scale-[0.99]">
            <BookHeart className="text-gold shrink-0" size={19} />
            <span className={`flex-1 font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, c.labelKey)}</span>
            <span className="text-[11px] opacity-60">{c.adhkar ? t(lang, 'guidedLabel') : `${(c.ids || []).length}`}</span>
            <ChevronRight size={15} className="opacity-50" />
          </button>
        ))}
      </div>
    </Shell>
  )
}

// ---------- Item 33: Dua journal ----------
export function DuaJournalView({ lang, onBack }) {
  const [entries, setEntries] = useState([])
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  async function refresh() { setEntries(await db.duaJournal.orderBy('created_at').reverse().toArray()) }
  useEffect(() => { refresh() }, [])

  async function add() {
    if (!title.trim() && !text.trim()) return
    await db.duaJournal.add({ id: `dj-${Date.now()}`, title: title.trim(), text: text.trim(), answered: false, date: todayLocal(), created_at: new Date().toISOString() })
    setTitle(''); setText('')
    refresh()
  }

  async function toggle(e) { await db.duaJournal.put({ ...e, answered: !e.answered }); refresh() }
  async function remove(e) { await db.duaJournal.delete(e.id); refresh() }

  return (
    <Shell title={t(lang, 'journalTitle')} sub={t(lang, 'journalSub')} lang={lang} onBack={onBack}>
      <div className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 space-y-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t(lang, 'journalTitlePh')} className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder={t(lang, 'journalTextPh')} className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold" />
        <button onClick={add} disabled={!title.trim() && !text.trim()} className="w-full py-2.5 rounded-xl bg-gold text-black text-xs font-bold disabled:opacity-40">{t(lang, 'journalAddBtn')}</button>
      </div>
      <div className="space-y-2 mt-4">
        {entries.length === 0 && <p className="text-sm opacity-60 text-center py-4">{t(lang, 'journalEmpty')}</p>}
        {entries.map((e) => (
          <div key={e.id} className={`rounded-2xl border p-3.5 bg-white/5 ${e.answered ? 'border-gold/60' : 'border-gold/20'}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-sm">{e.title || '🤲'}</p>
              <span className="text-[10px] opacity-50 shrink-0">{e.date}</span>
            </div>
            {e.text && <p className="text-sm opacity-85 mt-1 leading-relaxed whitespace-pre-wrap">{e.text}</p>}
            <div className="flex gap-2 mt-2.5">
              <button onClick={() => toggle(e)} aria-pressed={!!e.answered} className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${e.answered ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}><Check size={11} /> {e.answered ? t(lang, 'journalAnswered') : t(lang, 'journalMarkAnswered')}</button>
              <button onClick={() => remove(e)} className="px-2.5 py-1 rounded-full border border-red-400/50 text-red-300 text-[11px] font-bold inline-flex items-center gap-1"><Trash2 size={11} /> {t(lang, 'deleteBtn')}</button>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  )
}

// ---------- Item 34: Parents & deceased ----------
export function ParentsView({ lang, onBack, onOpenWazifa, onOpenAdhkar }) {
  const [name, setName] = useState('')
  return (
    <Shell title={t(lang, 'parentsTitle')} sub={t(lang, 'parentsSub')} lang={lang} onBack={onBack}>
      <p className="text-sm font-bold mb-2">{t(lang, 'parentsDuaHeading')}</p>
      <DuaList ids={['dua-for-parents']} lang={lang} onOpen={onOpenWazifa} />
      <button onClick={() => onOpenAdhkar('rabbana')} className="w-full mt-3 rounded-2xl border border-gold/25 p-4 bg-white/5 text-left active:scale-[0.99]">
        <span className={`block font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'parentsRabbanaLink')}</span>
        <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'parentsRabbanaSub')}</span>
      </button>
      <p className="text-sm font-bold mt-6 mb-2">{t(lang, 'deceasedHeading')}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t(lang, 'deceasedNamePh')} className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold mb-3" />
      {name.trim() && <p className="text-xs opacity-80 mb-3">{t(lang, 'deceasedForLabel')} <b className="text-gold">{name.trim()}</b> — {t(lang, 'deceasedNameNote')}</p>}
      <StaticDuaCard dua={deceasedDua} lang={lang} />
    </Shell>
  )
}

// ---------- Item 35: Exam & job pack ----------
const EXAM_CHECKS = ['checkRevision', 'checkSleep', 'checkDua', 'checkTawakkul']
export function ExamPackView({ lang, onBack, onOpenWazifa }) {
  const key = `wl-exam-checklist-${todayLocal()}`
  const [checks, setChecks] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) || {} } catch { return {} } })
  function toggle(k) {
    const next = { ...checks, [k]: !checks[k] }
    setChecks(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* storage */ }
  }
  const examIds = situations.find((s) => s.key === 'exams').ids
  const jobIds = situations.find((s) => s.key === 'job').ids
  return (
    <Shell title={t(lang, 'examPackTitle')} sub={t(lang, 'examPackSub')} lang={lang} onBack={onBack}>
      <p className="text-sm font-bold mb-2">{t(lang, 'examChecklistTitle')}</p>
      <div className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 space-y-1">
        {EXAM_CHECKS.map((k) => (
          <button key={k} onClick={() => toggle(k)} aria-pressed={!!checks[k]} className="w-full flex items-center gap-2.5 py-2 text-left">
            <span className={`w-5 h-5 rounded-md border grid place-items-center shrink-0 ${checks[k] ? 'bg-gold text-black border-gold' : 'border-gold/50 text-transparent'}`}><Check size={13} /></span>
            <span className={`text-sm ${checks[k] ? 'line-through opacity-60' : ''} ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, k)}</span>
          </button>
        ))}
      </div>
      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'sitExams')}</p>
      <DuaList ids={examIds} lang={lang} onOpen={onOpenWazifa} />
      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'sitJob')}</p>
      <DuaList ids={jobIds} lang={lang} onOpen={onOpenWazifa} />
    </Shell>
  )
}

// ---------- Item 36: Debt pack ----------
export function DebtPackView({ lang, onBack, onOpenWazifa }) {
  const [ticks, setTicks] = useState(() => { try { return JSON.parse(localStorage.getItem('wl-debt-read-days')) || [] } catch { return [] } })
  const today = todayLocal()
  const readToday = ticks.includes(today)
  const weekCount = useMemo(() => {
    const days = new Set()
    for (let i = 0; i < 7; i++) days.add(dateOffset(i))
    return ticks.filter((d) => days.has(d)).length
  }, [ticks])
  function toggleToday() {
    const next = readToday ? ticks.filter((d) => d !== today) : [...ticks, today]
    setTicks(next)
    try { localStorage.setItem('wl-debt-read-days', JSON.stringify(next.slice(-90))) } catch { /* storage */ }
  }
  const debtIds = situations.find((s) => s.key === 'debt').ids
  return (
    <Shell title={t(lang, 'debtPackTitle')} sub={t(lang, 'debtPackSub')} lang={lang} onBack={onBack}>
      <button onClick={toggleToday} aria-pressed={readToday} className={`w-full rounded-2xl border p-4 text-left flex items-center gap-3 ${readToday ? 'border-gold bg-gold/15' : 'border-gold/25 bg-white/5'}`}>
        <span className={`w-6 h-6 rounded-lg border grid place-items-center shrink-0 ${readToday ? 'bg-gold text-black border-gold' : 'border-gold/50 text-transparent'}`}><Check size={15} /></span>
        <span className="flex-1">
          <span className={`block font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'debtMarkToday')}</span>
          <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'debtWeekLabel').replace('{n}', weekCount)}</span>
        </span>
      </button>
      <div className="mt-4"><DuaList ids={debtIds} lang={lang} onOpen={onOpenWazifa} /></div>
    </Shell>
  )
}

// ---------- Item 37: Pregnancy & children ----------
export function PregnancyView({ lang, onBack, onOpenWazifa, onOpenAdhkar }) {
  return (
    <Shell title={t(lang, 'pregnancyTitle')} sub={t(lang, 'pregnancySub')} lang={lang} onBack={onBack}>
      <p className="text-sm font-bold mb-2">{t(lang, 'hannahHeading')}</p>
      <StaticDuaCard dua={hannahDua} lang={lang} />
      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'offspringHeading')}</p>
      <DuaList ids={['rabbi-la-tadharni-farda']} lang={lang} onOpen={onOpenWazifa} />
      <button onClick={() => onOpenAdhkar('rabbana')} className="w-full mt-3 rounded-2xl border border-gold/25 p-4 bg-white/5 text-left active:scale-[0.99]">
        <span className={`block font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'offspringRabbanaLink')}</span>
        <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'offspringRabbanaSub')}</span>
      </button>
      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'childrenProtectionHeading')}</p>
      <StaticDuaCard dua={childrenProtectionDua} lang={lang} />
      <div className="mt-3"><DuaList ids={['audhu-bikalimatillahit-tammah']} lang={lang} onOpen={onOpenWazifa} /></div>
    </Shell>
  )
}

// ---------- Item 38: Nikah & spouse ----------
export function NikahView({ lang, onBack, onOpenWazifa, onOpenAdhkar }) {
  return (
    <Shell title={t(lang, 'nikahTitle')} sub={t(lang, 'nikahSub')} lang={lang} onBack={onBack}>
      <p className="text-sm font-bold mb-2">{t(lang, 'spouseHarmonyHeading')}</p>
      <StaticDuaCard dua={spouseHarmonyDua} lang={lang} />
      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'weddingHeading')}</p>
      <StaticDuaCard dua={weddingDua} lang={lang} />
      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'sitMarriage')}</p>
      <DuaList ids={situations.find((s) => s.key === 'marriage').ids} lang={lang} onOpen={onOpenWazifa} />
      <button onClick={() => onOpenAdhkar('rabbana')} className="w-full mt-3 rounded-2xl border border-gold/25 p-4 bg-white/5 text-left active:scale-[0.99]">
        <span className={`block font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'offspringRabbanaLink')}</span>
        <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'offspringRabbanaSub')}</span>
      </button>
    </Shell>
  )
}

// ---------- Item 39: Dua/quote of the Day archive ----------
export function QuoteArchiveView({ lang, onBack }) {
  const firstDay = (idx) => {
    for (let d = 1; d <= 366; d++) if (d % dailyQuotes.length === idx) return d
    return idx
  }
  return (
    <Shell title={t(lang, 'archiveTitle')} sub={t(lang, 'archiveSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {dailyQuotes.map((q, i) => (
          <div key={i} className="rounded-2xl border border-gold/20 p-3.5 bg-white/5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold">{q.type === 'ayah' ? 'Ayah' : 'Hadith'} · {t(lang, 'dayOfYearLabel')} {firstDay(i)}</span>
              <span className="text-[10px] opacity-50">{q.reference}</span>
            </div>
            {q.arabic && <p className="font-arabic text-xl mt-2 text-center" dir="rtl">{q.arabic}</p>}
            <p className="text-sm leading-relaxed mt-2">{q.english}</p>
            <p className="font-urdu text-base mt-1.5 text-right" dir="rtl">{q.urdu}</p>
          </div>
        ))}
      </div>
    </Shell>
  )
}

// ---------- Item 40: Mood matcher ----------
export function MoodView({ lang, onBack, onOpenWazifa }) {
  const [mood, setMood] = useState(null)
  const active = moodMap.find((m) => m.key === mood)
  return (
    <Shell title={t(lang, 'moodTitle')} sub={t(lang, 'moodSub')} lang={lang} onBack={onBack}>
      <div className="flex flex-wrap gap-2">
        {moodMap.map((m) => (
          <button key={m.key} onClick={() => setMood(m.key)} aria-pressed={mood === m.key} className={`px-3.5 py-2 rounded-full text-xs font-bold border ${mood === m.key ? 'bg-gold text-black border-gold' : 'border-gold/30'} ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, m.labelKey)}</button>
        ))}
      </div>
      {active ? (
        <div className="mt-4"><DuaList ids={active.ids} lang={lang} onOpen={onOpenWazifa} /></div>
      ) : (
        <p className="text-sm opacity-60 text-center py-8 inline-flex items-center gap-2 w-full justify-center"><Smile size={16} /> {t(lang, 'moodPickHint')}</p>
      )}
    </Shell>
  )
}

// ---------- Dua collections hub ----------
export default function DuaHub({ lang, onBack, onNavigate }) {
  const btn = (target, Icon, title, sub) => (
    <button onClick={() => onNavigate(target)} className="w-full rounded-2xl border border-gold/25 p-4 bg-white/5 text-left flex items-center gap-3 active:scale-[0.99]">
      <Icon className="text-gold shrink-0" size={20} />
      <span className="min-w-0">
        <span className={`block font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{title}</span>
        <span className={`block text-[11px] opacity-70 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{sub}</span>
      </span>
    </button>
  )
  return (
    <Shell title={t(lang, 'duaHubTitle')} sub={t(lang, 'duaHubSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {btn('hisnul', BookHeart, t(lang, 'hisnulTitle'), t(lang, 'hisnulSub'))}
        {btn('mood', Smile, t(lang, 'moodTitle'), t(lang, 'moodSub'))}
        {btn('journal', NotebookPen, t(lang, 'journalTitle'), t(lang, 'journalSub'))}
        {btn('parents', Heart, t(lang, 'parentsTitle'), t(lang, 'parentsSub'))}
        {btn('exampack', Sparkles, t(lang, 'examPackTitle'), t(lang, 'examPackSub'))}
        {btn('debtpack', ScrollText, t(lang, 'debtPackTitle'), t(lang, 'debtPackSub'))}
        {btn('pregnancy', Heart, t(lang, 'pregnancyTitle'), t(lang, 'pregnancySub'))}
        {btn('nikah', Heart, t(lang, 'nikahTitle'), t(lang, 'nikahSub'))}
        {btn('archive', ScrollText, t(lang, 'archiveTitle'), t(lang, 'archiveSub'))}
      </div>
    </Shell>
  )
}
