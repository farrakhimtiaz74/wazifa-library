import React from 'react'
import { BookOpen, LogOut, Moon, Sparkles, Sun } from 'lucide-react'
import { wazifaData } from '../data/wazifaData'
import TasbihCounter from './TasbihCounter'
import { t } from '../lib/i18n'
import { urduCls } from './LearnHub'

// Item 50: Kids Mode home — very large cards for a small set of core duas
// (all ids verified against src/data/wazifaData.js), a giant-button tasbih
// and a link to the Prophets' stories. Exit is the small "Parents" button.
const KIDS_DUAS = [
  ['dua-before-eating', 'kidsBeforeEating'],
  ['dua-after-eating', 'kidsAfterEating'],
  ['dua-before-sleep', 'kidsBeforeSleep'],
  ['dua-waking-up', 'kidsWakingUp'],
  ['dua-entering-home', 'kidsEnteringHome'],
  ['dua-leaving-home', 'kidsLeavingHome'],
  ['dua-for-parents', 'kidsForParents']
]

const KIDS_TASBIH = {
  id: 'kids-tasbih',
  title: 'SubhanAllah',
  category: 'Daily Adhkar',
  arabic: 'سُبْحَانَ اللَّهِ',
  transliteration: 'SubhanAllah',
  english_translation: 'Glory be to Allah.',
  urdu_translation: 'اللہ پاک ہے۔',
  target_count: 33,
  recommended_time: 'Any Time',
  reference: 'Sahih Muslim',
  instructions: '',
  keywords: []
}

export default function KidsView({ lang, routines, onRoutineChange, onOpenWazifa, onNavigate, onExit }) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className={`text-2xl font-extrabold ${urduCls(lang)}`}>{t(lang, 'kidsTitle')}</h2>
          <p className={`text-sm opacity-75 ${urduCls(lang)}`}>{t(lang, 'kidsSub')}</p>
        </div>
        <button onClick={onExit} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gold/40 text-[11px] font-bold shrink-0 opacity-80">
          <LogOut size={12} /> {t(lang, 'kidsParentsBtn')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-4">
        {KIDS_DUAS.map(([id, labelKey]) => {
          const w = wazifaData.find((x) => x.id === id)
          if (!w) return null
          return (
            <button key={id} onClick={() => onOpenWazifa(w)} className="rounded-3xl border-2 border-gold/40 p-5 bg-white/5 text-left active:scale-[0.99]">
              <span className={`block font-extrabold text-lg ${urduCls(lang)}`}>{t(lang, labelKey)}</span>
              <span className="font-arabic block text-3xl mt-2 leading-loose" dir="rtl">{w.arabic}</span>
            </button>
          )
        })}
      </div>

      <div className="rounded-3xl border-2 border-gold/40 p-4 bg-white/5 mt-4">
        <p className={`font-extrabold text-lg inline-flex items-center gap-2 ${urduCls(lang)}`}><Sparkles className="text-gold" size={20} /> {t(lang, 'kidsTasbihTitle')}</p>
        <TasbihCounter wazifa={KIDS_TASBIH} routine={routines[KIDS_TASBIH.id]} onRoutineChange={onRoutineChange} lang={lang} kids />
      </div>

      <button onClick={() => onNavigate('prophets')} className="w-full rounded-3xl border-2 border-gold/40 p-5 bg-white/5 mt-4 text-left active:scale-[0.99]">
        <span className={`font-extrabold text-lg inline-flex items-center gap-2 ${urduCls(lang)}`}><BookOpen className="text-gold" size={20} /> {t(lang, 'prophetsTitle')}</span>
        <span className={`block text-sm opacity-75 mt-1 ${urduCls(lang)}`}>{t(lang, 'kidsStoriesSub')}</span>
      </button>

      <div className="flex items-center justify-center gap-4 mt-5 opacity-60">
        <Sun size={18} className="text-gold" />
        <Moon size={18} className="text-gold" />
      </div>
    </main>
  )
}
