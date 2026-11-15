import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Compass, Navigation } from 'lucide-react'
import { distanceToMakkah, loadLocation, qiblaBearing } from '../lib/prayerTimes'
import { t } from '../lib/i18n'

export default function QiblaCompass({ lang = 'en', onBack }) {
  const loc = useMemo(() => loadLocation(), [])
  const bearing = useMemo(() => qiblaBearing(loc.lat, loc.lng), [loc])
  const distance = useMemo(() => distanceToMakkah(loc.lat, loc.lng), [loc])
  const [heading, setHeading] = useState(null)
  const [listening, setListening] = useState(false)
  const [denied, setDenied] = useState(false)
  const handlerRef = useRef(null)

  function startListening() {
    handlerRef.current = (e) => {
      let h = null
      if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading
      else if (typeof e.alpha === 'number') h = (360 - e.alpha) % 360
      if (h !== null && !Number.isNaN(h)) setHeading(Math.round(h))
    }
    window.addEventListener('deviceorientationabsolute', handlerRef.current, true)
    window.addEventListener('deviceorientation', handlerRef.current, true)
    setListening(true)
  }

  async function enableCompass() {
    try {
      const DOE = window.DeviceOrientationEvent
      if (DOE && typeof DOE.requestPermission === 'function') {
        const res = await DOE.requestPermission()
        if (res !== 'granted') { setDenied(true); return }
      }
      startListening()
    } catch { setDenied(true) }
  }

  useEffect(() => () => {
    if (handlerRef.current) {
      window.removeEventListener('deviceorientationabsolute', handlerRef.current, true)
      window.removeEventListener('deviceorientation', handlerRef.current, true)
    }
  }, [])

  const dialRotation = heading === null ? 0 : -heading
  const needleRotation = heading === null ? bearing : bearing - heading
  const aligned = heading !== null && Math.abs(((bearing - heading + 540) % 360) - 180) >= 175

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 inline-flex items-center gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}><Compass className="text-gold" /> {t(lang, 'qiblaTitle')}</h2>
      <p className="text-xs opacity-70 mt-1">{loc.name} · {t(lang, 'distanceToMakkah')}: {distance.toLocaleString()} km</p>

      <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5 text-center">
        <p className="text-[11px] uppercase tracking-widest opacity-70 font-bold">{t(lang, 'qibla')}</p>
        <p className="text-5xl font-extrabold mt-1">{Math.round(bearing)}°</p>
        <p className="text-xs opacity-70 mt-1">{t(lang, 'qiblaBearingNote')}</p>

        <div className="relative w-[240px] h-[240px] mx-auto mt-5">
          <div className="absolute inset-0 rounded-full border-2 border-gold/40 bg-black/20 overflow-hidden" style={{ transform: `rotate(${dialRotation}deg)`, transition: 'transform 0.15s linear' }}>
            <span className="absolute left-1/2 top-1.5 -translate-x-1/2 text-gold font-extrabold text-sm">N</span>
            <span className="absolute left-1/2 bottom-1.5 -translate-x-1/2 opacity-60 font-bold text-sm">S</span>
            <span className="absolute top-1/2 left-2 -translate-y-1/2 opacity-60 font-bold text-sm">W</span>
            <span className="absolute top-1/2 right-2 -translate-y-1/2 opacity-60 font-bold text-sm">E</span>
            <span className="absolute inset-3 rounded-full border border-gold/15" />
          </div>
          <div className="absolute inset-0" style={{ transform: `rotate(${needleRotation}deg)`, transition: 'transform 0.15s linear' }}>
            <span className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
              <Navigation size={30} className={aligned ? 'text-emerald-400' : 'text-gold'} fill="currentColor" />
              <span className="text-[10px] font-extrabold mt-0.5">🕋</span>
            </span>
          </div>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold" />
        </div>

        {heading !== null
          ? <p className="text-sm font-bold mt-4">{t(lang, 'yourHeading')}: {heading}°{aligned ? ` · ${t(lang, 'facingQibla')}` : ''}</p>
          : <p className="text-xs opacity-70 mt-4">{t(lang, 'qiblaStaticNote')} {Math.round(bearing)}° {t(lang, 'qiblaFromNorth')}</p>}

        {!listening && (
          <button onClick={enableCompass} className="mt-4 px-5 py-2.5 rounded-full bg-gold text-black text-sm font-bold inline-flex items-center gap-1.5">
            <Compass size={15} /> {t(lang, 'enableCompass')}
          </button>
        )}
        {denied && <p className="text-[11px] text-amber-400 font-bold mt-2">{t(lang, 'compassDenied')}</p>}
        <p className="text-[10px] opacity-50 mt-3">{t(lang, 'compassVariance')}</p>
      </div>
    </div>
  )
}
