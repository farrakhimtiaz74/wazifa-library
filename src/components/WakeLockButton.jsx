import React, { useEffect, useRef, useState } from 'react'
import { Lightbulb, LightbulbOff } from 'lucide-react'
import { t } from '../lib/i18n'

export default function WakeLockButton({ lang = 'en', compact = false }) {
  const [on, setOn] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  const lockRef = useRef(null)

  async function release() {
    try { if (lockRef.current) await lockRef.current.release() } catch { /* already released */ }
    lockRef.current = null
    setOn(false)
  }

  async function toggle() {
    if (on) { await release(); return }
    if (!('wakeLock' in navigator)) { setUnsupported(true); setTimeout(() => setUnsupported(false), 2500); return }
    try {
      lockRef.current = await navigator.wakeLock.request('screen')
      lockRef.current.addEventListener('release', () => { lockRef.current = null; setOn(false) })
      setOn(true)
    } catch { setUnsupported(true); setTimeout(() => setUnsupported(false), 2500) }
  }

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === 'visible' && on && !lockRef.current && 'wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then((l) => {
          lockRef.current = l
          l.addEventListener('release', () => { lockRef.current = null; setOn(false) })
        }).catch(() => { /* re-acquire is best effort */ })
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      if (lockRef.current) { lockRef.current.release().catch(() => {}); lockRef.current = null }
    }
  }, [on ])

  return (
    <span className="inline-flex flex-col items-end">
      <button onClick={toggle} aria-pressed={on} title={t(lang, 'wakeLock')}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border ${on ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-80'}`}>
        {on ? <Lightbulb size={11} /> : <LightbulbOff size={11} />} {compact ? '' : t(lang, 'wakeLock')}{on ? ' On' : ''}
      </button>
      {unsupported && <span className="text-[10px] text-amber-400 font-bold mt-1">{t(lang, 'wakeLockUnsupported')}</span>}
    </span>
  )
}
