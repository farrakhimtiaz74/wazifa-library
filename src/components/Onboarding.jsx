import React, { useState } from 'react'
import { BookOpen, CloudOff, ListChecks } from 'lucide-react'
import { t } from '../lib/i18n'

// Item 86: 3-step first-run overlay, shown once (localStorage flag in uiPrefs).
export default function Onboarding({ lang = 'en', onDone }) {
  const [step, setStep] = useState(0)
  const steps = [
    { icon: BookOpen, title: t(lang, 'obWelcomeTitle'), text: t(lang, 'obWelcomeText') },
    { icon: CloudOff, title: t(lang, 'obOfflineTitle'), text: t(lang, 'obOfflineText') },
    { icon: ListChecks, title: t(lang, 'obRoutineTitle'), text: t(lang, 'obRoutineText') }
  ]
  const s = steps[step]
  const Icon = s.icon
  const urdu = lang === 'ur'
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-gold/40 bg-[#0a3527] dark:bg-[#0a3527] bg-[#fffdf8] p-6 text-center">
        <span className="mx-auto w-16 h-16 rounded-full bg-gold/15 border border-gold/40 grid place-items-center text-gold"><Icon size={30} /></span>
        <h2 className={`text-xl font-extrabold mt-4 ${urdu ? 'font-urdu' : ''}`}>{s.title}</h2>
        <p className={`text-sm leading-relaxed opacity-85 mt-2 ${urdu ? 'font-urdu' : ''}`}>{s.text}</p>
        <div className="flex justify-center gap-1.5 mt-5">
          {steps.map((_, i) => <span key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-gold' : 'bg-gold/30'}`} />)}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onDone} className={`flex-1 py-3 rounded-2xl border border-gold/40 font-bold text-sm ${urdu ? 'font-urdu' : ''}`}>{t(lang, 'obSkip')}</button>
          {step < steps.length - 1
            ? <button onClick={() => setStep(step + 1)} className={`flex-1 py-3 rounded-2xl bg-gold text-black font-bold text-sm ${urdu ? 'font-urdu' : ''}`}>{t(lang, 'obNext')}</button>
            : <button onClick={onDone} className={`flex-1 py-3 rounded-2xl bg-gold text-black font-bold text-sm ${urdu ? 'font-urdu' : ''}`}>{t(lang, 'obStart')}</button>}
        </div>
      </div>
    </div>
  )
}
