import React, { useRef, useState } from 'react'
import { ArrowLeft, BookOpen, Check, Headphones, Search, Square } from 'lucide-react'
import { juzAmmaSurahs } from '../data/juzAmma'
import { t } from '../lib/i18n'

const READ_KEY = 'wl-juz-read'

function loadRead() {
  try { const v = JSON.parse(localStorage.getItem(READ_KEY)); return Array.isArray(v) ? v : [] } catch { return [] }
}

export default function SurahView({ lang = 'en', onBack }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [readList, setReadList] = useState(loadRead)
  const [speaking, setSpeaking] = useState(false)
  const [toast, setToast] = useState('')
  const chunksRef = useRef([])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function stopSpeaking() {
    chunksRef.current = []
    try { window.speechSynthesis.cancel() } catch { /* no speech */ }
    setSpeaking(false)
  }

  function listen(surah) {
    if (speaking) { stopSpeaking(); return }
    const synth = window.speechSynthesis
    if (!synth) { showToast('No Arabic voice on this device'); return }
    const queue = String(surah.arabic || '').split('۝').map((s) => s.trim()).filter(Boolean)
    chunksRef.current = queue
    const voices = synth.getVoices()
    const arVoice = voices.find((v) => /^ar/i.test(v.lang))
    let idx = 0
    setSpeaking(true)
    const speakNext = () => {
      if (idx >= chunksRef.current.length || idx >= queue.length) { setSpeaking(false); return }
      const u = new SpeechSynthesisUtterance(queue[idx])
      u.lang = 'ar-SA'
      if (arVoice) u.voice = arVoice
      u.rate = 0.82
      u.onend = () => { idx += 1; speakNext() }
      u.onerror = () => setSpeaking(false)
      synth.speak(u)
    }
    speakNext()
    setTimeout(() => {
      const vs = synth.getVoices()
      if (!vs.some((v) => /^ar/i.test(v.lang))) showToast('No Arabic voice on this device — using default voice')
    }, 600)
  }

  function toggleRead(num) {
    const next = readList.includes(num) ? readList.filter((n) => n !== num) : [...readList, num]
    setReadList(next)
    try { localStorage.setItem(READ_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }

  if (selected) {
    const isRead = readList.includes(selected.number)
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <div className="flex items-center justify-between">
          <button onClick={() => { stopSpeaking(); setSelected(null) }} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
          <button onClick={() => listen(selected)} className="p-2" aria-label={speaking ? t(lang, 'stop') : t(lang, 'listen')}>
            {speaking ? <Square size={18} className="text-gold" /> : <Headphones size={19} />}
          </button>
        </div>
        {toast && <p className="text-right text-[11px] text-amber-400 font-bold mt-0.5">{toast}</p>}
        <h2 className="text-xl font-extrabold mt-3">{selected.number}. Surah {selected.name} <span className="font-arabic text-lg" dir="rtl">سورة {selected.arabicName}</span></h2>
        <p className="text-[11px] opacity-70 mt-1">{selected.ayahs} {t(lang, 'ayahs')} · Juz Amma (30)</p>
        <div className="rounded-3xl border border-gold/25 p-5 mt-4 bg-white/5">
          <p className="font-arabic text-center text-2xl" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p className="font-arabic text-center mt-4" dir="rtl" style={{ fontSize: 28 }}>{selected.arabic}</p>
          {selected.english && <p className="mt-5 text-sm leading-relaxed">{selected.english}</p>}
          {selected.urdu && <p className="font-urdu mt-4 text-base text-right" dir="rtl">{selected.urdu}</p>}
        </div>
        <button onClick={() => toggleRead(selected.number)} className={`mt-4 w-full py-3 rounded-2xl font-bold text-sm inline-flex items-center justify-center gap-1.5 ${isRead ? 'bg-gold/20 border border-gold text-gold' : 'bg-gold text-black'}`}>
          <Check size={16} /> {isRead ? t(lang, 'readDone') : t(lang, 'markRead')}
        </button>
      </div>
    )
  }

  const q = query.trim().toLowerCase()
  const list = juzAmmaSurahs.filter((s) => !q || s.name.toLowerCase().includes(q) || String(s.number) === q || s.arabicName.includes(query.trim()))

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 inline-flex items-center gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}><BookOpen className="text-gold" /> {t(lang, 'juzAmma')}</h2>
      <p className={`text-xs opacity-70 mt-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'juzAmmaSub')} · {readList.length}/20 {t(lang, 'readDone')}</p>
      <div className="relative mt-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t(lang, 'searchSurah')} className="w-full rounded-2xl border border-gold/25 bg-white/5 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-gold" />
      </div>
      <div className="space-y-2 mt-3">
        {list.map((s) => (
          <button key={s.number} onClick={() => setSelected(s)} className="w-full flex items-center gap-3 rounded-2xl border border-gold/20 p-3.5 bg-white/5 text-left active:scale-[0.99]">
            <span className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 grid place-items-center text-xs font-extrabold text-gold shrink-0">{s.number}</span>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-sm truncate">Surah {s.name}</span>
              <span className="block text-[11px] opacity-60">{s.ayahs} {t(lang, 'ayahs')}</span>
            </span>
            <span className="font-arabic text-xl shrink-0" dir="rtl">{s.arabicName}</span>
            {readList.includes(s.number) && <Check size={17} className="text-emerald-400 shrink-0" />}
          </button>
        ))}
        {list.length === 0 && <p className="text-sm opacity-70 text-center py-8">{t(lang, 'noResults')}</p>}
      </div>
    </div>
  )
}
