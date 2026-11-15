import React from 'react'
import { ArrowLeft, Briefcase, Coins, GraduationCap, Heart, HeartPulse, Home, Landmark, LayoutGrid, Leaf, Plane, Shield, Sparkles, Sun } from 'lucide-react'
import { CATEGORIES } from '../data/wazifaData'
import { situations } from '../data/duaPages'
import { categoryLabel, t } from '../lib/i18n'

// Item 87: Categories page — replaces the old scrolling pills row (D10).
// Wave 3, item 31: a "By Situation" section below the categories — each
// situation opens Home filtered to its curated dua list.
const ICONS = {
  All: LayoutGrid,
  'Rizq & Wealth': Coins,
  'Health & Shifa': HeartPulse,
  'Protection & Hifazat': Shield,
  'Marriage & Family': Heart,
  'Peace & Anxiety': Leaf,
  'Forgiveness & Istighfar': Sparkles,
  'Daily Adhkar': Sun,
  'Daily Life Duas': Home
}

const SIT_ICONS = {
  job: Briefcase,
  exams: GraduationCap,
  debt: Landmark,
  travel: Plane,
  illness: HeartPulse,
  rizq: Coins,
  anxiety: Leaf,
  marriage: Heart
}

export default function CategoriesView({ allWazaif = [], lang = 'en', onSelect, onSelectSituation, onBack }) {
  const countFor = (c) => (c === 'All' ? allWazaif.length : allWazaif.filter((w) => w.category === c).length)
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'categoriesTitle')}</h2>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c] || LayoutGrid
          return (
            <button key={c} onClick={() => onSelect(c)} className="rounded-2xl border border-gold/25 p-4 bg-white/5 text-left active:scale-[0.99]">
              <Icon className="text-gold" size={22} />
              <span className={`block font-bold text-sm mt-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>{c === 'All' ? t(lang, 'allWazaif') : categoryLabel(lang, c)}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'wazaifCount').replace('{n}', countFor(c))}</span>
            </button>
          )
        })}
      </div>

      <h3 className={`text-base font-extrabold mt-7 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'bySituationTitle')}</h3>
      <p className={`text-xs opacity-70 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'bySituationSub')}</p>
      <div className="grid grid-cols-2 gap-2 mt-3">
        {situations.map((s) => {
          const Icon = SIT_ICONS[s.key] || LayoutGrid
          const count = s.ids.filter((id) => allWazaif.some((w) => w.id === id)).length
          return (
            <button key={s.key} onClick={() => onSelectSituation && onSelectSituation(s)} className="rounded-2xl border border-gold/25 p-4 bg-white/5 text-left active:scale-[0.99]">
              <Icon className="text-gold" size={22} />
              <span className={`block font-bold text-sm mt-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, s.labelKey)}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'wazaifCount').replace('{n}', count)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
