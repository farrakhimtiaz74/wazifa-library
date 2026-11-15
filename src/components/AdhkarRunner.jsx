import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Pause, Play, Share2 } from 'lucide-react'
import TasbihCounter from './TasbihCounter'
import { getSetting, setSetting, todayLocal } from '../lib/db'

export default function AdhkarRunner({ set, routines, onRoutineChange, onBack, lang = 'en' }) {
  const items = set.items
  const [index, setIndex] = useState(0)
  const [doneMap, setDoneMap] = useState({})
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [countdown, setCountdown] = useState(null)
  const [finished, setFinished] = useState(false)
  const [shareState, setShareState] = useState('')
  const startRef = useRef(Date.now())
  const timerRef = useRef(null)

  const item = items[index]
  const synthetic = useMemo(() => ({
    id: `adhkar-${set.id}-${index}`,
    title: item.title,
    category: 'Daily Adhkar',
    arabic: item.arabic,
    transliteration: item.transliteration,
    english_translation: item.english_translation,
    urdu_translation: item.urdu_translation,
    target_count: item.count,
    recommended_time: set.timeLabel || (set.id === 'morning' ? 'Morning' : set.id === 'evening' ? 'Evening' : 'Any Time'),
    reference: item.reference || '',
    instructions: '',
    keywords: []
  }), [item, index, set.id])

  const doneCount = Object.values(doneMap).filter(Boolean).length
  const totalCount = items.reduce((s, i) => s + (i.count || 1), 0)

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  function goTo(i) {
    if (timerRef.current) clearInterval(timerRef.current)
    setCountdown(null)
    setIndex(Math.max(0, Math.min(items.length - 1, i)))
  }

  async function finishSet() {
    setFinished(true)
    const today = todayLocal()
    const prev = await getSetting('adhkar_completions', [])
    await setSetting('adhkar_completions', [...prev.filter((c) => !(c.set === set.id && c.date === today)), { set: set.id, date: today, at: new Date().toISOString() }])
  }

  function handleComplete() {
    setDoneMap((m) => ({ ...m, [index]: true }))
    if (index >= items.length - 1) { finishSet(); return }
    if (!autoAdvance) return
    let remain = 2.0
    setCountdown(remain)
    timerRef.current = setInterval(() => {
      remain = Math.round((remain - 0.1) * 10) / 10
      if (remain <= 0) {
        clearInterval(timerRef.current)
        setCountdown(null)
        setIndex((i) => Math.min(items.length - 1, i + 1))
      } else setCountdown(remain)
    }, 100)
  }

  function pauseCountdown() {
    if (timerRef.current) clearInterval(timerRef.current)
    setCountdown(null)
  }

  async function shareSummary() {
    const mins = Math.max(1, Math.round((Date.now() - startRef.current) / 60000))
    const text = `${set.titleEn} (${set.title}) — completed Alhamdulillah!\n${items.length} adhkar · ${totalCount} total recitations · about ${mins} min\n\n— via Wazifa Library\nhttps://farrakhimtiaz74.github.io/wazifa-library/`
    if (navigator.share) {
      try { await navigator.share({ title: set.titleEn, text }); return } catch (err) { if (err && err.name === 'AbortError') return }
    }
    try { await navigator.clipboard.writeText(text); setShareState('Copied!'); setTimeout(() => setShareState(''), 2000) } catch { /* clipboard unavailable */ }
  }

  if (finished) {
    const mins = Math.max(1, Math.round((Date.now() - startRef.current) / 60000))
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {lang === 'ur' ? 'واپس' : 'Back'}</button>
        <div className="rounded-3xl border border-gold/30 p-6 mt-6 bg-gold/10 text-center">
          <span className="mx-auto w-14 h-14 rounded-full bg-gold text-black grid place-items-center"><Check size={28} /></span>
          <h2 className="text-xl font-extrabold mt-3">{set.titleEn} Complete — Alhamdulillah!</h2>
          <p className="text-sm opacity-80 mt-2">{items.length} adhkar · {totalCount} total recitations · about {mins} min</p>
          <p className="font-urdu text-base mt-3" dir="rtl">اللہ قبول فرمائے۔ آمین</p>
          <button onClick={shareSummary} className="mt-5 px-5 py-2.5 rounded-full bg-gold text-black text-sm font-bold inline-flex items-center gap-1.5"><Share2 size={15} /> Share {shareState && `· ${shareState}`}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {lang === 'ur' ? 'واپس' : 'Back'}</button>
        <span className="text-xs font-bold opacity-80">{index + 1} of {items.length} · {doneCount} done</span>
      </div>
      <h2 className="text-lg font-extrabold mt-2">{set.titleEn} <span className="font-urdu text-base font-semibold" dir="rtl">{set.title}</span></h2>
      <div className="h-2 rounded-full bg-black/25 mt-2 overflow-hidden"><div className="h-full bg-gold transition-all" style={{ width: `${Math.round(((index) / items.length) * 100)}%` }} /></div>

      <div className="flex items-center justify-between mt-3 text-xs">
        <button onClick={() => setAutoAdvance(!autoAdvance)} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border ${autoAdvance ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-70'}`} aria-pressed={autoAdvance}>
          {autoAdvance ? <Play size={12} /> : <Pause size={12} />} Auto-advance {autoAdvance ? 'On' : 'Off'}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => goTo(index - 1)} disabled={index === 0} className="p-2 rounded-full border border-gold/30 disabled:opacity-30" aria-label="Previous dhikr"><ChevronLeft size={15} /></button>
          <button onClick={() => goTo(index + 1)} disabled={index >= items.length - 1} className="p-2 rounded-full border border-gold/30 disabled:opacity-30" aria-label="Next dhikr"><ChevronRight size={15} /></button>
        </div>
      </div>

      {countdown !== null && (
        <button onClick={pauseCountdown} className="w-full mt-3 py-2.5 rounded-2xl bg-gold/15 border border-gold/40 text-gold text-sm font-bold">
          Next in {countdown.toFixed(1)}s… tap to pause
        </button>
      )}

      <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold">{item.title}</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 shrink-0">x{item.count}</span>
        </div>
        {item.reference && <p className="text-[11px] opacity-60 mt-1">{item.reference}</p>}
        <p className="font-arabic text-center mt-3" dir="rtl" style={{ fontSize: 30 }}>{item.arabic}</p>
        {item.transliteration && <p className="mt-4 text-sm leading-relaxed italic opacity-90">{item.transliteration}</p>}
        {item.english_translation && <p className="mt-3 text-sm leading-relaxed">{item.english_translation}</p>}
        {item.urdu_translation && <p className="font-urdu mt-3 text-base text-right" dir="rtl">{item.urdu_translation}</p>}
      </div>

      <TasbihCounter key={synthetic.id} wazifa={synthetic} routine={routines[synthetic.id]} onRoutineChange={onRoutineChange} lang={lang} onComplete={handleComplete} />
    </div>
  )
}
