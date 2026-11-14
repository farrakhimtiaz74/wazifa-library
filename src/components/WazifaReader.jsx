import React, { useEffect, useState } from 'react'
import { ArrowLeft, Bookmark, BookmarkCheck, Minus, Plus, ShieldCheck } from 'lucide-react'
import { getSetting, setSetting } from '../lib/db'
import TasbihCounter from './TasbihCounter'

export default function WazifaReader({ wazifa, routine, onBack, onToggleBookmark, onRoutineChange }) {
  const [showTranslit, setShowTranslit] = useState(true)
  const [showEnglish, setShowEnglish] = useState(true)
  const [showUrdu, setShowUrdu] = useState(true)
  const [fontSize, setFontSize] = useState(30)

  useEffect(() => {
    getSetting('preferences', {}).then((p) => {
      if (p.arabic_font_size) setFontSize(p.arabic_font_size)
      if (typeof p.show_transliteration === 'boolean') setShowTranslit(p.show_transliteration)
      if (typeof p.show_english === 'boolean') setShowEnglish(p.show_english)
      if (typeof p.show_urdu === 'boolean') setShowUrdu(p.show_urdu)
    })
  }, [])

  async function persist(patch) {
    const p = await getSetting('preferences', {})
    await setSetting('preferences', { ...p, ...patch })
  }
  function changeFont(delta) { const n = Math.min(52, Math.max(20, fontSize + delta)); setFontSize(n); persist({ arabic_font_size: n }) }

  const Toggle = ({ label, val, set }) => (
    <button onClick={() => { set(!val); persist({ [`show_${label.toLowerCase()}`]: !val }) }} className={`px-2.5 py-1 rounded-full text-[11px] border ${val ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-70'}`}>{label}</button>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> Back</button>
        <button onClick={() => onToggleBookmark(wazifa)} className="p-2">{routine?.is_bookmarked ? <BookmarkCheck className="text-gold" /> : <Bookmark />}</button>
      </div>
      <h2 className="text-xl font-extrabold mt-3">{wazifa.title}</h2>
      <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
        <span className="px-2 py-1 rounded-full bg-gold/15 text-gold border border-gold/30">{wazifa.category}</span>
        <span className="px-2 py-1 rounded-full border border-gold/20">{wazifa.recommended_time}</span>
        <span className="px-2 py-1 rounded-full border border-gold/20">Target {wazifa.target_count}x</span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-400"><ShieldCheck size={14} /><span>Reference: {wazifa.reference}</span></div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Toggle label="Transliteration" val={showTranslit} set={(v) => { setShowTranslit(v); persist({ show_transliteration: v }) }} />
        <button onClick={() => { setShowEnglish(!showEnglish); persist({ show_english: !showEnglish }) }} className={`px-2.5 py-1 rounded-full text-[11px] border ${showEnglish ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-70'}`}>English</button>
        <button onClick={() => { setShowUrdu(!showUrdu); persist({ show_urdu: !showUrdu }) }} className={`px-2.5 py-1 rounded-full text-[11px] border ${showUrdu ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-70'}`}>Urdu</button>
        <span className="ml-auto inline-flex items-center gap-1">
          <button onClick={() => changeFont(-2)} className="p-1.5 border border-gold/30 rounded-full"><Minus size={13} /></button>
          <span className="text-xs font-bold">A</span>
          <button onClick={() => changeFont(2)} className="p-1.5 border border-gold/30 rounded-full"><Plus size={13} /></button>
        </span>
      </div>
      <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5">
        <p className="font-arabic leading-loose text-center" dir="rtl" style={{ fontSize }}>{wazifa.arabic}</p>
        {showTranslit && <p className="mt-5 text-sm leading-relaxed italic opacity-90">{wazifa.transliteration}</p>}
        {showEnglish && <p className="mt-3 text-sm leading-relaxed">{wazifa.english_translation}</p>}
        {showUrdu && <p className="font-urdu mt-4 text-base leading-loose text-right" dir="rtl">{wazifa.urdu_translation}</p>}
      </div>
      {wazifa.instructions && <p className="mt-4 text-sm leading-relaxed opacity-85">{wazifa.instructions}</p>}
      <TasbihCounter wazifa={wazifa} routine={routine} onRoutineChange={onRoutineChange} />
    </div>
  )
}
