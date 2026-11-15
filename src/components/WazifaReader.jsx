import React, { useEffect, useState } from 'react'
import { ArrowLeft, Bookmark, BookmarkCheck, Check, MessageCircle, Minus, Plus, Share2, ShieldCheck } from 'lucide-react'
import { getSetting, setSetting } from '../lib/db'
import { shareWazifa, whatsAppShareUrl } from '../lib/share'
import TasbihCounter from './TasbihCounter'

const FONT_KEY = 'wl-arabic-font-size'
const FONT_MIN = 24
const FONT_MAX = 48

function loadFontSize() {
  try {
    const v = Number(localStorage.getItem(FONT_KEY))
    if (v >= FONT_MIN && v <= FONT_MAX) return v
  } catch { /* storage unavailable */ }
  return 30
}

export default function WazifaReader({ wazifa, routine, onBack, onToggleBookmark, onRoutineChange }) {
  const [showTranslit, setShowTranslit] = useState(true)
  const [showEnglish, setShowEnglish] = useState(true)
  const [showUrdu, setShowUrdu] = useState(true)
  const [fontSize, setFontSize] = useState(loadFontSize)
  const [shareState, setShareState] = useState('')

  useEffect(() => {
    getSetting('preferences', {}).then((p) => {
      if (typeof p.show_transliteration === 'boolean') setShowTranslit(p.show_transliteration)
      if (typeof p.show_english === 'boolean') setShowEnglish(p.show_english)
      if (typeof p.show_urdu === 'boolean') setShowUrdu(p.show_urdu)
    })
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

  const toggleCls = (on) => `px-2.5 py-1 rounded-full text-[11px] border ${on ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-70'}`

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> Back</button>
        <div className="flex items-center gap-1">
          <button onClick={handleShare} className="p-2" aria-label="Share or copy this Wazifa">{shareState ? <Check size={19} className="text-gold" /> : <Share2 size={19} />}</button>
          <a href={whatsAppShareUrl(wazifa)} target="_blank" rel="noreferrer" className="p-2" aria-label="Share on WhatsApp"><MessageCircle size={19} /></a>
          <button onClick={() => onToggleBookmark(wazifa)} className="p-2" aria-label="Bookmark">{routine?.is_bookmarked ? <BookmarkCheck className="text-gold" /> : <Bookmark />}</button>
        </div>
      </div>
      {shareState && <p className="text-right text-[11px] text-gold font-bold mt-0.5">{shareState} — ready to paste anywhere</p>}
      <h2 className="text-xl font-extrabold mt-3">{wazifa.title}</h2>
      <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
        <span className="px-2 py-1 rounded-full bg-gold/15 text-gold border border-gold/30">{wazifa.category}</span>
        <span className="px-2 py-1 rounded-full border border-gold/20">{wazifa.recommended_time}</span>
        <span className="px-2 py-1 rounded-full border border-gold/20">Target {wazifa.target_count}x</span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-400"><ShieldCheck size={14} /><span>Reference: {wazifa.reference}</span></div>

      <div className="sticky top-[65px] z-30 -mx-4 px-4 py-2.5 mt-4 bg-[#FAF8F5]/95 dark:bg-[#062C22]/95 backdrop-blur border-y border-gold/20">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { setShowTranslit(!showTranslit); persist({ show_transliteration: !showTranslit }) }} className={toggleCls(showTranslit)} aria-pressed={showTranslit}>Transliteration</button>
          <button onClick={() => { setShowEnglish(!showEnglish); persist({ show_english: !showEnglish }) }} className={toggleCls(showEnglish)} aria-pressed={showEnglish}>English</button>
          <button onClick={() => { setShowUrdu(!showUrdu); persist({ show_urdu: !showUrdu }) }} className={toggleCls(showUrdu)} aria-pressed={showUrdu}>Urdu</button>
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
      <TasbihCounter wazifa={wazifa} routine={routine} onRoutineChange={onRoutineChange} />
    </div>
  )
}
