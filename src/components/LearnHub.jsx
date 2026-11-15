import React, { useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, CalendarDays, Check, ChevronRight, GraduationCap, HelpCircle, Languages, Layers, Moon, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { alphabetData } from '../data/alphabetData'
import { quizBank } from '../data/quizData'
import { wordBank, wordOfTheDay } from '../data/wordBank'
import { wazifaData } from '../data/wazifaData'
import { todayLocal } from '../lib/db'
import { t } from '../lib/i18n'

export const urduCls = (lang) => (lang === 'ur' ? 'font-urdu' : '')
export const pick = (obj, lang) => (obj ? obj[lang] || obj.en || '' : '')

export function Shell({ title, sub, lang, onBack, children }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{title}</h2>
      {sub && <p className={`text-xs opacity-70 mt-0.5 ${urduCls(lang)}`}>{sub}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); if (v !== null && v !== undefined) return v } catch { /* fresh */ }
  return fallback
}
function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now - start) / 86400000)
}

// ---------- Learn hub ----------
export default function LearnHub({ lang, onBack, onNavigate }) {
  const rows = [
    ['alphabet', Languages, 'alphabetTitle', 'alphabetSub'],
    ['quiz', HelpCircle, 'quizTitle', 'quizSub'],
    ['seerah', BookOpen, 'seerahTitle', 'seerahSub'],
    ['prophets', Sparkles, 'prophetsTitle', 'prophetsSub'],
    ['sahaba', BookOpen, 'sahabaTitle', 'sahabaSub'],
    ['nawawi', BookOpen, 'nawawiTitle', 'nawawiSub'],
    ['path', GraduationCap, 'pathTitle', 'pathSub'],
    ['wordday', CalendarDays, 'wordDayTitle', 'wordDaySub'],
    ['flashcards', Layers, 'flashcardsTitle', 'flashcardsSub']
  ]
  return (
    <Shell title={t(lang, 'learnTitle')} sub={t(lang, 'learnSub')} lang={lang} onBack={onBack}>
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

// ---------- Item 41: Arabic alphabet ----------
function letterForms(l) {
  // Standard joining forms rendered with the tatweel (ـ) showing the joins.
  if (!l.joiner) return { isolated: l.letter, initial: l.letter, medial: l.letter, final: 'ـ' + l.letter }
  return { isolated: l.letter, initial: l.letter + 'ـ', medial: 'ـ' + l.letter + 'ـ', final: 'ـ' + l.letter }
}

export function AlphabetView({ lang, onBack }) {
  const [sel, setSel] = useState(null)
  const [quiz, setQuiz] = useState(null) // { rounds: [letterIdx...], i, picked, score, done }
  function startQuiz() {
    const rounds = shuffle(alphabetData.map((_, i) => i)).slice(0, 10).map((idx) => {
      const opts = shuffle([idx, ...shuffle(alphabetData.map((_, i) => i).filter((x) => x !== idx)).slice(0, 3)])
      return { idx, opts }
    })
    setQuiz({ rounds, i: 0, picked: null, score: 0, done: false })
  }
  if (quiz) {
    const round = quiz.rounds[quiz.i]
    const target = alphabetData[round.idx]
    function pickOpt(o) {
      if (quiz.picked !== null) return
      const right = o === round.idx
      setQuiz({ ...quiz, picked: o, score: quiz.score + (right ? 1 : 0) })
    }
    function next() {
      if (quiz.i + 1 >= quiz.rounds.length) setQuiz({ ...quiz, done: true })
      else setQuiz({ ...quiz, i: quiz.i + 1, picked: null })
    }
    return (
      <Shell title={t(lang, 'alphabetQuizTitle')} lang={lang} onBack={() => setQuiz(null)}>
        {quiz.done ? (
          <div className="rounded-3xl border border-gold/30 p-6 bg-white/5 text-center">
            <Trophy className="text-gold mx-auto" size={30} />
            <p className="font-extrabold text-lg mt-2">{quiz.score} / {quiz.rounds.length}</p>
            <button onClick={startQuiz} className="mt-4 px-4 py-2 rounded-full bg-gold text-black text-xs font-bold">{t(lang, 'playAgain')}</button>
          </div>
        ) : (
          <>
            <p className={`text-sm ${urduCls(lang)}`}>{t(lang, 'alphabetQuizQ').replace('{sound}', target.sound).replace('{name}', target.name)}</p>
            <p className="text-xs opacity-60 mt-1">{quiz.i + 1} / {quiz.rounds.length} · {t(lang, 'scoreLabel')}: {quiz.score}</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {round.opts.map((o) => {
                const l = alphabetData[o]
                const isRight = o === round.idx
                const isPicked = quiz.picked === o
                return (
                  <button key={o} onClick={() => pickOpt(o)} className={`rounded-2xl border p-4 ${quiz.picked !== null && isRight ? 'border-green-400 bg-green-400/10' : isPicked ? 'border-red-400 bg-red-400/10' : 'border-gold/25 bg-white/5'}`}>
                    <span className="font-arabic text-4xl block">{l.letter}</span>
                    <span className="text-xs font-bold">{l.name}</span>
                  </button>
                )
              })}
            </div>
            {quiz.picked !== null && <button onClick={next} className="mt-4 w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'nextBtn')}</button>}
          </>
        )}
      </Shell>
    )
  }
  if (sel !== null) {
    const l = alphabetData[sel]
    const f = letterForms(l)
    const formRows = [['formIsolated', f.isolated], ['formInitial', f.initial], ['formMedial', f.medial], ['formFinal', f.final]]
    return (
      <Shell title={`${l.name} — ${l.letter}`} lang={lang} onBack={() => setSel(null)}>
        <div className="rounded-3xl border border-gold/30 p-5 bg-white/5 text-center">
          <span className="font-arabic text-7xl block">{l.letter}</span>
          <p className="text-sm mt-2 opacity-80">{t(lang, 'soundLabel')}: <b>{l.sound}</b></p>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          {formRows.map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-gold/20 p-2.5 bg-white/5 text-center">
              <span className="font-arabic text-3xl block" dir="rtl">{v}</span>
              <span className={`block text-[10px] opacity-60 mt-1 ${urduCls(lang)}`}>{t(lang, k)}</span>
            </div>
          ))}
        </div>
        {!l.joiner && <p className={`text-[11px] opacity-60 mt-2 ${urduCls(lang)}`}>{t(lang, 'nonJoinerNote')}</p>}
        <div className="rounded-3xl border border-gold/25 p-5 bg-white/5 mt-3 text-center">
          <p className={`text-xs opacity-60 ${urduCls(lang)}`}>{t(lang, 'exampleWord')}</p>
          <span className="font-arabic text-4xl block mt-1" dir="rtl">{l.example.arabic}</span>
          <p className="text-sm mt-1">{l.example.trans} — {pick(l.example, lang)}</p>
        </div>
      </Shell>
    )
  }
  return (
    <Shell title={t(lang, 'alphabetTitle')} sub={t(lang, 'alphabetSub')} lang={lang} onBack={onBack}>
      <button onClick={startQuiz} className="w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm mb-3">{t(lang, 'startQuiz')}</button>
      <div className="grid grid-cols-4 gap-2" dir="rtl">
        {alphabetData.map((l, i) => (
          <button key={l.letter} onClick={() => setSel(i)} className="rounded-2xl border border-gold/25 p-3 bg-white/5 active:scale-[0.98]">
            <span className="font-arabic text-3xl block">{l.letter}</span>
            <span className="text-[10px] font-bold block mt-0.5" dir="ltr">{l.name}</span>
          </button>
        ))}
      </div>
    </Shell>
  )
}

// ---------- Item 42: Daily Islamic quiz ----------
export function QuizView({ lang, onBack }) {
  const [session, setSession] = useState(null) // { qs, i, picked, score, mode }
  const [history, setHistory] = useState(() => loadJSON('wl-quiz-history', []))
  const dailyQs = useMemo(() => {
    const doy = dayOfYear()
    const out = []
    for (let k = 0; k < 5; k++) out.push(quizBank[(doy * 5 + k) % quizBank.length])
    return out
  }, [])
  const todayDone = history.find((h) => h.date === todayLocal() && h.mode === 'daily')
  function start(mode) {
    const qs = mode === 'daily' ? dailyQs : shuffle(quizBank).slice(0, 10)
    setSession({ qs, i: 0, picked: null, score: 0, mode })
  }
  function finish(s) {
    const entry = { date: todayLocal(), score: s.score, total: s.qs.length, mode: s.mode }
    const next = [entry, ...history.filter((h) => !(h.date === entry.date && h.mode === entry.mode))].slice(0, 60)
    setHistory(next); saveJSON('wl-quiz-history', next)
  }
  if (session) {
    const q = session.qs[session.i]
    function pickOpt(o) {
      if (session.picked !== null) return
      setSession({ ...session, picked: o, score: session.score + (o === q.correct ? 1 : 0) })
    }
    function next() {
      if (session.i + 1 >= session.qs.length) { finish(session); setSession({ ...session, done: true }) }
      else setSession({ ...session, i: session.i + 1, picked: null })
    }
    return (
      <Shell title={t(lang, session.mode === 'daily' ? 'quizDailyTitle' : 'quizPracticeTitle')} lang={lang} onBack={() => setSession(null)}>
        {session.done ? (
          <div className="rounded-3xl border border-gold/30 p-6 bg-white/5 text-center">
            <Trophy className="text-gold mx-auto" size={30} />
            <p className="font-extrabold text-lg mt-2">{session.score} / {session.qs.length}</p>
            <p className={`text-xs opacity-70 mt-1 ${urduCls(lang)}`}>{t(lang, 'quizSavedNote')}</p>
            <button onClick={() => setSession(null)} className="mt-4 px-4 py-2 rounded-full bg-gold text-black text-xs font-bold">{t(lang, 'back')}</button>
          </div>
        ) : (
          <>
            <p className="text-[11px] opacity-60">{q.cat} · {session.i + 1} / {session.qs.length} · {t(lang, 'scoreLabel')}: {session.score}</p>
            <p className={`font-bold text-base mt-2 leading-relaxed ${urduCls(lang)}`}>{pick(q.q, lang)}</p>
            <div className="space-y-2 mt-4">
              {q.options.en.map((_, oi) => {
                const isRight = oi === q.correct
                const isPicked = session.picked === oi
                return (
                  <button key={oi} onClick={() => pickOpt(oi)} className={`w-full rounded-2xl border p-3.5 text-left text-sm font-bold ${session.picked !== null && isRight ? 'border-green-400 bg-green-400/10' : isPicked ? 'border-red-400 bg-red-400/10' : 'border-gold/25 bg-white/5'} ${urduCls(lang)}`}>
                    {pick({ en: q.options.en[oi], ur: q.options.ur[oi], roman: q.options.roman[oi] }, lang)}
                  </button>
                )
              })}
            </div>
            {session.picked !== null && <button onClick={next} className="mt-4 w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'nextBtn')}</button>}
          </>
        )}
      </Shell>
    )
  }
  return (
    <Shell title={t(lang, 'quizTitle')} sub={t(lang, 'quizSub')} lang={lang} onBack={onBack}>
      <div className="rounded-3xl border border-gold/30 p-5 bg-white/5">
        <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'quizDailyTitle')}</p>
        <p className={`text-xs opacity-70 mt-1 ${urduCls(lang)}`}>{todayDone ? `${t(lang, 'quizTodayDone')}: ${todayDone.score} / ${todayDone.total}` : t(lang, 'quizDailyHint')}</p>
        <button onClick={() => start('daily')} className="mt-3 w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'startQuiz')}</button>
      </div>
      <div className="rounded-3xl border border-gold/25 p-5 bg-white/5 mt-3">
        <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'quizPracticeTitle')}</p>
        <p className={`text-xs opacity-70 mt-1 ${urduCls(lang)}`}>{t(lang, 'quizPracticeHint')}</p>
        <button onClick={() => start('practice')} className="mt-3 w-full py-3 rounded-2xl border border-gold/50 text-gold font-bold text-sm">{t(lang, 'startQuiz')}</button>
      </div>
      {history.length > 0 && (
        <div className="mt-4">
          <p className={`font-bold text-sm mb-2 ${urduCls(lang)}`}>{t(lang, 'quizHistoryTitle')}</p>
          <div className="space-y-1.5">
            {history.slice(0, 14).map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-gold/15 bg-white/5 px-3 py-2 text-xs">
                <span>{h.date} · {t(lang, h.mode === 'daily' ? 'quizDailyTitle' : 'quizPracticeTitle')}</span>
                <span className="font-bold text-gold">{h.score} / {h.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Shell>
  )
}

// ---------- Item 48: Arabic word of the day ----------
export function wordOfTheDayEntry() {
  const r = wordOfTheDay()
  return { ...r, dayIndex: r.index }
}

export function WordDayView({ lang, onBack }) {
  const [showArchive, setShowArchive] = useState(false)
  const today = wordOfTheDay()
  if (showArchive) {
    return (
      <Shell title={t(lang, 'wordArchiveTitle')} lang={lang} onBack={() => setShowArchive(false)}>
        <div className="space-y-1.5">
          {wordBank.map((w, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gold/15 bg-white/5 px-3 py-2">
              <span className="text-[10px] opacity-50 w-8 shrink-0">#{i + 1}</span>
              <span className="font-arabic text-xl shrink-0" dir="rtl">{w.arabic}</span>
              <span className="flex-1 text-xs"><b>{w.trans}</b> — {pick(w, lang)}</span>
              {i === today.index && <span className="text-[10px] font-bold text-gold">{t(lang, 'todayLabel')}</span>}
            </div>
          ))}
        </div>
      </Shell>
    )
  }
  const w = today.word
  return (
    <Shell title={t(lang, 'wordDayTitle')} sub={t(lang, 'wordDaySub')} lang={lang} onBack={onBack}>
      <div className="rounded-3xl border border-gold/30 p-6 bg-white/5 text-center">
        <p className="text-[11px] opacity-60">#{today.index + 1} / {wordBank.length}</p>
        <span className="font-arabic text-6xl block mt-2" dir="rtl">{w.arabic}</span>
        <p className="font-extrabold text-lg mt-2">{w.trans}</p>
        <p className={`text-sm opacity-85 mt-1 ${urduCls(lang)}`}>{pick(w, lang)}</p>
      </div>
      <button onClick={() => setShowArchive(true)} className="mt-3 w-full py-3 rounded-2xl border border-gold/50 text-gold font-bold text-sm">{t(lang, 'wordArchiveTitle')}</button>
    </Shell>
  )
}

// ---------- Item 49: Dua flashcards ----------
export function FlashcardsView({ lang, onBack }) {
  const cats = useMemo(() => ['All', ...new Set(wazifaData.map((w) => w.category))], [])
  const [cat, setCat] = useState('All')
  const [order, setOrder] = useState(() => wazifaData.map((w) => w.id))
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [learned, setLearned] = useState(() => new Set(loadJSON('wl-flash-learned', [])))
  const list = useMemo(() => {
    const byIdMap = new Map(wazifaData.map((w) => [w.id, w]))
    return order.map((id) => byIdMap.get(id)).filter((w) => w && (cat === 'All' || w.category === cat))
  }, [order, cat])
  const card = list[Math.min(idx, Math.max(0, list.length - 1))]
  const pct = Math.round((learned.size / wazifaData.length) * 100)
  function toggleLearned(id) {
    const next = new Set(learned)
    if (next.has(id)) next.delete(id); else next.add(id)
    setLearned(next); saveJSON('wl-flash-learned', [...next])
  }
  function move(d) { setFlipped(false); setIdx((i) => (i + d + list.length) % list.length) }
  return (
    <Shell title={t(lang, 'flashcardsTitle')} sub={t(lang, 'flashcardsSub')} lang={lang} onBack={onBack}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>
        <span className="text-[11px] font-bold text-gold">{learned.size}/{wazifaData.length} · {pct}%</span>
      </div>
      <div className="flex gap-2 mt-3">
        <select value={cat} onChange={(e) => { setCat(e.target.value); setIdx(0); setFlipped(false) }} className="flex-1 rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm">
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => { setOrder(shuffle(wazifaData.map((w) => w.id))); setIdx(0); setFlipped(false) }} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-gold/40 text-xs font-bold"><RotateCcw size={13} /> {t(lang, 'shuffleBtn')}</button>
      </div>
      {card ? (
        <>
          <button onClick={() => setFlipped(!flipped)} className="w-full rounded-3xl border border-gold/30 p-6 bg-white/5 mt-3 min-h-[220px] text-center active:scale-[0.99]">
            {!flipped ? (
              <>
                <span className="font-arabic text-3xl leading-loose block" dir="rtl">{card.arabic}</span>
                <span className={`block text-[11px] opacity-60 mt-3 ${urduCls(lang)}`}>{t(lang, 'tapToFlip')}</span>
              </>
            ) : (
              <>
                <span className="font-bold block">{card.title}</span>
                <span className="block text-sm mt-2 leading-relaxed">{card.english_translation}</span>
                <span className="font-urdu block text-base mt-2 text-right" dir="rtl">{card.urdu_translation}</span>
                <span className="block text-[11px] text-gold mt-2">{card.reference}</span>
              </>
            )}
          </button>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={() => move(-1)} className="flex-1 py-3 rounded-2xl border border-gold/40 font-bold text-sm">{t(lang, 'prevBtn')}</button>
            <button onClick={() => toggleLearned(card.id)} className={`flex-1 py-3 rounded-2xl font-bold text-sm inline-flex items-center justify-center gap-1 ${learned.has(card.id) ? 'bg-gold text-black' : 'border border-gold/50 text-gold'}`}>
              <Check size={15} /> {learned.has(card.id) ? t(lang, 'learnedLabel') : t(lang, 'markLearned')}
            </button>
            <button onClick={() => move(1)} className="flex-1 py-3 rounded-2xl border border-gold/40 font-bold text-sm">{t(lang, 'nextBtn')}</button>
          </div>
          <p className="text-center text-[11px] opacity-60 mt-2">{Math.min(idx, list.length - 1) + 1} / {list.length}</p>
        </>
      ) : <p className="text-sm opacity-70 text-center py-8">{t(lang, 'noResults')}</p>}
    </Shell>
  )
}

// ---------- Item 47: Learning path ----------
const PATH_LEVELS = [
  { key: 'pathLevel1', items: [['alphabet', 'pathAlphabet'], ['prayer', 'pathWuduSalah'], ['duas', 'pathDailyDuas'], ['wordday', 'pathWordDay']] },
  { key: 'pathLevel2', items: [['names', 'pathNames'], ['juzamma', 'pathJuzAmma'], ['hisnul', 'pathHisnul'], ['flashcards', 'pathFlashcards']] },
  { key: 'pathLevel3', items: [['quran', 'pathQuranMemo'], ['nawawi', 'pathNawawi'], ['seerah', 'pathSeerah'], ['quiz', 'pathQuiz']] }
]

export function PathView({ lang, onBack, onNavigate }) {
  const [done, setDone] = useState(() => new Set(loadJSON('wl-path-done', [])))
  const total = PATH_LEVELS.reduce((n, l) => n + l.items.length, 0)
  const pct = Math.round((done.size / total) * 100)
  function toggle(id) {
    const next = new Set(done)
    if (next.has(id)) next.delete(id); else next.add(id)
    setDone(next); saveJSON('wl-path-done', [...next])
  }
  const R = 26
  const CIRC = 2 * Math.PI * R
  return (
    <Shell title={t(lang, 'pathTitle')} sub={t(lang, 'pathSub')} lang={lang} onBack={onBack}>
      <div className="flex items-center gap-4 rounded-3xl border border-gold/30 p-4 bg-white/5">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="6" />
          <circle cx="32" cy="32" r={R} fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct / 100)} transform="rotate(-90 32 32)" />
          <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="800" fill="#D4AF37">{pct}%</text>
        </svg>
        <div>
          <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'pathProgress')}</p>
          <p className="text-xs opacity-70">{done.size} / {total}</p>
        </div>
      </div>
      {PATH_LEVELS.map((level) => (
        <div key={level.key} className="mt-4">
          <p className={`font-extrabold text-sm text-gold ${urduCls(lang)}`}>{t(lang, level.key)}</p>
          <div className="space-y-2 mt-2">
            {level.items.map(([view, labelKey]) => {
              const id = `${level.key}:${view}`
              const isDone = done.has(id)
              return (
                <div key={id} className="flex items-center gap-2 rounded-2xl border border-gold/25 p-3 bg-white/5">
                  <button onClick={() => onNavigate(view)} className={`flex-1 text-left font-bold text-sm ${urduCls(lang)}`}>{t(lang, labelKey)}</button>
                  <button onClick={() => toggle(id)} aria-pressed={isDone} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold ${isDone ? 'bg-gold text-black' : 'border border-gold/40'}`}>
                    <Check size={12} /> {isDone ? t(lang, 'doneLabel') : t(lang, 'markDone')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <p className={`text-[11px] opacity-60 mt-4 inline-flex items-start gap-1 ${urduCls(lang)}`}><Moon size={12} className="shrink-0 mt-0.5" /> {t(lang, 'pathSelfNote')}</p>
    </Shell>
  )
}
