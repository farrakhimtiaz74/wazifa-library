import React, { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { db, queueSync, todayLocal } from '../lib/db'
import { syncNow } from '../lib/sync'

export default function TasbihCounter({ wazifa, routine, onRoutineChange }) {
  const target = wazifa.target_count || 33
  const [count, setCount] = useState(routine?.current_count || 0)
  const [pulse, setPulse] = useState(false)
  useEffect(() => { setCount(routine?.current_count || 0) }, [wazifa.id, routine?.current_count])

  async function save(next) {
    const completed = next >= target
    const row = { wazifa_id: wazifa.id, is_bookmarked: routine?.is_bookmarked || false, current_count: next, target_count: target, completed_today: completed, last_reset_date: todayLocal(), updated_at: new Date().toISOString() }
    await db.routines.put(row)
    await queueSync('routine', row)
    onRoutineChange && onRoutineChange(row)
    syncNow()
  }

  function tap() {
    if (count >= target) return
    const next = count + 1
    setCount(next)
    if (navigator.vibrate) navigator.vibrate(25)
    if (next >= target) {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      setPulse(true); setTimeout(() => setPulse(false), 900)
    }
    save(next)
  }

  const pct = Math.min(100, Math.round((count / target) * 100))
  return (
    <div className="rounded-3xl border border-gold/30 p-4 mt-4 bg-black/10">
      <div className="flex items-center justify-between text-xs opacity-80"><span>Digital Tasbih</span><span>{count} / {target}</span></div>
      <button onClick={tap} className={`w-full mt-3 py-10 rounded-3xl bg-gold/15 border-2 border-gold/50 text-5xl font-extrabold select-none touch-manipulation ${pulse ? 'animate-pulse-ring' : ''}`}>
        {count}
        <span className="block text-xs font-semibold mt-2 tracking-widest">TAP TO COUNT</span>
      </button>
      <div className="h-2 rounded-full bg-black/25 mt-3 overflow-hidden"><div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} /></div>
      {count >= target && <p className="text-center text-gold font-bold text-sm mt-2">Completed — Alhamdulillah!</p>}
      <button onClick={() => { setCount(0); save(0) }} className="mt-3 mx-auto flex items-center gap-1 text-xs opacity-70"><RotateCcw size={13} /> Reset counter</button>
    </div>
  )
}
