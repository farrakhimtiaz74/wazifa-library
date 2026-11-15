import React, { useState } from 'react'
import { Bookmark, BookmarkCheck, Check, Clock, Share2 } from 'lucide-react'
import { shareWazifa } from '../lib/share'
import { categoryLabel, t } from '../lib/i18n'

export default function WazifaCard({ wazifa, routine, onOpen, onToggleBookmark, lang = 'en' }) {
  const [copied, setCopied] = useState(false)
  const pct = routine && routine.target_count ? Math.min(100, Math.round(((routine.current_count || 0) / routine.target_count) * 100)) : 0

  async function handleShare(e) {
    e.stopPropagation()
    const r = await shareWazifa(wazifa)
    if (r === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <article className="rounded-2xl border border-gold/20 p-4 bg-white/5 cursor-pointer active:scale-[0.99]" onClick={() => onOpen(wazifa)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-sm">{wazifa.title}</h3>
          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 ${lang === 'ur' ? 'font-urdu' : ''}`}>{categoryLabel(lang, wazifa.category)}</span>
        </div>
        <div className="flex items-center shrink-0">
          <button onClick={handleShare} className="p-1.5" aria-label={t(lang, 'share')}>
            {copied ? <Check size={19} className="text-gold" /> : <Share2 size={19} className="opacity-60" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(wazifa) }} className="p-1.5" aria-label={t(lang, 'bookmarkLabel')}>
            {routine?.is_bookmarked ? <BookmarkCheck size={20} className="text-gold" /> : <Bookmark size={20} className="opacity-60" />}
          </button>
        </div>
      </div>
      <p className="font-arabic text-xl mt-3 line-clamp-2" dir="rtl">{wazifa.arabic}</p>
      {copied && <p className="text-[11px] text-gold font-bold mt-1.5">{t(lang, 'copied')} {t(lang, 'readyToPaste')}</p>}
      <div className="flex items-center gap-3 mt-3 text-[11px] opacity-70">
        <span className="inline-flex items-center gap-1"><Clock size={12} />{wazifa.recommended_time}</span>
        <span>{t(lang, 'targetLabel')} {wazifa.target_count}x</span>
        {routine?.lifetime_count > 0 && <span className="text-gold font-semibold">{t(lang, 'lifetime')}: {routine.lifetime_count.toLocaleString()}</span>}
      </div>
      {routine?.is_bookmarked && <div className="mt-2 h-1.5 rounded-full bg-black/20 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>}
    </article>
  )
}
