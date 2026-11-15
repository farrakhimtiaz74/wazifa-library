import React, { useEffect, useMemo, useState } from 'react'
import { Compass, MapPin, RefreshCw } from 'lucide-react'
import { currentPrayer, fetchPrayerTimes, format12h, loadLocation, nextPrayer } from '../lib/prayerTimes'
import { t } from '../lib/i18n'

function countdownText(ms) {
  if (ms < 0) ms = 0
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function PrayerStrip({ lang = 'en', onOpenQibla }) {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [reloadKey, setReloadKey] = useState(0)
  const loc = useMemo(() => loadLocation(), [reloadKey])

  useEffect(() => {
    let alive = true
    fetchPrayerTimes(loadLocation()).then((r) => {
      if (!alive) return
      if (r) { setData(r); setFailed(false) } else setFailed(true)
    })
    return () => { alive = false }
  }, [reloadKey])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function onFocus() { setReloadKey((k) => k + 1) }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const isFriday = now.getDay() === 5
  const timings = data && data.timings
  const next = timings ? nextPrayer(timings, now) : null
  const current = timings ? currentPrayer(timings, now) : null

  const labelFor = (name) => {
    if (name === 'Dhuhr' && isFriday) return t(lang, 'jumuah')
    return t(lang, `prayer${name}`) || name
  }

  return (
    <section className="rounded-3xl border border-gold/30 p-4 bg-white/5" aria-label={t(lang, 'prayerTimes')}>
      <div className="flex items-center justify-between gap-2">
        <h3 className={`font-bold text-sm inline-flex items-center gap-1.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          <MapPin size={15} className="text-gold" /> {t(lang, 'prayerTimes')}
        </h3>
        <span className="text-[11px] opacity-70 inline-flex items-center gap-2">
          {loc.name}{loc.isDefault ? ` (${t(lang, 'defaultCity')})` : ''}
          {onOpenQibla && (
            <button onClick={onOpenQibla} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gold/40 text-gold font-bold" aria-label={t(lang, 'qibla')}>
              <Compass size={12} /> {t(lang, 'qibla')}
            </button>
          )}
        </span>
      </div>

      {!timings && !failed && <p className="text-xs opacity-70 mt-3">{t(lang, 'prayerLoading')}</p>}
      {failed && (
        <div className="mt-3 flex items-center gap-2">
          <p className="text-xs opacity-70 flex-1">{t(lang, 'prayerLoadFail')}</p>
          <button onClick={() => setReloadKey((k) => k + 1)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gold/40 text-[11px] font-bold shrink-0"><RefreshCw size={12} /> {t(lang, 'retry')}</button>
        </div>
      )}

      {timings && (
        <>
          <div className="grid grid-cols-5 gap-1.5 mt-3">
            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => {
              const isNext = next && next.name === name
              const isCurrent = current === name && !isNext
              return (
                <div key={name} className={`rounded-2xl px-1 py-2 text-center border ${isNext ? 'bg-gold text-black border-gold' : isCurrent ? 'border-gold/60 bg-gold/10' : 'border-gold/15 bg-black/10'}`}>
                  <p className={`text-[10px] font-bold truncate ${lang === 'ur' ? 'font-urdu' : ''}`}>{labelFor(name)}</p>
                  <p className="text-[11px] font-extrabold mt-0.5">{format12h(timings[name])}</p>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[11px]">
            <span className="opacity-70">{t(lang, 'sunrise')}: {format12h(timings.Sunrise)}</span>
            {next && (
              <span className="font-bold text-gold" role="timer">
                {labelFor(next.name)} {t(lang, 'prayerIn')} {countdownText(next.at - now)}{next.tomorrow ? ` (${t(lang, 'tomorrow')})` : ''}
              </span>
            )}
          </div>
          {data.fromCache && <p className="text-[10px] opacity-50 mt-1.5">{data.stale ? t(lang, 'prayerStale') : t(lang, 'cachedTimes')}</p>}
        </>
      )}
    </section>
  )
}
