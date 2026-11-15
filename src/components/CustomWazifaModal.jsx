import React, { useState } from 'react'
import { X } from 'lucide-react'
import { db, queueSync } from '../lib/db'
import { syncNow } from '../lib/sync'
import { CATEGORIES } from '../data/wazifaData'
import { categoryLabel, t } from '../lib/i18n'

const empty = { title: '', category: 'Daily Adhkar', arabic: '', transliteration: '', english_translation: '', urdu_translation: '', target_count: 33, recommended_time: 'Any Time', instructions: '' }

export default function CustomWazifaModal({ initial, onClose, onSaved, lang = 'en' }) {
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  async function save(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const id = form.id || (crypto.randomUUID ? crypto.randomUUID() : `custom-${Date.now()}`)
    const row = { ...form, id, target_count: Number(form.target_count) || 33, updated_at: new Date().toISOString() }
    await db.customWazaif.put(row)
    await queueSync('custom', row)
    syncNow(); onSaved(row); onClose()
  }
  const inputCls = 'w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold'
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-gold/30 bg-[#0a3527] dark:bg-[#0a3527] bg-[#fffdf8] p-5 space-y-3">
        <div className="flex items-center justify-between"><h3 className="font-bold">{initial ? t(lang, 'editWazifa') : t(lang, 'addCustom')}</h3><button type="button" onClick={onClose} aria-label={t(lang, 'closeBtn')}><X /></button></div>
        <input className={inputCls} placeholder={t(lang, 'fieldTitle')} value={form.title} onChange={(e) => set('title', e.target.value)} required />
        <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>{CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{categoryLabel(lang, c)}</option>)}</select>
        <textarea className={`${inputCls} font-arabic text-lg leading-loose`} dir="rtl" rows={3} placeholder={t(lang, 'fieldArabic')} value={form.arabic} onChange={(e) => set('arabic', e.target.value)} />
        <input className={inputCls} placeholder={t(lang, 'fieldTransliteration')} value={form.transliteration} onChange={(e) => set('transliteration', e.target.value)} />
        <textarea className={inputCls} rows={2} placeholder={t(lang, 'fieldEnglish')} value={form.english_translation} onChange={(e) => set('english_translation', e.target.value)} />
        <textarea className={`${inputCls} font-urdu`} dir="rtl" rows={2} placeholder={t(lang, 'fieldUrdu')} value={form.urdu_translation} onChange={(e) => set('urdu_translation', e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className={inputCls} type="number" min="1" placeholder={t(lang, 'fieldTarget')} value={form.target_count} onChange={(e) => set('target_count', e.target.value)} />
          <input className={inputCls} placeholder={t(lang, 'fieldTime')} value={form.recommended_time} onChange={(e) => set('recommended_time', e.target.value)} />
        </div>
        <textarea className={inputCls} rows={2} placeholder={t(lang, 'fieldNotes')} value={form.instructions} onChange={(e) => set('instructions', e.target.value)} />
        <button className="w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'saveWazifa')}</button>
      </form>
    </div>
  )
}
