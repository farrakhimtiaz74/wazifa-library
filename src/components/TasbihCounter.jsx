import React, { useEffect, useRef, useState } from 'react'
import { RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { db, queueSync, todayLocal } from '../lib/db'
import { syncNow } from '../lib/sync'

const SOUND_KEY = 'wl-tasbih-sound'

export default function TasbihCounter({ wazifa, routine, onRoutineChange }) {
  const target = wazifa.target_count || 33
  const [count, setCount] = useState(routine?.current_count || 0)
  const [pulse, setPulse] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem(SOUND_KEY) === '1' } catch { return false } })
  const audioRef = useRef(null)
  const confirmTimer = useRef(null)

  useEffect(() => { setCount(routine?.current_count || 0) }, [wazifa.id, routine?.current_count])
  useEffect(() => () => { if (confirmTimer.current) clearTimeout(confirmTimer.current) }, [])

  async function save(next) {
    const completed = next >= target
    const row = { wazifa_id: wazifa.id, is_bookmarked: routine?.is_bookmarked || false, current_count: next, target_count: target, completed_today: completed, last_reset_date: todayLocal(), updated_at: new Date().toISOString() }
    await db.routines.put(row)
    await queueSync('routine', row)
    onRoutineChange && onRoutineChange(row)
    syncNow()
  }

  function playTick() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      if (!audioRef.current) audioRef.current = new Ctx()
      const ctx = audioRef.current
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 1560
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(); osc.stop(ctx.currentTime + 0.05)
    } catch { /* sound is optional; never block counting */ }
  }

  function tap() {
    if (count >= target) return
    const next = count + 1
    setCount(next)
    if (navigator.vibrate) navigator.vibrate(25)
    if (soundOn) playTick()
    if (next >= target) {
      if (navigator.vibrate) navigator.vibrate([120, 60, 120, 60, 200])
      setPulse(true); setTimeout(() => setPulse(false), 900)
    }
    save(next)
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      confirmTimer.current = setTimeout(() => setConfirmReset(false), 3000)
      return
    }
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    setConfirmReset(false)
    setCount(0)
    save(0)
  }

  function toggleSound() {
    const next = !soundOn
    setSoundOn(next)
    try { localStorage.setItem(SOUND_KEY, next ? '1' : '0') } catch { /* storage unavailable */ }
    if (next) setTimeout(playTick, 0)
  }

  const R = 84
  const CIRC = 2 * Math.PI * R
  const progress = Math.min(1, count / target)
  return (
    <div className="rounded-3xl border border-gold/30 p-4 mt-4 bg-black/10">
      <div className="flex items-center justify-between text-xs opacity-80">
        <span>Digital Tasbih</span>
        <button onClick={toggleSound} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gold/30" aria-label="Toggle tap sound" aria-pressed={soundOn}>
          {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />} Sound {soundOn ? 'On' : 'Off'}
        </button>
      </div>

      <button onClick={tap} aria-label={`Tasbih counter, ${count} of ${target}. Tap to count.`}
        className={`relative mx-auto mt-3 block w-[200px] h-[200px] min-h-[180px] rounded-full select-none touch-manipulation ${pulse ? 'animate-pulse-ring' : ''}`}>
        <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0">
          <circle cx="100" cy="100" r={R} fill="rgba(212,175,55,0.08)" stroke="rgba(6,44,34,0.55)" strokeWidth="10" />
          <circle cx="100" cy="100" r={R} fill="none" stroke="#D4AF37" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
            transform="rotate(-90 100 100)" style={{ transition: 'stroke-dashoffset 0.2s ease' }} />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-extrabold leading-none">{count}</span>
          <span className="text-sm font-bold mt-1.5 opacity-80">{count} / {target}</span>
          <span className="block text-[10px] font-semibold mt-1 tracking-widest opacity-70">TAP TO COUNT</span>
        </span>
      </button>

      {count >= target && <p className="text-center text-gold font-bold text-sm mt-3">Completed — Alhamdulillah!</p>}
      <button onClick={handleReset}
        className={`mt-3 mx-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border ${confirmReset ? 'border-red-400 text-red-300 font-bold' : 'border-transparent opacity-70'}`}>
        <RotateCcw size={13} /> {confirmReset ? 'Reset? Tap again to confirm' : 'Reset counter'}
      </button>
    </div>
  )
}
