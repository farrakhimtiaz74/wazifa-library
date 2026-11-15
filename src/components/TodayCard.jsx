import React, { useEffect, useRef, useState } from 'react'
import { Check, ScrollText, Share2, Sparkles } from 'lucide-react'
import { t } from '../lib/i18n'

// D4: ONE rotating "Today" card merging Wazifa of the Day + Ayah/Hadith of
// the Day. Auto-rotates every 12s until the user picks a tab manually.
export default function TodayCard({ wazifa, quote, lang = 'en', onOpenWazifa, onOpenArchive }) {
  const [tab, setTab] = useState('wazifa')
  const [shared, setShared] = useState(false)
  const manualRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (!manualRef.current) setTab((x) => (x === 'wazifa' ? 'quote' : 'wazifa'))
    }, 12000)
    return () => clearInterval(id)
  }, [])

  function pick(next) { manualRef.current = true; setTab(next) }

  async function shareQuote() {
    const text = [quote.arabic, quote.english, quote.urdu, `— ${quote.reference}`, '', '— via Wazifa Library', 'https://farrakhimtiaz74.github.io/wazifa-library/'].filter(Boolean).join('\n')
    if (navigator.share) {
      try { await navigator.share({ title: t(lang, 'dailyQuote'), text }); return } catch (err) { if (err && err.name === 'AbortError') return }
    }
    try { await navigator.clipboard.writeText(text); setShared(true); setTimeout(() => setShared(false), 2000) } catch { /* clipboard unavailable */ }
  }

  const tabCls = (active) => `px-3 py-1.5 rounded-full text-[11px] font-bold border ${active ? 'bg-gold text-black border-gold' : 'border-gold/30 opacity-75'}`
  return (
    <div className="rounded-3xl border border-gold/40 bg-gold/10 p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold text-gold uppercase tracking-wider ${lang === 'ur' ? 'font-urdu normal-case tracking-normal text-sm' : ''}`}><Sparkles size={12} /> {t(lang, 'todayTitle')}</span>
        <span className="inline-flex gap-1.5">
          <button onClick={() => pick('wazifa')} className={tabCls(tab === 'wazifa')} aria-pressed={tab === 'wazifa'}>{t(lang, 'wazifaOfDay')}</button>
          <button onClick={() => pick('quote')} className={tabCls(tab === 'quote')} aria-pressed={tab === 'quote'}>{t(lang, 'dailyQuote')}</button>
        </span>
      </div>

      {tab === 'wazifa' ? (
        <button onClick={() => onOpenWazifa(wazifa)} className="w-full text-left mt-2 active:scale-[0.99]">
          <span className="block font-bold">{wazifa.title}</span>
          <span className="font-arabic block text-xl mt-1.5 line-clamp-2" dir="rtl">{wazifa.arabic}</span>
          <span className="block text-[11px] opacity-70 mt-1.5">{wazifa.recommended_time} · {t(lang, 'targetLabel')} {wazifa.target_count}x · {wazifa.reference}</span>
        </button>
      ) : (
        <div className="mt-2">
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold opacity-80 ${lang === 'ur' ? 'font-urdu' : ''}`}><ScrollText size={12} /> {quote.type === 'ayah' ? 'Ayah' : 'Hadith'}</span>
            <button onClick={shareQuote} className="p-1.5 shrink-0" aria-label={t(lang, 'share')}>{shared ? <Check size={17} className="text-gold" /> : <Share2 size={17} className="opacity-70" />}</button>
          </div>
          {quote.arabic && <p className="font-arabic text-xl mt-2 text-center" dir="rtl">{quote.arabic}</p>}
          <p className="text-sm leading-relaxed mt-2">{quote.english}</p>
          <p className="font-urdu text-base mt-2 text-right" dir="rtl">{quote.urdu}</p>
          <p className="text-[11px] opacity-60 mt-2">{quote.reference}</p>
          {shared && <p className="text-[11px] text-gold font-bold mt-1">{t(lang, 'copied')} {t(lang, 'readyToPaste')}</p>}
          {onOpenArchive && <button onClick={onOpenArchive} className={`text-[11px] font-bold text-gold mt-2 underline underline-offset-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'archiveBrowse')}</button>}
        </div>
      )}
    </div>
  )
}
