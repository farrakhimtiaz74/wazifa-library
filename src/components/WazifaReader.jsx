import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Bookmark, BookmarkCheck, Check, Headphones, ImageDown, Maximize2, MessageCircle, Minimize2, Minus, Plus, Share2, ShieldCheck, Square, Target } from 'lucide-react'
import { db, getSetting, queueSync, setSetting, todayLocal } from '../lib/db'
import { syncNow } from '../lib/sync'
import { shareWazifa, whatsAppShareUrl } from '../lib/share'
import { shareOrDownloadImageCard } from '../lib/imageCard'
import { categoryLabel, t } from '../lib/i18n'
import TasbihCounter from './TasbihCounter'
import WakeLockButton from './WakeLockButton'

const FONT_KEY = 'wl-arabic-font-size'
const FONT_MIN = 24
const FONT_MAX = 48
const TARGET_PRESETS = [33, 100, 313, 450, 1000]

function loadFontSize() {
  try {
    const v = Number(localStorage.getItem(FONT_KEY))
    if (v >= FONT_MIN && v <= FONT_MAX) return v
  } catch { /* storage unavailable */ }
  return 30
}

export default function WazifaReader({ wazifa, routine, onBack, onToggleBookmark, onRoutineChange, lang = 'en', freeMode = false }) {
  const [showTranslit, setShowTranslit] = useState(true)
  const [showEnglish, setShowEnglish] = useState(true)
  const [showUrdu, setShowUrdu] = useState(true)
  const [fontSize, setFontSize] = useState(loadFontSize)
  const [shareState, setShareState] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [toast, setToast] = useState('')
  const [targetOpen, setTargetOpen] = useState(false)
  const [customTarget, setCustomTarget] = useState('')
  const [cardState, setCardState] = useState('')
  const [focus, setFocus] = useState(false)
  const chunksRef = useRef([])

  useEffect(() => {
    getSetting('preferences', {}).then((p) => {
      if (typeof p.show_transliteration === 'boolean') setShowTranslit(p.show_transliteration)
      if (typeof p.show_english === 'boolean') setShowEnglish(p.show_english)
      if (typeof p.show_urdu === 'boolean') setShowUrdu(p.show_urdu)
    })
    return () => { try { window.speechSynthesis && window.speechSynthesis.cancel() } catch { /* no speech */ } }
  }, [])

  async function persist(patch) {
    const p = await getSetting('preferences', {})
    await setSetting('preferences', { ...p, ...patch })
  }

  function applyFontSize(n) {
    const v = Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(n)))
    setFontSize(v)
    try { localStorage.setItem(FONT_KEY, String(v)) } catch { /* storage unavailable */ }
    persist({ arabic_font_size: v })
  }

  async function handleShare() {
    const r = await shareWazifa(wazifa)
    if (r === 'copied') { setShareState('Copied!'); setTimeout(() => setShareState(''), 2000) }
  }

  async function handleImageCard() {
    setCardState('…')
    const r = await shareOrDownloadImageCard(wazifa)
    setCardState(r === 'downloaded' ? 'Saved!' : r === 'shared' ? 'Shared!' : '')
    setTimeout(() => setCardState(''), 2500)
  }

  async function applyTarget(n) {
    const v = Math.max(1, Math.floor(Number(n) || 0))
    if (!v) return
    const cur = routine?.current_count || 0
    const row = {
      wazifa_id: wazifa.id,
      is_bookmarked: routine?.is_bookmarked || false,
      current_count: cur,
      target_count: v,
      completed_today: cur >= v,
      rounds_today: routine?.rounds_today || 0,
      lifetime_count: routine?.lifetime_count || 0,
      last_reset_date: todayLocal(),
      updated_at: new Date().toISOString()
    }
    await db.routines.put(row)
    await queueSync('routine', row)
    onRoutineChange && onRoutineChange(row)
    syncNow()
    setTargetOpen(false)
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function stopSpeaking() {
    chunksRef.current = []
    try { window.speechSynthesis.cancel() } catch { /* no speech */ }
    setSpeaking(false)
  }

  function listen() {
    if (speaking) { stopSpeaking(); return }
    const synth = window.speechSynthesis
    if (!synth) { showToast('No Arabic voice on this device'); return }
    const text = String(wazifa.arabic || '').replace(/[۝۞ۚۖۗ]/g, ' ')
    const chunks = text.split(/(?<=[.۔:؛!؟,،])\s+/).map((s) => s.trim()).filter(Boolean)
    const queue = chunks.length ? chunks : [text]
    chunksRef.current = queue
    const voices = synth.getVoices()
    const arVoice = voices.find((v) => /^ar/i.test(v.lang))
    let idx = 0
    setSpeaking(true)
    const speakNext = () => {
      if (idx >= chunksRef.current.length || idx >= queue.length) { setSpeaking(false); return }
      const u = new SpeechSynthesisUtterance(queue[idx])
      u.lang = 'ar-SA'
      if (arVoice) u.voice = arVoice
      u.rate = 0.85
      u.onend = () => { idx += 1; speakNext() }
      u.onerror = () => { setSpeaking(false) }
      synth.speak(u)
    }
    speakNext()
    setTimeout(() => {
      const vs = synth.getVoices()
      if (!vs.some((v) => /^ar/i.test(v.lang))) showToast('No Arabic voice on this device — using default voice')
    }, 600)
  }

  const effectiveTarget = routine?.target_count || wazifa.target_count
  const toggleCls = (on) => `px-2.5 py-1 rounded-full text-[11px] border ${on ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-70'}`

  if (focus) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28 min-h-screen flex flex-col">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold text-gold uppercase tracking-wider ${lang === 'ur' ? 'font-urdu normal-case tracking-normal' : ''}`}>{t(lang, 'focusMode')}</span>
          <span className="inline-flex items-center gap-1.5">
            <WakeLockButton lang={lang} />
            <button onClick={() => setFocus(false)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold text-black text-[11px] font-bold" aria-label={t(lang, 'exitFocus')}>
              <Minimize2 size={12} /> {t(lang, 'exitFocus')}
            </button>
          </span>
        </div>
        <h2 className="text-lg font-extrabold mt-4 text-center">{wazifa.title}</h2>
        <div className="rounded-3xl border border-gold/25 p-6 mt-4 bg-white/5 flex-1 flex items-center justify-center">
          <p className="font-arabic text-center" dir="rtl" style={{ fontSize: Math.max(fontSize, 34) }}>{wazifa.arabic}</p>
        </div>
        <TasbihCounter wazifa={wazifa} routine={routine} onRoutineChange={onRoutineChange} freeMode={freeMode} lang={lang} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
        <div className="flex items-center gap-1">
          <button onClick={listen} className="p-2" aria-label={speaking ? t(lang, 'stop') : t(lang, 'listen')} title={speaking ? t(lang, 'stop') : t(lang, 'listen')}>
            {speaking ? <Square size={18} className="text-gold" /> : <Headphones size={19} />}
          </button>
          <button onClick={handleImageCard} className="p-2" aria-label={t(lang, 'imageCard')} title={t(lang, 'imageCard')}>
            {cardState ? <Check size={19} className="text-gold" /> : <ImageDown size={19} />}
          </button>
          <button onClick={handleShare} className="p-2" aria-label="Share or copy this Wazifa">{shareState ? <Check size={19} className="text-gold" /> : <Share2 size={19} />}</button>
          <a href={whatsAppShareUrl(wazifa)} target="_blank" rel="noreferrer" className="p-2" aria-label="Share on WhatsApp"><MessageCircle size={19} /></a>
          <button onClick={() => onToggleBookmark(wazifa)} className="p-2" aria-label="Bookmark">{routine?.is_bookmarked ? <BookmarkCheck className="text-gold" /> : <Bookmark />}</button>
        </div>
      </div>
      {shareState && <p className="text-right text-[11px] text-gold font-bold mt-0.5">{shareState} — ready to paste anywhere</p>}
      {cardState && cardState !== '…' && <p className="text-right text-[11px] text-gold font-bold mt-0.5">{t(lang, 'imageCard')}: {cardState}</p>}
      {toast && <p className="text-right text-[11px] text-amber-400 font-bold mt-0.5">{toast}</p>}
      <h2 className="text-xl font-extrabold mt-3">{wazifa.title}</h2>
      <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
        <span className={`px-2 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 ${lang === 'ur' ? 'font-urdu' : ''}`}>{categoryLabel(lang, wazifa.category)}</span>
        <span className="px-2 py-1 rounded-full border border-gold/20">{wazifa.recommended_time}</span>
        <span className="px-2 py-1 rounded-full border border-gold/20">Target {effectiveTarget}x</span>
        {speaking && <span className="px-2 py-1 rounded-full bg-gold text-black font-bold inline-flex items-center gap-1"><Square size={10} /> {t(lang, 'listen')}…</span>}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-400"><ShieldCheck size={14} /><span>Reference: {wazifa.reference}</span></div>

      {!freeMode && (
        <div className="mt-3">
          <button onClick={() => setTargetOpen(!targetOpen)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 text-xs font-bold" aria-expanded={targetOpen}>
            <Target size={13} /> {t(lang, 'setTarget')}: {effectiveTarget}x
          </button>
          {targetOpen && (
            <div className="mt-2 rounded-2xl border border-gold/25 p-3 bg-white/5">
              <div className="flex flex-wrap gap-2">
                {TARGET_PRESETS.map((p) => (
                  <button key={p} onClick={() => applyTarget(p)} className={`px-3 py-1.5 rounded-full text-xs border ${effectiveTarget === p ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30'}`}>{p}x</button>
                ))}
                <button onClick={() => applyTarget(wazifa.target_count)} className="px-3 py-1.5 rounded-full text-xs border border-gold/30">{t(lang, 'resetDefaultTarget')} ({wazifa.target_count}x)</button>
              </div>
              <div className="flex gap-2 mt-2">
                <input type="number" min="1" value={customTarget} onChange={(e) => setCustomTarget(e.target.value)} placeholder={t(lang, 'customTarget')} className="flex-1 min-w-0 rounded-xl border border-gold/25 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold" />
                <button onClick={() => applyTarget(customTarget)} className="px-4 py-2 rounded-xl bg-gold text-black text-xs font-bold">{t(lang, 'apply')}</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="sticky top-[65px] z-30 -mx-4 px-4 py-2.5 mt-4 bg-[#FAF8F5]/95 dark:bg-[#062C22]/95 backdrop-blur border-y border-gold/20">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { setShowTranslit(!showTranslit); persist({ show_transliteration: !showTranslit }) }} className={toggleCls(showTranslit)} aria-pressed={showTranslit}>Transliteration</button>
          <button onClick={() => { setShowEnglish(!showEnglish); persist({ show_english: !showEnglish }) }} className={toggleCls(showEnglish)} aria-pressed={showEnglish}>English</button>
          <button onClick={() => { setShowUrdu(!showUrdu); persist({ show_urdu: !showUrdu }) }} className={toggleCls(showUrdu)} aria-pressed={showUrdu}>Urdu</button>
          <button onClick={listen} className={`px-2.5 py-1 rounded-full text-[11px] border inline-flex items-center gap-1 ${speaking ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-80'}`}>
            {speaking ? <Square size={11} /> : <Headphones size={11} />} {speaking ? t(lang, 'stop') : t(lang, 'listen')}
          </button>
          <WakeLockButton lang={lang} />
          <button onClick={() => setFocus(true)} className="px-2.5 py-1 rounded-full text-[11px] border border-gold/30 opacity-80 inline-flex items-center gap-1" aria-label={t(lang, 'focusMode')}>
            <Maximize2 size={11} /> {t(lang, 'focusMode')}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => applyFontSize(fontSize - 2)} className="w-8 h-8 grid place-items-center border border-gold/30 rounded-full shrink-0" aria-label="Decrease Arabic font size"><Minus size={13} /></button>
          <span className="text-[11px] font-bold shrink-0">A−</span>
          <input type="range" min={FONT_MIN} max={FONT_MAX} step="1" value={fontSize} onChange={(e) => applyFontSize(Number(e.target.value))} className="flex-1 min-w-0 accent-[#D4AF37]" aria-label="Arabic font size" />
          <span className="text-sm font-bold shrink-0">A+</span>
          <button onClick={() => applyFontSize(fontSize + 2)} className="w-8 h-8 grid place-items-center border border-gold/30 rounded-full shrink-0" aria-label="Increase Arabic font size"><Plus size={13} /></button>
          <span className="text-[11px] opacity-70 shrink-0 w-9 text-right">{fontSize}px</span>
        </div>
      </div>

      <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5">
        <p className="font-arabic text-center" dir="rtl" style={{ fontSize }}>{wazifa.arabic}</p>
        {showTranslit && wazifa.transliteration && <p className="mt-5 text-sm leading-relaxed italic opacity-90">{wazifa.transliteration}</p>}
        {showEnglish && wazifa.english_translation && <p className="mt-3 text-sm leading-relaxed">{wazifa.english_translation}</p>}
        {showUrdu && wazifa.urdu_translation && <p className="font-urdu mt-4 text-base text-right" dir="rtl">{wazifa.urdu_translation}</p>}
      </div>
      {wazifa.instructions && <p className="mt-4 text-sm leading-relaxed opacity-85">{wazifa.instructions}</p>}
      <TasbihCounter wazifa={wazifa} routine={routine} onRoutineChange={onRoutineChange} freeMode={freeMode} lang={lang} />
      {routine?.lifetime_count > 0 && (
        <p className="text-center text-xs opacity-75 mt-3">{t(lang, 'lifetime')}: <b className="text-gold">{routine.lifetime_count.toLocaleString()}</b> · {t(lang, 'lifetimeNote')}</p>
      )}
    </div>
  )
}
