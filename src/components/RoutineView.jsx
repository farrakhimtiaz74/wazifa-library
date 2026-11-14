import React from 'react'
import { Flame, Plus } from 'lucide-react'
export default function RoutineView({ items, streak, onOpen, onAddCustom }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="rounded-3xl border border-gold/25 p-5 bg-gold/10 flex items-center gap-3">
        <Flame className="text-gold" size={30} />
        <div><p className="font-extrabold text-lg">{streak} day streak</p><p className="text-xs opacity-75">Complete all routine items each day to grow your streak. Resets daily at midnight (your timezone).</p></div>
      </div>
      <button onClick={onAddCustom} className="mt-4 w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm inline-flex items-center justify-center gap-1"><Plus size={16} /> Add Custom Wazifa</button>
      <div className="space-y-3 mt-4">
        {items.length === 0 && <p className="text-sm opacity-70 text-center py-8">No bookmarked Wazaif yet. Tap the bookmark icon on any Wazifa to add it to your daily routine.</p>}
        {items.map(({ wazifa, routine }) => {
          const target = routine?.target_count || wazifa.target_count || 1
          const cur = routine?.current_count || 0
          const pct = Math.min(100, Math.round((cur / target) * 100))
          return (
            <article key={wazifa.id} onClick={() => onOpen(wazifa)} className="rounded-2xl border border-gold/20 p-4 bg-white/5 cursor-pointer">
              <div className="flex justify-between gap-2"><h3 className="font-bold text-sm">{wazifa.title}</h3><span className="text-xs text-gold font-bold">{cur}/{target}</span></div>
              <div className="h-2 rounded-full bg-black/25 mt-2 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>
              <p className="text-[11px] mt-1.5 opacity-70">{routine?.completed_today ? 'Completed today ✓' : `${pct}% done today`}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
