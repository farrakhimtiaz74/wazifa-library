import React, { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronLeft, ChevronRight, GraduationCap, HelpCircle, List, RotateCcw, Search, Trophy } from 'lucide-react'
import { namesData } from '../data/namesData'
import TasbihCounter from './TasbihCounter'
import { t } from '../lib/i18n'

export function nameWazifa(name) {
  return {
    id: `name-${name.n}`,
    title: name.transliteration,
    category: 'Daily Adhkar',
    arabic: name.arabic,
    transliteration: name.transliteration,
    english_translation: name.english,
    urdu_translation: name.urdu,
    target_count: 33,
    recommended_time: 'Any Time',
    reference: 'Asma-ul-Husna — At-Tirmidhi',
    instructions: '',
    keywords: []
  }
}

// Item 26: deterministic Name of the Day — same day-of-year % 99 rule the
// Home tile uses.
export function nameOfTheDay() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const doy = Math.floor((now - start) / 86400000)
  return namesData[doy % namesData.length]
}

function loadLearned() {
  try { const v = JSON.parse(localStorage.getItem('wl-names-learned')); if (Array.isArray(v)) return v } catch { /* fresh */ }
  return []
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

function buildQuiz() {
  const picks = shuffle(namesData).slice(0, 10)
  return picks.map((name, i) => {
    const byMeaning = i % 2 === 0
    const distractors = shuffle(namesData.filter((n) => n.n !== name.n)).slice(0, 3)
    const options = shuffle([name, ...distractors])
    return { name, byMeaning, options }
  })
}

export default function NamesView({ routines, onRoutineChange, lang = 'en' }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  // Item 25: modes — list | flash | quiz | archive (archive = item 26).
  const [mode, setMode] = useState('list')
  const [learned, setLearned] = useState(loadLearned)
  const [flashIdx, setFlashIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [qIdx, setQIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem('wl-names-quiz-best')) || 0 } catch { return 0 } })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return namesData
    return namesData.filter((n) => n.transliteration.toLowerCase().includes(q) || n.english.toLowerCase().includes(q) || n.arabic.includes(query.trim()) || n.urdu.includes(query.trim()))
  }, [query])

  function toggleLearned(n) {
    setLearned((prev) => {
      const next = prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
      try { localStorage.setItem('wl-names-learned', JSON.stringify(next)) } catch { /* storage */ }
      return next
    })
  }

  const learnedPct = Math.round((learned.length / namesData.length) * 100)
  const urduCls = lang === 'ur' ? 'font-urdu' : ''
  const modeBtn = (m, Icon, label) => (
    <button onClick={() => setMode(m)} aria-pressed={mode === m} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${mode === m ? 'bg-gold text-black border-gold' : 'border-gold/30 opacity-75'}`}>
      <Icon size={12} /> {label}
    </button>
  )

  if (selected) {
    const w = nameWazifa(selected)
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
        <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5 text-center">
          <p className="text-xs opacity-60">{selected.n} / 99</p>
          <p className="font-arabic mt-1" dir="rtl" style={{ fontSize: 44 }}>{selected.arabic}</p>
          <h2 className="text-xl font-extrabold mt-2">{selected.transliteration}</h2>
          <p className="mt-2 text-sm leading-relaxed">{selected.english}</p>
          <p className="font-urdu mt-2 text-base" dir="rtl">{selected.urdu}</p>
          <button onClick={() => toggleLearned(selected.n)} aria-pressed={learned.includes(selected.n)} className={`mt-3 px-3 py-1.5 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${learned.includes(selected.n) ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>
            <Check size={12} /> {learned.includes(selected.n) ? t(lang, 'learnedLabel') : t(lang, 'markLearned')}
          </button>
        </div>
        <TasbihCounter wazifa={w} routine={routines[w.id]} onRoutineChange={onRoutineChange} lang={lang} />
      </div>
    )
  }

  const header = (
    <>
      <h2 className={`text-lg font-extrabold ${urduCls}`}>{t(lang, 'namesTitle')}</h2>
      <p className="text-xs opacity-70 mt-0.5">{t(lang, 'namesSub')}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {modeBtn('list', List, t(lang, 'namesModeList'))}
        {modeBtn('flash', RotateCcw, t(lang, 'namesModeFlash'))}
        {modeBtn('quiz', HelpCircle, t(lang, 'namesModeQuiz'))}
        {modeBtn('archive', GraduationCap, t(lang, 'nameArchiveTitle'))}
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] opacity-80">
          <span>{t(lang, 'namesProgress')}: {learned.length}/99</span><span>{learnedPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 mt-1 overflow-hidden"><div className="h-full bg-gold rounded-full" style={{ width: `${learnedPct}%` }} /></div>
      </div>
    </>
  )

  if (mode === 'archive') {
    // Item 26 archive: for each name, the day-of-year numbers on which it is
    // the Name of the Day (doy % 99 === index), computed honestly by scan.
    const daysFor = (idx) => {
      const days = []
      for (let d = 1; d <= 365; d++) if (d % 99 === idx) days.push(d)
      return days
    }
    const todayName = nameOfTheDay()
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        {header}
        <p className="text-xs opacity-70 mt-3">{t(lang, 'nameArchiveSub')}</p>
        <div className="space-y-2 mt-3">
          {namesData.map((n, i) => (
            <button key={n.n} onClick={() => setSelected(n)} className={`w-full rounded-2xl border p-3 text-left flex items-center gap-3 ${n.n === todayName.n ? 'border-gold bg-gold/10' : 'border-gold/20 bg-white/5'}`}>
              <span className="text-[10px] opacity-50 w-6 shrink-0">{n.n}</span>
              <span className="font-arabic text-xl shrink-0" dir="rtl">{n.arabic}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold truncate">{n.transliteration}</span>
                <span className="block text-[11px] opacity-60 truncate">{n.english}</span>
              </span>
              <span className="text-[10px] opacity-60 shrink-0 text-right">{t(lang, 'dayOfYearLabel')}<br />{daysFor(i).join(', ')}</span>
              {learned.includes(n.n) && <Check size={14} className="text-gold shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'flash') {
    const name = namesData[flashIdx]
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        {header}
        <button onClick={() => setFlipped(!flipped)} className="w-full rounded-3xl border border-gold/30 p-6 mt-4 bg-white/5 text-center min-h-[190px] active:scale-[0.99]" aria-label={t(lang, 'flashTapFlip')}>
          {!flipped ? (
            <>
              <p className="text-xs opacity-60">{name.n} / 99</p>
              <p className="font-arabic mt-2" dir="rtl" style={{ fontSize: 46 }}>{name.arabic}</p>
              <p className="text-lg font-extrabold mt-2">{name.transliteration}</p>
              <p className="text-[11px] opacity-60 mt-3">{t(lang, 'flashTapFlip')}</p>
            </>
          ) : (
            <>
              <p className="text-base leading-relaxed">{name.english}</p>
              <p className="font-urdu mt-3 text-lg" dir="rtl">{name.urdu}</p>
            </>
          )}
        </button>
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => { setFlashIdx((flashIdx + namesData.length - 1) % namesData.length); setFlipped(false) }} className="px-3 py-2 rounded-full border border-gold/40 text-xs font-bold inline-flex items-center gap-1"><ChevronLeft size={13} /> {t(lang, 'prevBtn')}</button>
          <button onClick={() => toggleLearned(name.n)} aria-pressed={learned.includes(name.n)} className={`px-3 py-2 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${learned.includes(name.n) ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}><Check size={13} /> {learned.includes(name.n) ? t(lang, 'learnedLabel') : t(lang, 'markLearned')}</button>
          <button onClick={() => { setFlashIdx((flashIdx + 1) % namesData.length); setFlipped(false) }} className="px-3 py-2 rounded-full border border-gold/40 text-xs font-bold inline-flex items-center gap-1">{t(lang, 'nextBtn')} <ChevronRight size={13} /></button>
        </div>
      </div>
    )
  }

  if (mode === 'quiz') {
    function startQuiz() { setQuiz(buildQuiz()); setQIdx(0); setPicked(null); setScore(0) }
    function pick(opt) {
      if (picked !== null || !quiz) return
      const q = quiz[qIdx]
      const correct = opt.n === q.name.n
      setPicked(opt.n)
      if (correct) setScore((s) => s + 1)
    }
    function next() {
      if (qIdx + 1 >= quiz.length) {
        const final = score
        if (final > best) { setBest(final); try { localStorage.setItem('wl-names-quiz-best', String(final)) } catch { /* storage */ } }
        setQuiz(null)
      } else { setQIdx(qIdx + 1); setPicked(null) }
    }
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        {header}
        {!quiz ? (
          <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5 text-center">
            <Trophy className="text-gold mx-auto" size={26} />
            <p className="text-sm mt-2">{t(lang, 'quizIntro')}</p>
            <p className="text-xs opacity-70 mt-1">{t(lang, 'quizBest')}: {best}/10</p>
            <button onClick={startQuiz} className="mt-4 px-5 py-2.5 rounded-full bg-gold text-black text-sm font-bold">{t(lang, 'quizStart')}</button>
            {best > 0 && score > 0 && <p className="text-xs text-gold mt-3">{t(lang, 'quizLastScore')}: {score}/10</p>}
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-[11px] opacity-70">{t(lang, 'quizQuestionOf').replace('{x}', qIdx + 1).replace('{n}', quiz.length)} · {t(lang, 'quizScore')}: {score}</p>
            <div className="rounded-3xl border border-gold/25 p-5 mt-2 bg-white/5 text-center">
              {quiz[qIdx].byMeaning ? (
                <>
                  <p className="text-xs opacity-60">{t(lang, 'quizWhichName')}</p>
                  <p className="text-lg font-extrabold mt-2">{quiz[qIdx].name.english}</p>
                  <p className="font-urdu mt-1" dir="rtl">{quiz[qIdx].name.urdu}</p>
                </>
              ) : (
                <>
                  <p className="text-xs opacity-60">{t(lang, 'quizWhichMeaning')}</p>
                  <p className="font-arabic mt-2" dir="rtl" style={{ fontSize: 38 }}>{quiz[qIdx].name.arabic}</p>
                  <p className="font-extrabold mt-1">{quiz[qIdx].name.transliteration}</p>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {quiz[qIdx].options.map((opt) => {
                const isAnswer = opt.n === quiz[qIdx].name.n
                const cls = picked === null ? 'border-gold/25 bg-white/5' : isAnswer ? 'border-gold bg-gold/20' : picked === opt.n ? 'border-red-400 bg-red-400/10' : 'border-gold/15 opacity-60'
                return (
                  <button key={opt.n} onClick={() => pick(opt)} className={`rounded-2xl border p-3 text-left ${cls}`}>
                    {quiz[qIdx].byMeaning ? (
                      <><span className="font-arabic block text-lg" dir="rtl">{opt.arabic}</span><span className="block text-xs font-bold mt-0.5">{opt.transliteration}</span></>
                    ) : (
                      <span className="block text-sm font-bold">{opt.english}</span>
                    )}
                  </button>
                )
              })}
            </div>
            {picked !== null && (
              <button onClick={next} className="w-full mt-4 py-3 rounded-2xl bg-gold text-black font-bold text-sm">{qIdx + 1 >= quiz.length ? t(lang, 'quizFinish') : t(lang, 'nextBtn')}</button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      {header}
      <div className="relative mt-3">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t(lang, 'searchNames')} className="w-full rounded-2xl border border-gold/25 bg-white/5 py-3 pl-10 pr-3 text-sm outline-none focus:border-gold" />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {filtered.map((n) => (
          <button key={n.n} onClick={() => setSelected(n)} className="relative rounded-2xl border border-gold/20 bg-white/5 p-3 text-center active:scale-[0.98]">
            {learned.includes(n.n) && <span className="absolute top-1.5 right-1.5 text-gold"><Check size={12} /></span>}
            <span className="block text-[10px] opacity-50">{n.n}</span>
            <span className="font-arabic block text-xl leading-snug" dir="rtl">{n.arabic}</span>
            <span className="block text-[11px] font-bold mt-1 truncate">{n.transliteration}</span>
            <span className="block text-[10px] opacity-60 truncate">{n.english}</span>
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm opacity-70 text-center py-8">{t(lang, 'noResults')}</p>}
    </div>
  )
}
