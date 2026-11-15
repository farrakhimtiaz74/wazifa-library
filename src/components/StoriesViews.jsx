import React, { useState } from 'react'
import { BookOpen, ChevronRight } from 'lucide-react'
import { seerahEvents, prophetStories, sahabaStories } from '../data/learnStories'
import { nawawiHadith } from '../data/nawawiData'
import { t } from '../lib/i18n'
import { Shell, pick, urduCls } from './LearnHub'

// ---------- Item 43: Seerah timeline ----------
export function SeerahView({ lang, onBack }) {
  return (
    <Shell title={t(lang, 'seerahTitle')} sub={t(lang, 'seerahSub')} lang={lang} onBack={onBack}>
      <div className="relative pl-5">
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gold/30" />
        <div className="space-y-4">
          {seerahEvents.map((e) => (
            <div key={e.id} className="relative">
              <span className="absolute -left-5 top-1.5 w-[11px] h-[11px] rounded-full bg-gold border-2 border-[#062C22]" />
              <p className="text-[11px] font-bold text-gold">{e.year}</p>
              <p className={`font-bold text-sm ${urduCls(lang)}`}>{pick(e.title, lang)}</p>
              <p className={`text-xs opacity-80 leading-relaxed mt-0.5 ${urduCls(lang)}`}>{pick(e.desc, lang)}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

// ---------- Items 44/45: story list + reader ----------
function StoryList({ items, lang, onBack, title, sub, onOpenSeerah }) {
  const [sel, setSel] = useState(null)
  if (sel) {
    const beats = (sel.beats || sel.bio || {})[lang] || (sel.beats || sel.bio || {}).en || []
    return (
      <Shell title={pick(sel.title, lang)} lang={lang} onBack={() => setSel(null)}>
        <div className="space-y-2.5">
          {beats.map((b, i) => (
            <div key={i} className="flex gap-2.5 rounded-2xl border border-gold/20 p-3.5 bg-white/5">
              <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-[11px] font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
              <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{b}</p>
            </div>
          ))}
        </div>
        {sel.id === 'muhammad' && onOpenSeerah && (
          <button onClick={onOpenSeerah} className="mt-4 w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm inline-flex items-center justify-center gap-1">
            <BookOpen size={15} /> {t(lang, 'openSeerah')}
          </button>
        )}
      </Shell>
    )
  }
  return (
    <Shell title={title} sub={sub} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {items.map((s) => (
          <button key={s.id} onClick={() => setSel(s)} className="w-full flex items-center gap-3 rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
            <span className={`flex-1 font-bold text-sm ${urduCls(lang)}`}>{pick(s.title, lang)}</span>
            <ChevronRight size={15} className="opacity-50 shrink-0" />
          </button>
        ))}
      </div>
    </Shell>
  )
}

export function ProphetsView({ lang, onBack, onOpenSeerah }) {
  return <StoryList items={prophetStories} lang={lang} onBack={onBack} title={t(lang, 'prophetsTitle')} sub={t(lang, 'prophetsSub')} onOpenSeerah={onOpenSeerah} />
}

export function SahabaView({ lang, onBack }) {
  const companions = sahabaStories.filter((s) => s.group === 'companions')
  const women = sahabaStories.filter((s) => s.group === 'women')
  const [sel, setSel] = useState(null)
  if (sel) {
    const beats = (sel.bio || {})[lang] || (sel.bio || {}).en || []
    return (
      <Shell title={pick(sel.title, lang)} lang={lang} onBack={() => setSel(null)}>
        <div className="space-y-2.5">
          {beats.map((b, i) => (
            <div key={i} className="flex gap-2.5 rounded-2xl border border-gold/20 p-3.5 bg-white/5">
              <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-[11px] font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
              <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{b}</p>
            </div>
          ))}
        </div>
      </Shell>
    )
  }
  const row = (s) => (
    <button key={s.id} onClick={() => setSel(s)} className="w-full flex items-center gap-3 rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
      <span className={`flex-1 font-bold text-sm ${urduCls(lang)}`}>{pick(s.title, lang)}</span>
      <ChevronRight size={15} className="opacity-50 shrink-0" />
    </button>
  )
  return (
    <Shell title={t(lang, 'sahabaTitle')} sub={t(lang, 'sahabaSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">{companions.map(row)}</div>
      <p className={`font-extrabold text-sm text-gold mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'greatWomenHeading')}</p>
      <div className="space-y-2">{women.map(row)}</div>
    </Shell>
  )
}

// ---------- Item 46: 40 Hadith Nawawi (42) ----------
export function NawawiView({ lang, onBack }) {
  const [sel, setSel] = useState(null)
  if (sel !== null) {
    const h = nawawiHadith[sel]
    const expl = pick(h, lang)
    return (
      <Shell title={`${t(lang, 'hadithLabel')} ${h.n} / ${nawawiHadith.length}`} lang={lang} onBack={() => setSel(null)}>
        <div className="rounded-3xl border border-gold/30 p-5 bg-white/5">
          <p className="font-arabic text-2xl leading-loose text-center" dir="rtl">{h.arabic}</p>
        </div>
        <div className="rounded-3xl border border-gold/25 p-5 bg-white/5 mt-3">
          <p className={`text-xs font-bold text-gold ${urduCls(lang)}`}>{t(lang, 'explanationLabel')}</p>
          <p className={`text-sm leading-relaxed mt-1.5 ${urduCls(lang)}`}>{expl}</p>
          {lang !== 'en' && <p className="text-xs opacity-70 leading-relaxed mt-2">{h.en}</p>}
        </div>
        <div className="flex gap-2 mt-3">
          <button disabled={sel === 0} onClick={() => setSel(sel - 1)} className="flex-1 py-3 rounded-2xl border border-gold/40 font-bold text-sm disabled:opacity-40">{t(lang, 'prevBtn')}</button>
          <button disabled={sel === nawawiHadith.length - 1} onClick={() => setSel(sel + 1)} className="flex-1 py-3 rounded-2xl border border-gold/40 font-bold text-sm disabled:opacity-40">{t(lang, 'nextBtn')}</button>
        </div>
        <p className={`text-[11px] opacity-60 mt-3 ${urduCls(lang)}`}>{t(lang, 'nawawiSourceNote')}</p>
      </Shell>
    )
  }
  return (
    <Shell title={t(lang, 'nawawiTitle')} sub={t(lang, 'nawawiSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {nawawiHadith.map((h, i) => (
          <button key={h.n} onClick={() => setSel(i)} className="w-full flex items-center gap-3 rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold text-xs font-extrabold flex items-center justify-center shrink-0">{h.n}</span>
            <span className={`flex-1 text-xs leading-relaxed line-clamp-2 ${urduCls(lang)}`}>{pick(h, lang)}</span>
            <ChevronRight size={15} className="opacity-50 shrink-0" />
          </button>
        ))}
      </div>
    </Shell>
  )
}
