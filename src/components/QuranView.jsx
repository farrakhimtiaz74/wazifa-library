import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Bookmark, BookmarkCheck, BookOpen, Brain, CalendarRange, Check, Eye, ListOrdered, Moon, Pause, Play, Search, Settings2, Sparkles, X } from 'lucide-react'
import { t } from '../lib/i18n'
import { todayLocal } from '../lib/db'
import {
  RECITERS, TRANSLATIONS, TOTAL_AYAHS, audioUrl, fetchSurah, fetchSurahMeta, fetchTajweedSurah,
  getBookmarks, getKhatamPlan, getLastRead, getMemorised, getMulkDates, loadReciter, loadTranslationPref,
  mulkStreak, parseTajweed, portionForDay, saveReciter, saveTranslationPref, searchQuran,
  setBookmarks, setKhatamPlan, setLastRead, setMemorised, setMulkDates
} from '../lib/quran'

const FEATURED = [
  { n: 36, virtuesKey: 'virtuesYasin' },
  { n: 55, virtuesKey: 'virtuesRahman' },
  { n: 56, virtuesKey: 'virtuesWaqiah' }
]

const TAJWEED_COLORS = {
  h: '#ef9a9a', l: '#90caf9', n: '#a5d6a7', p: '#ffcc80', m: '#ce93d8', q: '#80cbc4',
  o: '#f48fb1', s: '#bcaaa4', d: '#b0bec5', b: '#9fa8da', g: '#e6ee9c', w: '#ffe082',
  a: '#ffab91', r: '#81d4fa', t: '#a5d6a7', f: '#fff59d', j: '#80deea', k: '#c5e1a5'
}

const urduCls = (lang) => (lang === 'ur' ? 'font-urdu' : '')

export default function QuranView({ lang = 'en', onBack, openTarget = null }) {
  const [page, setPage] = useState('list')
  const [meta, setMeta] = useState(null)
  const [metaFail, setMetaFail] = useState(false)
  const [metaReload, setMetaReload] = useState(0)

  const [translation, setTranslation] = useState(() => loadTranslationPref(lang))
  const [reciter, setReciter] = useState(loadReciter)
  const [autoAdvance, setAutoAdvance] = useState(true)

  const [current, setCurrent] = useState(null) // surah meta object
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadFail, setLoadFail] = useState(false)
  const [fromCache, setFromCache] = useState(false)
  const [highlight, setHighlight] = useState(null)

  const [tajweedOn, setTajweedOn] = useState(false)
  const [tajweedTexts, setTajweedTexts] = useState(null)
  const [tajweedFail, setTajweedFail] = useState(false)

  const [memoriseOn, setMemoriseOn] = useState(false)
  const [revealed, setRevealed] = useState(() => new Set())
  const [repeats, setRepeats] = useState({})
  const [memorised, setMemorisedState] = useState(() => new Set())
  const [bookmarks, setBookmarksState] = useState([])
  const [lastRead, setLastReadState] = useState(null)
  const [sheet, setSheet] = useState(null) // ayah object
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [playingGlobal, setPlayingGlobal] = useState(null)
  const audioRef = useRef(null)
  const dataRef = useRef(null)
  dataRef.current = data
  const autoRef = useRef(autoAdvance)
  autoRef.current = autoAdvance
  const reciterRef = useRef(reciter)
  reciterRef.current = reciter

  const [mulkDates, setMulkDatesState] = useState([])
  const [plan, setPlanState] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState(false)

  const today = todayLocal()

  // ---------- load persisted state ----------
  useEffect(() => {
    ;(async () => {
      setBookmarksState(await getBookmarks())
      setMemorisedState(new Set(await getMemorised()))
      setLastReadState(await getLastRead())
      setMulkDatesState(await getMulkDates())
      setPlanState(await getKhatamPlan())
    })()
  }, [])

  useEffect(() => {
    let alive = true
    fetchSurahMeta()
      .then((r) => { if (alive) { setMeta(r.list); setMetaFail(false) } })
      .catch(() => { if (alive) setMetaFail(true) })
    return () => { alive = false }
  }, [metaReload])

  // Deep-open requests (e.g. from Juz Amma or a bookmark elsewhere).
  useEffect(() => {
    if (openTarget && openTarget.surah) openSurah(openTarget.surah, openTarget.ayah || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTarget && openTarget.stamp])

  function stopAudio() {
    if (audioRef.current) {
      try { audioRef.current.pause() } catch { /* already stopped */ }
      audioRef.current = null
    }
    setPlayingGlobal(null)
  }

  useEffect(() => stopAudio, [])
  useEffect(() => { stopAudio() }, [page])

  function playAyah(ayah) {
    if (!ayah) return
    if (playingGlobal === ayah.global) { stopAudio(); return }
    stopAudio()
    const audio = new Audio(audioUrl(reciterRef.current, ayah.global))
    audioRef.current = audio
    setPlayingGlobal(ayah.global)
    audio.onended = () => {
      setPlayingGlobal(null)
      audioRef.current = null
      if (autoRef.current && dataRef.current) {
        const list = dataRef.current.ayahs
        const idx = list.findIndex((a) => a.global === ayah.global)
        if (idx >= 0 && idx < list.length - 1) playAyah(list[idx + 1])
      }
    }
    audio.onerror = () => { setPlayingGlobal(null); audioRef.current = null }
    audio.play().catch(() => { setPlayingGlobal(null); audioRef.current = null })
  }

  // ---------- reader loading ----------
  async function openSurah(number, ayah = null) {
    const m = (meta || []).find((s) => s.number === number) || { number, englishName: '', name: '', numberOfAyahs: 0 }
    setCurrent(m)
    setPage('reader')
    setHighlight(ayah)
    setSheet(null)
    setSettingsOpen(false)
    const lr = { surah: number, ayah: ayah || 1, name: m.englishName, ts: Date.now() }
    setLastReadState(lr)
    await setLastRead(lr)
  }

  useEffect(() => {
    if (page !== 'reader' || !current) return
    let alive = true
    setLoading(true); setLoadFail(false); setData(null); setTajweedTexts(null); setTajweedFail(false); setRevealed(new Set()); setRepeats({})
    fetchSurah(current.number, translation)
      .then((r) => { if (alive) { setData(r); setFromCache(!!r.fromCache); setLoading(false) } })
      .catch(() => { if (alive) { setLoadFail(true); setLoading(false) } })
    return () => { alive = false }
  }, [page, current, translation])

  useEffect(() => {
    if (page !== 'reader' || !current || !tajweedOn) return
    let alive = true
    fetchTajweedSurah(current.number)
      .then((texts) => { if (alive) setTajweedTexts(texts) })
      .catch(() => { if (alive) { setTajweedFail(true); setTajweedOn(false) } })
    return () => { alive = false }
  }, [page, current, tajweedOn])

  useEffect(() => {
    if (page === 'reader' && data && highlight) {
      const id = setTimeout(() => {
        const el = document.getElementById(`qayah-${highlight}`)
        if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 250)
      return () => clearTimeout(id)
    }
  }, [page, data, highlight])

  async function touchAyah(ayah) {
    if (!current) return
    const lr = { surah: current.number, ayah: ayah.n, name: current.englishName, ts: Date.now() }
    setLastReadState(lr)
    await setLastRead(lr)
  }

  const bmKey = (s, a) => `${s}:${a}`
  function isBookmarked(s, a) { return bookmarks.some((b) => b.surah === s && b.ayah === a) }
  async function toggleBookmark(ayah) {
    if (!current) return
    const exists = isBookmarked(current.number, ayah.n)
    const next = exists
      ? bookmarks.filter((b) => !(b.surah === current.number && b.ayah === ayah.n))
      : [...bookmarks, { surah: current.number, ayah: ayah.n, name: current.englishName, ts: Date.now() }]
    setBookmarksState(next)
    await setBookmarks(next)
  }

  function isMemorised(ayah) { return current && memorised.has(bmKey(current.number, ayah.n)) }
  async function toggleMemorised(ayah) {
    if (!current) return
    const key = bmKey(current.number, ayah.n)
    const next = new Set(memorised)
    if (next.has(key)) next.delete(key); else next.add(key)
    setMemorisedState(next)
    await setMemorised([...next])
  }

  const memorisedBySurah = useMemo(() => {
    const map = {}
    for (const key of memorised) {
      const s = Number(key.split(':')[0])
      map[s] = (map[s] || 0) + 1
    }
    return map
  }, [memorised])

  // ---------- Mulk ----------
  const mulkDoneToday = mulkDates.includes(today)
  async function toggleMulk() {
    const next = mulkDoneToday ? mulkDates.filter((d) => d !== today) : [...mulkDates, today]
    setMulkDatesState(next)
    await setMulkDates(next)
  }

  // ---------- Khatam ----------
  async function startKhatam(days) {
    const p = { targetDays: days, startDate: today, dayIndex: 0 }
    setPlanState(p)
    await setKhatamPlan(p)
  }
  async function advanceKhatam() {
    if (!plan) return
    const p = { ...plan, dayIndex: plan.dayIndex + 1 }
    setPlanState(p)
    await setKhatamPlan(p)
  }
  const portion = plan && meta ? portionForDay(meta, plan, plan.dayIndex) : null
  const planDone = plan && plan.dayIndex >= plan.targetDays

  // ---------- Search ----------
  async function runSearch() {
    const q = searchText.trim()
    if (!q) return
    setSearching(true); setSearchErr(false); setSearchResults(null)
    try {
      const isArabic = /[\u0600-\u06FF]/.test(q)
      const jobs = []
      if (isArabic) jobs.push(searchQuran(q, 'quran-uthmani'))
      const transEd = translation !== 'none' ? translation : 'en.asad'
      jobs.push(searchQuran(q, transEd))
      const settled = await Promise.allSettled(jobs)
      const out = []
      for (const s of settled) if (s.status === 'fulfilled') out.push(...s.value)
      setSearchResults(out.slice(0, 60))
      if (out.length === 0 && settled.every((s) => s.status === 'rejected')) setSearchErr(true)
    } catch { setSearchErr(true) }
    setSearching(false)
  }

  function changeTranslation(v) {
    setTranslation(v)
    saveTranslationPref(v)
  }
  function changeReciter(v) {
    setReciter(v)
    saveReciter(v)
    stopAudio()
  }

  // ================= LIST PAGE =================
  if (page === 'list') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
          <div className="flex gap-1">
            <button onClick={() => setPage('search')} className="p-2" aria-label={t(lang, 'searchQuran')}><Search size={19} /></button>
            <button onClick={() => setPage('bookmarks')} className="p-2" aria-label={t(lang, 'bookmarks')}><Bookmark size={19} /></button>
            <button onClick={() => setPage('khatam')} className="p-2" aria-label={t(lang, 'khatamTitle')}><CalendarRange size={19} /></button>
          </div>
        </div>
        <h2 className={`text-xl font-extrabold mt-2 ${urduCls(lang)}`}>{t(lang, 'quran')}</h2>
        <p className={`text-xs opacity-70 mt-0.5 ${urduCls(lang)}`}>{t(lang, 'quranSub')}</p>

        {lastRead && (
          <button onClick={() => openSurah(lastRead.surah, lastRead.ayah)} className="w-full mt-4 rounded-3xl border border-gold/40 bg-gold/10 p-4 text-left active:scale-[0.99]">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold text-gold ${urduCls(lang)}`}><BookOpen size={13} /> {t(lang, 'continueReading')}</span>
            <span className="block font-extrabold mt-1">{t(lang, 'surahWord')} {lastRead.name || lastRead.surah} · {t(lang, 'ayahWord')} {lastRead.ayah}</span>
          </button>
        )}

        <div className="rounded-3xl border border-gold/25 p-4 mt-3 bg-white/5">
          <div className="flex items-start gap-3">
            <Moon className="text-gold shrink-0 mt-0.5" size={19} />
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${urduCls(lang)}`}>{t(lang, 'mulkTitle')}</p>
              <p className={`text-[11px] opacity-70 mt-0.5 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'mulkSub')}</p>
              <p className="text-[11px] text-gold font-bold mt-1">{mulkStreak(mulkDates, today)} {t(lang, 'nightStreak')}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => openSurah(67)} className="flex-1 py-2.5 rounded-xl bg-gold text-black text-xs font-bold">{t(lang, 'openBtn')} — {t(lang, 'surahWord')} Al-Mulk</button>
            <button onClick={toggleMulk} aria-pressed={mulkDoneToday} className={`px-3 py-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 ${mulkDoneToday ? 'bg-gold/20 border-gold text-gold' : 'border-gold/40'}`}><Check size={13} /> {t(lang, 'readTonight')}</button>
          </div>
        </div>

        <h3 className={`font-bold text-sm mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'featuredSurahs')}</h3>
        <div className="space-y-2">
          {FEATURED.map((f) => {
            const m = (meta || []).find((s) => s.number === f.n)
            return (
              <button key={f.n} onClick={() => openSurah(f.n)} className="w-full flex items-center gap-3 rounded-2xl border border-gold/20 p-3.5 bg-white/5 text-left active:scale-[0.99]">
                <span className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 grid place-items-center text-xs font-extrabold text-gold shrink-0">{f.n}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-sm">{t(lang, 'surahWord')} {m ? m.englishName : f.n}</span>
                  <span className={`block text-[11px] opacity-60 leading-relaxed ${urduCls(lang)}`}>{t(lang, f.virtuesKey)}</span>
                </span>
                {m && <span className="font-arabic text-xl shrink-0" dir="rtl">{m.name}</span>}
              </button>
            )
          })}
        </div>

        {plan && !planDone && portion && (
          <button onClick={() => setPage('khatam')} className="w-full mt-3 rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
            <span className={`text-[11px] font-bold text-gold ${urduCls(lang)}`}>{t(lang, 'khatamTitle')} · {t(lang, 'dayLabel')} {plan.dayIndex + 1} / {plan.targetDays}</span>
            <span className="block text-sm font-bold mt-0.5">{t(lang, 'todaysPortion')}: {portion.startRef.name} {portion.startRef.ayah} → {portion.endRef.name} {portion.endRef.ayah}</span>
          </button>
        )}

        <h3 className={`font-bold text-sm mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'surahWord')} · 114</h3>
        {!meta && !metaFail && <p className="text-xs opacity-70 py-4">{t(lang, 'prayerLoading')}</p>}
        {metaFail && (
          <div className="flex items-center gap-2 py-4">
            <p className={`text-xs opacity-70 flex-1 ${urduCls(lang)}`}>{t(lang, 'quranLoadFail')}</p>
            <button onClick={() => setMetaReload((k) => k + 1)} className="px-2.5 py-1.5 rounded-full border border-gold/40 text-[11px] font-bold shrink-0">{t(lang, 'retry')}</button>
          </div>
        )}
        <div className="space-y-2">
          {(meta || []).map((s) => {
            const mem = memorisedBySurah[s.number] || 0
            return (
              <button key={s.number} onClick={() => openSurah(s.number)} className="w-full flex items-center gap-3 rounded-2xl border border-gold/20 p-3.5 bg-white/5 text-left active:scale-[0.99]">
                <span className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 grid place-items-center text-xs font-extrabold text-gold shrink-0">{s.number}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-sm truncate">{s.englishName}</span>
                  <span className="block text-[11px] opacity-60">{s.numberOfAyahs} {t(lang, 'ayahs')} · {s.revelationType === 'Meccan' ? t(lang, 'makki') : t(lang, 'madani')}</span>
                  {mem > 0 && (
                    <span className="block mt-1.5">
                      <span className="block h-1.5 rounded-full bg-white/10 overflow-hidden"><span className="block h-full bg-gold" style={{ width: `${Math.min(100, (mem / s.numberOfAyahs) * 100)}%` }} /></span>
                      <span className="block text-[10px] text-gold mt-0.5">{mem}/{s.numberOfAyahs} {t(lang, 'memorisedProgress')}</span>
                    </span>
                  )}
                </span>
                <span className="font-arabic text-xl shrink-0" dir="rtl">{s.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ================= SEARCH PAGE =================
  if (page === 'search') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <button onClick={() => setPage('list')} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
        <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, 'searchQuran')}</h2>
        <div className="flex gap-2 mt-3">
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') runSearch() }} placeholder={t(lang, 'searchQuranPh')} className="flex-1 min-w-0 rounded-2xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold" />
          <button onClick={runSearch} disabled={searching || !searchText.trim()} className="px-4 py-2.5 rounded-2xl bg-gold text-black text-sm font-bold disabled:opacity-40">{t(lang, 'searchQuran').split(' ')[0]}</button>
        </div>
        {searching && <p className="text-xs opacity-70 mt-4">{t(lang, 'searchingLabel')}</p>}
        {searchErr && <p className={`text-xs text-amber-400 mt-4 ${urduCls(lang)}`}>{t(lang, 'searchNeedsNet')}</p>}
        {searchResults && !searching && (
          <div className="space-y-2 mt-4">
            {searchResults.length === 0 && <p className={`text-sm opacity-70 text-center py-6 ${urduCls(lang)}`}>{t(lang, 'noSearchResults')}</p>}
            {searchResults.map((r, i) => (
              <button key={`${r.surah}-${r.ayah}-${r.edition}-${i}`} onClick={() => openSurah(r.surah, r.ayah)} className="w-full rounded-2xl border border-gold/20 p-3.5 bg-white/5 text-left active:scale-[0.99]">
                <span className="text-[11px] font-bold text-gold">{t(lang, 'surahWord')} {r.surahName} ({r.surah}) · {t(lang, 'ayahWord')} {r.ayah}</span>
                <span className={`block text-sm mt-1 leading-relaxed ${r.edition === 'quran-uthmani' ? 'font-arabic text-lg' : ''} ${r.edition === 'ur.jalandhry' ? 'font-urdu' : ''}`} dir={r.edition === 'quran-uthmani' || r.edition === 'ur.jalandhry' ? 'rtl' : 'ltr'}>{r.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ================= BOOKMARKS PAGE =================
  if (page === 'bookmarks') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <button onClick={() => setPage('list')} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
        <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, 'bookmarks')}</h2>
        {bookmarks.length === 0 && <p className={`text-sm opacity-70 mt-4 ${urduCls(lang)}`}>{t(lang, 'noBookmarks')}</p>}
        <div className="space-y-2 mt-3">
          {bookmarks.map((b) => (
            <div key={`${b.surah}:${b.ayah}`} className="flex items-center gap-2 rounded-2xl border border-gold/20 p-3.5 bg-white/5">
              <button onClick={() => openSurah(b.surah, b.ayah)} className="flex-1 text-left font-bold text-sm">{t(lang, 'surahWord')} {b.name || b.surah} · {t(lang, 'ayahWord')} {b.ayah}</button>
              <button onClick={async () => { const next = bookmarks.filter((x) => !(x.surah === b.surah && x.ayah === b.ayah)); setBookmarksState(next); await setBookmarks(next) }} className="p-1.5" aria-label={t(lang, 'dismiss')}><X size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ================= KHATAM PAGE =================
  if (page === 'khatam') {
    const pct = plan ? Math.min(100, Math.round((plan.dayIndex / plan.targetDays) * 100)) : 0
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <button onClick={() => setPage('list')} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
        <h2 className={`text-xl font-extrabold mt-3 ${urduCls(lang)}`}>{t(lang, 'khatamTitle')}</h2>
        <p className={`text-xs opacity-70 mt-1 ${urduCls(lang)}`}>{t(lang, 'khatamSub')}</p>
        {!plan && (
          <KhatamSetup lang={lang} onStart={startKhatam} />
        )}
        {plan && planDone && (
          <div className="rounded-3xl border border-gold/40 bg-gold/10 p-5 mt-4 text-center">
            <Sparkles className="mx-auto text-gold" size={26} />
            <p className={`font-extrabold mt-2 ${urduCls(lang)}`}>{t(lang, 'planComplete')}</p>
            <button onClick={() => startKhatam(plan.targetDays)} className="mt-3 px-4 py-2.5 rounded-full bg-gold text-black text-xs font-bold">{t(lang, 'restartPlan')}</button>
          </div>
        )}
        {plan && !planDone && (
          <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5">
            <div className="flex items-center gap-4">
              <svg width="76" height="76" viewBox="0 0 76 76" className="shrink-0">
                <circle cx="38" cy="38" r="32" fill="none" strokeWidth="7" className="stroke-white/10" />
                <circle cx="38" cy="38" r="32" fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-gold" strokeDasharray={`${2 * Math.PI * 32}`} strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`} transform="rotate(-90 38 38)" />
                <text x="38" y="42" textAnchor="middle" className="fill-current" fontSize="15" fontWeight="800">{pct}%</text>
              </svg>
              <div>
                <p className="font-extrabold">{t(lang, 'dayLabel')} {plan.dayIndex + 1} / {plan.targetDays}</p>
                {portion && <p className="text-xs opacity-75 mt-1">{t(lang, 'todaysPortion')}: {t(lang, 'surahWord')} {portion.startRef.name} {portion.startRef.ayah} → {portion.endRef.name} {portion.endRef.ayah} · {portion.count} {t(lang, 'portionAyahs')}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {portion && <button onClick={() => openSurah(portion.startRef.surah, portion.startRef.ayah)} className="flex-1 py-3 rounded-2xl border border-gold/40 text-xs font-bold">{t(lang, 'openPortion')}</button>}
              <button onClick={advanceKhatam} className="flex-1 py-3 rounded-2xl bg-gold text-black text-xs font-bold">{t(lang, 'portionDoneBtn')}</button>
            </div>
            <button onClick={() => startKhatam(plan.targetDays)} className={`mt-3 text-[11px] opacity-60 underline ${urduCls(lang)}`}>{t(lang, 'restartPlan')}</button>
          </div>
        )}
        <p className="text-[11px] opacity-50 mt-3">{TOTAL_AYAHS} {t(lang, 'ayahs')}</p>
      </div>
    )
  }

  // ================= READER =================
  const chip = (onState, onClick, Icon, label) => (
    <button onClick={onClick} aria-pressed={onState} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-[11px] font-bold ${onState ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>
      <Icon size={12} /> {label}
    </button>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => { stopAudio(); setPage('list') }} className="inline-flex items-center gap-1 text-sm shrink-0"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
        <p className="font-extrabold text-sm truncate">{current ? `${current.number}. ${current.englishName}` : ''}</p>
        <button onClick={() => setSettingsOpen(true)} className="p-2 shrink-0" aria-label={t(lang, 'readerSettings')}><Settings2 size={18} /></button>
      </div>
      {current && <p className="font-arabic text-2xl text-center mt-1" dir="rtl">{current.name}</p>}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {chip(memoriseOn, () => setMemoriseOn(!memoriseOn), Brain, t(lang, 'memoriseMode'))}
        {chip(tajweedOn, () => { setTajweedFail(false); setTajweedOn(!tajweedOn) }, Eye, t(lang, 'tajweedLabel'))}
        {fromCache && <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full border border-gold/25 text-[10px] font-bold opacity-70 ${urduCls(lang)}`}>{t(lang, 'cachedLabel')}</span>}
      </div>
      {tajweedOn && <p className={`text-[11px] opacity-70 mt-2 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'tajweedLegend')}</p>}
      {tajweedFail && <p className={`text-[11px] text-amber-400 mt-2 ${urduCls(lang)}`}>{t(lang, 'tajweedFail')}</p>}

      {loading && <p className="text-xs opacity-70 mt-6">{t(lang, 'prayerLoading')}</p>}
      {loadFail && (
        <div className="flex items-center gap-2 mt-6">
          <p className={`text-xs opacity-70 flex-1 ${urduCls(lang)}`}>{t(lang, 'quranLoadFail')}</p>
          <button onClick={() => setCurrent({ ...current })} className="px-2.5 py-1.5 rounded-full border border-gold/40 text-[11px] font-bold shrink-0">{t(lang, 'retry')}</button>
        </div>
      )}

      {data && (
        <div className="space-y-3 mt-4">
          {data.ayahs.map((ayah, i) => {
            const mem = isMemorised(ayah)
            const hidden = memoriseOn && !mem && !revealed.has(ayah.n)
            const isPlaying = playingGlobal === ayah.global
            const tajText = tajweedOn && tajweedTexts ? tajweedTexts[i] : null
            return (
              <div key={ayah.global} id={`qayah-${ayah.n}`}
                className={`rounded-3xl border p-4 bg-white/5 ${highlight === ayah.n ? 'border-gold ring-1 ring-gold' : mem ? 'border-gold/50' : 'border-gold/15'}`}>
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/30 grid place-items-center text-[11px] font-extrabold text-gold">{ayah.n}</span>
                  <div className="flex items-center gap-1">
                    {mem && <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold text-gold ${urduCls(lang)}`}><Check size={11} /> {t(lang, 'memorisedLabel')}</span>}
                    <button onClick={() => playAyah(ayah)} className="p-2" aria-label={t(lang, 'playAyah')}>{isPlaying ? <Pause size={16} className="text-gold" /> : <Play size={16} />}</button>
                    <button onClick={() => { setSheet(ayah); touchAyah(ayah) }} className="p-2" aria-label={t(lang, 'bookmarkAyah')}>
                      {isBookmarked(current.number, ayah.n) ? <BookmarkCheck size={16} className="text-gold" /> : <Bookmark size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    touchAyah(ayah)
                    if (hidden) setRevealed((s) => new Set(s).add(ayah.n))
                    else setSheet(ayah)
                  }}
                  className="w-full text-right mt-1"
                  aria-label={hidden ? t(lang, 'tapToReveal') : ayah.n}
                >
                  {tajText ? (
                    <span className="font-arabic block" dir="rtl" style={{ fontSize: 26, filter: hidden ? 'blur(7px)' : 'none' }}>
                      {parseTajweed(tajText).map((seg, si) => (
                        <span key={si} style={seg.rule ? { color: TAJWEED_COLORS[seg.rule] || '#D4AF37' } : undefined}>{seg.text}</span>
                      ))}
                    </span>
                  ) : (
                    <span className="font-arabic block" dir="rtl" style={{ fontSize: 26, filter: hidden ? 'blur(7px)' : 'none', userSelect: hidden ? 'none' : 'auto' }}>{ayah.arabic}</span>
                  )}
                  {hidden && <span className={`block text-center text-[11px] font-bold text-gold mt-1 ${urduCls(lang)}`}>{t(lang, 'tapToReveal')}</span>}
                </button>
                {ayah.translation && !memoriseOn && (
                  <p className={`mt-3 text-sm leading-relaxed ${translation === 'ur.jalandhry' ? 'font-urdu text-right' : ''}`} dir={translation === 'ur.jalandhry' ? 'rtl' : 'ltr'}>{ayah.translation}</p>
                )}
                {memoriseOn && (
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => setRepeats((r) => ({ ...r, [ayah.n]: (r[ayah.n] || 0) + 1 }))} className="px-3 py-2 rounded-full border border-gold/40 text-[11px] font-bold">
                      {t(lang, 'repeatLabel')} · {repeats[ayah.n] || 0}
                    </button>
                    <button onClick={() => toggleMemorised(ayah)} className={`px-3 py-2 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${mem ? 'bg-gold/20 border border-gold text-gold' : 'bg-gold text-black'}`}>
                      <Check size={12} /> {mem ? t(lang, 'memorisedLabel') : t(lang, 'markMemorised')}
                    </button>
                    {hidden && <button onClick={() => setRevealed((s) => new Set(s).add(ayah.n))} className="px-3 py-2 rounded-full border border-gold/40 text-[11px] font-bold inline-flex items-center gap-1"><Eye size={12} /> {t(lang, 'tapToReveal')}</button>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Ayah detail sheet (item 1 layer) */}
      {sheet && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setSheet(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[82vh] overflow-y-auto rounded-t-3xl border-t border-gold/30 bg-[#fffdf8] dark:bg-[#0a3527] p-5">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-sm">{current.englishName} · {t(lang, 'ayahWord')} {sheet.n}</p>
              <button onClick={() => setSheet(null)} className="p-1.5" aria-label={t(lang, 'closeBtn')}><X size={17} /></button>
            </div>
            <p className="font-arabic text-right mt-3" dir="rtl" style={{ fontSize: 26 }}>{sheet.arabic}</p>
            {sheet.transliteration && (
              <>
                <p className="text-[11px] font-bold text-gold mt-4">{t(lang, 'translitLabel')}</p>
                <p className="text-sm leading-relaxed mt-0.5">{sheet.transliteration}</p>
              </>
            )}
            {sheet.translation && (
              <>
                <p className="text-[11px] font-bold text-gold mt-4">{t(lang, 'translationLabel')}</p>
                <p className={`text-sm leading-relaxed mt-0.5 ${translation === 'ur.jalandhry' ? 'font-urdu text-right' : ''}`} dir={translation === 'ur.jalandhry' ? 'rtl' : 'ltr'}>{sheet.translation}</p>
              </>
            )}
            <div className="flex flex-wrap gap-2 mt-5">
              <button onClick={() => playAyah(sheet)} className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gold text-black text-xs font-bold">
                {playingGlobal === sheet.global ? <Pause size={13} /> : <Play size={13} />} {t(lang, 'playAyah')}
              </button>
              <button onClick={() => toggleBookmark(sheet)} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-gold/40 text-xs font-bold">
                {isBookmarked(current.number, sheet.n) ? <BookmarkCheck size={13} className="text-gold" /> : <Bookmark size={13} />} {t(lang, 'bookmarkAyah')}
              </button>
              <button onClick={() => toggleMemorised(sheet)} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-gold/40 text-xs font-bold">
                <Check size={13} /> {isMemorised(sheet) ? t(lang, 'memorisedLabel') : t(lang, 'markMemorised')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader settings sheet (items 9 + 10) */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setSettingsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-t-3xl border-t border-gold/30 p-5 bg-[#062C22] text-[#f5f1e6]">
            <div className="flex items-center justify-between">
              <p className={`font-extrabold ${urduCls(lang)}`}>{t(lang, 'readerSettings')}</p>
              <button onClick={() => setSettingsOpen(false)} className="p-1.5" aria-label={t(lang, 'closeBtn')}><X size={17} /></button>
            </div>
            <p className={`text-xs font-bold mt-4 mb-2 ${urduCls(lang)}`}>{t(lang, 'translationLabel')}</p>
            <div className="space-y-2">
              {TRANSLATIONS.map((tr) => (
                <button key={tr.id} onClick={() => changeTranslation(tr.id)} aria-pressed={translation === tr.id}
                  className={`w-full text-left rounded-2xl border px-3.5 py-3 text-sm font-bold ${translation === tr.id ? 'border-gold bg-gold/10' : 'border-gold/25'}`}>
                  {tr.id === 'none' ? t(lang, 'translationNone') : tr.label}
                </button>
              ))}
            </div>
            <p className={`text-xs font-bold mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'reciterLabel')}</p>
            <div className="space-y-2">
              {RECITERS.map((r) => (
                <button key={r.id} onClick={() => changeReciter(r.id)} aria-pressed={reciter === r.id}
                  className={`w-full text-left rounded-2xl border px-3.5 py-3 text-sm font-bold ${reciter === r.id ? 'border-gold bg-gold/10' : 'border-gold/25'}`}>
                  {r.name}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mt-5">
              <span className={`text-sm font-bold ${urduCls(lang)}`}>{t(lang, 'autoAdvance')}</span>
              <button onClick={() => setAutoAdvance(!autoAdvance)} aria-pressed={autoAdvance} className={`px-3 py-1.5 rounded-full border text-xs font-bold ${autoAdvance ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>{autoAdvance ? t(lang, 'on') : t(lang, 'off')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KhatamSetup({ lang, onStart }) {
  const [days, setDays] = useState(30)
  const [custom, setCustom] = useState('')
  const customNum = Math.max(1, Math.min(3650, Math.floor(Number(custom) || 0)))
  return (
    <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5">
      <p className={`text-sm font-bold ${urduCls(lang)}`}>{t(lang, 'targetDaysLabel')}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {[30, 60, 90, 120].map((d) => (
          <button key={d} onClick={() => { setDays(d); setCustom('') }} aria-pressed={days === d && !custom} className={`px-4 py-2 rounded-full border text-xs font-bold ${days === d && !custom ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>{d}</button>
        ))}
      </div>
      <input value={custom} onChange={(e) => setCustom(e.target.value)} type="number" min="1" max="3650" placeholder={t(lang, 'customDaysLabel')} className="w-full mt-3 rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold" />
      <button onClick={() => onStart(custom ? customNum : days)} className="w-full mt-4 py-3 rounded-2xl bg-gold text-black font-bold text-sm inline-flex items-center justify-center gap-1.5">
        <ListOrdered size={15} /> {t(lang, 'startPlan')}
      </button>
    </div>
  )
}
