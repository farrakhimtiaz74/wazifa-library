import React from 'react'
import { Sparkles, X } from 'lucide-react'
import { t } from '../lib/i18n'
import { APP_VERSION_LABEL } from '../lib/uiPrefs'

// Item 95: What's New — shared list content, an auto-show-once modal
// (App compares the stored lastSeenVersion), and the Settings page.
// Wave 5: the current version's list (whatsNewItems31) shows first, with the
// previous v3 list kept below under its own label.
export function WhatsNewList({ lang = 'en' }) {
  const items31 = t(lang, 'whatsNewItems31')
  const items = t(lang, 'whatsNewItems')
  const renderList = (arr) => (
    <ul className="mt-3 space-y-2">
      {(Array.isArray(arr) ? arr : []).map((item, i) => (
        <li key={i} className={`text-sm leading-relaxed flex gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}><span className="text-gold shrink-0">•</span><span>{item}</span></li>
      ))}
    </ul>
  )
  return (
    <div>
      <p className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-[11px] font-extrabold"><Sparkles size={12} /> {APP_VERSION_LABEL}</p>
      {renderList(items31)}
      <p className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gold/25 text-[11px] font-extrabold mt-6 opacity-80">{t(lang, 'whatsNewVersion')}</p>
      {renderList(items)}
    </div>
  )
}

export default function WhatsNewModal({ lang = 'en', onClose }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl border border-gold/40 bg-[#0a3527] dark:bg-[#0a3527] bg-[#fffdf8] p-5">
        <div className="flex items-center justify-between">
          <h3 className={`font-extrabold ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'whatsNewTitle')}</h3>
          <button onClick={onClose} aria-label={t(lang, 'closeBtn')}><X size={18} /></button>
        </div>
        <div className="mt-3"><WhatsNewList lang={lang} /></div>
        <button onClick={onClose} className={`w-full mt-5 py-3 rounded-2xl bg-gold text-black font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'gotIt')}</button>
      </div>
    </div>
  )
}
