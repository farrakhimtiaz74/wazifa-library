import React, { useEffect, useRef, useState } from 'react'
import { Moon, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { addTaps, db, getSetting, queueSync, recordHistorySnapshot, setSetting, todayLocal } from '../lib/db'
import { recordDhikr, WAZIFA_DHIKR_KEYS } from '../lib/dhikrStats'
import { syncNow } from '../lib/sync'
import { t } from '../lib/i18n'

const SOUND_KEY = 'wl-tasbih-sound'

export default function TasbihCounter({ wazifa, routine, onRoutineChange, freeMode = false, lang = 'en', onCountChange, onComplete, kids = false }) {
  const target = freeMode ? Infinity : (routine?.target_count || wazifa.target_count || 33)
  const [count, setCount] = useState(routine?.current_count || 0)
  const [rounds, setRounds] = useState(routine?.rounds_today || 0)
  const [lifetime, setLifetime] = useState(routine?.lifetime_count || 0)
  const [pulse, setPulse] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem(SOUND_KEY) === '1' } catch { return false } })
  // Item 28: Mosque mode — per-session only, never persisted.
  const [mosque, setMosque] = useState(false)
  const audioRef = useRef(null)
  const confirmTimer = useRef(null)
  const stateRef = useRef({ count: routine?.current_count || 0, rounds: routine?.rounds_today || 0 })
  stateRef.current = { count, rounds }

  useEffect(() => { setCount(routine?.current_count || 0); setRounds(routine?.rounds_today || 0); setLifetime(routine?.lifetime_count || 0) }, [wazifa.id])
  useEffect(() => () => { if (confirmTimer.current) clearTimeout(confirmTimer.current) }, [])

  async function save(next, nextRounds, nextLifetime) {
    const completed = !freeMode && next >= target
    const row = {
      wazifa_id: wazifa.id,
      is_bookmarked: routine?.is_bookmarked || false,
      current_count: next,
      target_count: freeMode ? (routine?.target_count || wazifa.target_count || 33) : target,
      completed_today: freeMode ? (routine?.completed_today || false) : completed,
      rounds_today: nextRounds,
      lifetime_count: typeof nextLifetime === 'number' ? nextLifetime : lifetime,
      last_reset_date: todayLocal(),
      updated_at: new Date().toISOString()
    }
    await db.routines.put(row)
    await queueSync('routine', row)
    onRoutineChange && onRoutineChange(row)
    recordHistorySnapshot(todayLocal())
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
    if (!freeMode && count >= target) return
    const next = count + 1
    const nextLifetime = lifetime + 1
    setCount(next)
    setLifetime(nextLifetime)
    if (navigator.vibrate) navigator.vibrate(mosque ? 10 : 25)
    if (soundOn && !mosque) playTick()
    addTaps(1)
    // Item 27: feed the per-dhikr daily totals (presets pass their own key
    // via the preset-<key> routine id; library wazaif use the mapping).
    const dhikrKey = wazifa.id.startsWith('preset-') ? wazifa.id.slice(7) : wazifa.id.startsWith('durood-') ? 'durood' : WAZIFA_DHIKR_KEYS[wazifa.id]
    if (dhikrKey) recordDhikr(dhikrKey, 1)
    onCountChange && onCountChange(next)
    if (!freeMode && next >= target) {
      // Mosque mode: a single short vibration at target instead of the pattern.
      if (navigator.vibrate) navigator.vibrate(mosque ? 40 : [120, 60, 120, 60, 200])
      setPulse(true); setTimeout(() => setPulse(false), 900)
      const r = rounds + 1
      setRounds(r)
      save(next, r, nextLifetime)
      onComplete && onComplete(next)
      return
    }
    save(next, rounds, nextLifetime)
  }

  function continueRound() {
    setCount(0)
    onCountChange && onCountChange(0)
    save(0, rounds, lifetime)
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
    setRounds(0)
    onCountChange && onCountChange(0)
    save(0, 0, lifetime)
  }

  function toggleSound() {
    const next = !soundOn
    setSoundOn(next)
    try { localStorage.setItem(SOUND_KEY, next ? '1' : '0') } catch { /* storage unavailable */ }
    if (next) setTimeout(playTick, 0)
  }

  const R = 84
  const CIRC = 2 * Math.PI * R
  const progress = freeMode ? 0 : Math.min(1, count / target)
  const done = !freeMode && count >= target
  return (
    <div className={`rounded-3xl border border-gold/30 p-4 mt-4 bg-black/10 ${mosque ? 'mosque-mode' : ''}`}>
      <div className="flex items-center justify-between text-xs opacity-80">
        <span>{freeMode ? t(lang, 'freeMode') : t(lang, 'digitalTasbih')}{rounds > 0 && !freeMode ? ` · ${t(lang, 'rounds')}: ${rounds}` : ''}{lifetime > 0 ? ` · ${t(lang, 'lifetime')}: ${lifetime.toLocaleString()}` : ''}</span>
        <span className="inline-flex items-center gap-1.5">
          <button onClick={() => setMosque(!mosque)} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${mosque ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30'}`} aria-label={t(lang, 'mosqueMode')} aria-pressed={mosque}>
            <Moon size={13} /> {t(lang, 'mosqueMode')}
          </button>
          <button onClick={toggleSound} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gold/30" aria-label={t(lang, 'soundLabel')} aria-pressed={soundOn}>
            {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />} {t(lang, 'soundLabel')} {soundOn ? t(lang, 'on') : t(lang, 'off')}
          </button>
        </span>
      </div>
      {mosque && <p className="text-[11px] opacity-70 mt-2">{t(lang, 'mosqueModeHelp')}</p>}

      <button onClick={tap} aria-label={freeMode ? `Free tasbih counter, ${count}. Tap to count.` : `Tasbih counter, ${count} of ${target}. Tap to count.`}
        className={`relative mx-auto mt-3 block w-[200px] h-[200px] min-h-[180px] rounded-full select-none touch-manipulation ${pulse ? 'animate-pulse-ring' : ''} ${kids ? 'scale-125 my-8' : ''}`}>
        <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0">
          <circle cx="100" cy="100" r={R} fill="rgba(212,175,55,0.08)" stroke="rgba(6,44,34,0.55)" strokeWidth="10" />
          {!freeMode && <circle cx="100" cy="100" r={R} fill="none" stroke="#D4AF37" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
            transform="rotate(-90 100 100)" style={{ transition: 'stroke-dashoffset 0.2s ease' }} />}
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-extrabold leading-none">{count}</span>
          {freeMode
            ? <span className="text-sm font-bold mt-1.5 opacity-80">{t(lang, 'freeMode')}</span>
            : <span className="text-sm font-bold mt-1.5 opacity-80">{count} / {target}</span>}
          <span className={`block text-[10px] font-semibold mt-1 tracking-widest opacity-70 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'tapToCount')}</span>
        </span>
      </button>

      {done && (
        <div className="text-center mt-3 space-y-2">
          <p className="text-gold font-bold text-sm">{t(lang, 'completed')}</p>
          <p className="text-[11px] opacity-70">{t(lang, 'rounds')}: {rounds} · {t(lang, 'totalLabel')}: {rounds * target}</p>
          <button onClick={continueRound} className="px-4 py-2 rounded-full bg-gold text-black text-xs font-bold">{t(lang, 'continueNext')}</button>
        </div>
      )}
      <button onClick={handleReset}
        className={`mt-3 mx-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border ${confirmReset ? 'border-red-400 text-red-300 font-bold' : 'border-transparent opacity-70'}`}>
        <RotateCcw size={13} /> {confirmReset ? t(lang, 'resetConfirm') : t(lang, 'resetCounter')}
      </button>
    </div>
  )
}

export async function ensureTapsSetting() {
  const v = await getSetting('total_taps', 0)
  if (typeof v !== 'number') await setSetting('total_taps', 0)
}
