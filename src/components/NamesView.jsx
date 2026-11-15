import React, { useMemo, useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
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

export default function NamesView({ routines, onRoutineChange, lang = 'en' }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return namesData
    return namesData.filter((n) => n.transliteration.toLowerCase().includes(q) || n.english.toLowerCase().includes(q) || n.arabic.includes(query.trim()) || n.urdu.includes(query.trim()))
  }, [query])

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
        </div>
        <TasbihCounter wazifa={w} routine={routines[w.id]} onRoutineChange={onRoutineChange} lang={lang} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <h2 className={`text-lg font-extrabold ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'namesTitle')}</h2>
      <p className="text-xs opacity-70 mt-0.5">{t(lang, 'namesSub')}</p>
      <div className="relative mt-3">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t(lang, 'searchNames')} className="w-full rounded-2xl border border-gold/25 bg-white/5 py-3 pl-10 pr-3 text-sm outline-none focus:border-gold" />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {filtered.map((n) => (
          <button key={n.n} onClick={() => setSelected(n)} className="rounded-2xl border border-gold/20 bg-white/5 p-3 text-center active:scale-[0.98]">
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
