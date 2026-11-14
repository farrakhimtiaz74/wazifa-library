import React from 'react'
import { Bookmark, BookmarkCheck, Clock } from 'lucide-react'
export default function WazifaCard({ wazifa, routine, onOpen, onToggleBookmark }) {
  const pct = routine && routine.target_count ? Math.min(100, Math.round(((routine.current_count || 0) / routine.target_count) * 100)) : 0
  return (
    <article className="rounded-2xl border border-gold/20 p-4 bg-white/5 cursor-pointer active:scale-[0.99]" onClick={() => onOpen(wazifa)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm">{wazifa.title}</h3>
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">{wazifa.category}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(wazifa) }} className="p-1.5" aria-label="Bookmark">
          {routine?.is_bookmarked ? <BookmarkCheck size={20} className="text-gold" /> : <Bookmark size={20} className="opacity-60" />}
        </button>
      </div>
      <p className="font-arabic text-xl leading-loose mt-3 line-clamp-2" dir="rtl">{wazifa.arabic}</p>
      <div className="flex items-center gap-3 mt-3 text-[11px] opacity-70">
        <span className="inline-flex items-center gap-1"><Clock size={12} />{wazifa.recommended_time}</span>
        <span>Target {wazifa.target_count}x</span>
      </div>
      {routine?.is_bookmarked && <div className="mt-2 h-1.5 rounded-full bg-black/20 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>}
    </article>
  )
}
