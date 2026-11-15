import React from 'react'
import { CATEGORIES } from '../data/wazifaData'
import { categoryLabel } from '../lib/i18n'
export default function CategoryPills({ active, onSelect, lang = 'en' }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
      {CATEGORIES.map((c) => (
        <button key={c} onClick={() => onSelect(c)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border ${active === c ? 'bg-gold text-black border-gold' : 'border-gold/30 opacity-80'} ${lang === 'ur' ? 'font-urdu' : ''}`}>{categoryLabel(lang, c)}</button>
      ))}
    </div>
  )
}
