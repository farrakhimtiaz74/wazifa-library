import React from 'react'
import { Flame } from 'lucide-react'
import { t } from '../lib/i18n'

export default function RoutineRing({ percent = 0, done = 0, total = 0, streak = 0, lang = 'en', onClick }) {
  const R = 26
  const CIRC = 2 * Math.PI * R
  const p = Math.max(0, Math.min(100, Math.round(percent)))
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3.5 rounded-3xl border border-gold/30 p-3.5 bg-white/5 text-left active:scale-[0.99]" aria-label={t(lang, 'routine')}>
      <span className="relative w-[64px] h-[64px] shrink-0">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="6" />
          <circle cx="32" cy="32" r={R} fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - p / 100)}
            transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-extrabold">{p}%</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'routineToday')}</span>
        <span className="block text-[11px] opacity-70 mt-0.5">{total === 0 ? t(lang, 'routineRingEmpty') : `${done} / ${total} ${t(lang, 'completedWord')}`}</span>
      </span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gold/30 text-gold text-xs font-bold shrink-0"><Flame size={14} />{streak}</span>
    </button>
  )
}
