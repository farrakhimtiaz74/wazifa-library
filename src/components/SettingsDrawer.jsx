import React, { useEffect, useState } from 'react'
import { X, LogOut, Bell, BookOpen, ChevronRight, Database, Download, Info, MapPin, Navigation, Newspaper, ShieldCheck, SlidersHorizontal, Target, Type, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getSetting, setSetting } from '../lib/db'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { CITY_PRESETS, loadLocation, saveLocation } from '../lib/prayerTimes'
import { APP_VERSION_LABEL, loadIntention, saveIntention } from '../lib/uiPrefs'
import { t } from '../lib/i18n'
import { AccessibilityPage, ArabicFontPage, DataStoragePage, DhikrGoalsPage, HomeTilesPage, NavCustomPage, OfflinePacksPage, PrivacyPage, ProfilesPage, SourcesPage, WhatsNewPage } from './SettingsPages'

export default function SettingsDrawer({ open, onClose, theme, onToggleTheme, lang = 'en', onSetLang, onDataRestored, homeTiles, onHomeTilesChange, navItems, onNavItemsChange, a11y, onA11yChange, arabicFont, onArabicFontChange, navLabel, kidsMode = false, onKidsModeChange }) {
  const { user, signInWithGoogle, signInWithEmailLink, signInWithPassword, signOut } = useAuth()
  const [page, setPage] = useState('main')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [reminderOn, setReminderOn] = useState(false)
  const [reminderTime, setReminderTime] = useState('07:00')
  const [intentionOn, setIntentionOn] = useState(loadIntention)
  const [loc, setLoc] = useState(null)
  const [locMsg, setLocMsg] = useState('')

  useEffect(() => {
    if (!open) return
    setPage('main')
    getSetting('preferences', {}).then((p) => setName(p.display_name || ''))
    getSetting('reminder', { enabled: false, time: '07:00' }).then((r) => { setReminderOn(!!r.enabled); setReminderTime(r.time || '07:00') })
    setLoc(loadLocation())
  }, [open ])

  function pickCity(cityName) {
    const city = CITY_PRESETS.find((c) => c.name === cityName)
    if (!city) return
    const next = { ...city }
    saveLocation(next)
    setLoc(next)
    setLocMsg(t(lang, 'locationSet'))
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) { setLocMsg(t(lang, 'locationFail')); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { name: 'My Location', country: '', lat: Math.round(pos.coords.latitude * 10000) / 10000, lng: Math.round(pos.coords.longitude * 10000) / 10000 }
        saveLocation(next)
        setLoc(next)
        setLocMsg(t(lang, 'locationSet'))
      },
      () => setLocMsg(t(lang, 'locationFail')),
      { timeout: 10000 }
    )
  }

  if (!open) return null

  async function saveName(v) { setName(v); const p = await getSetting('preferences', {}); await setSetting('preferences', { ...p, display_name: v }) }

  async function saveReminder(enabled, time) {
    setReminderOn(enabled); setReminderTime(time)
    await setSetting('reminder', { enabled, time })
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission() } catch { /* permission optional */ }
    }
    if (enabled && 'Notification' in window && Notification.permission === 'denied') {
      setMsg(t(lang, 'notifBlocked'))
    }
  }

  const sectionTitle = 'text-sm font-bold mb-2'
  const rowCls = 'w-full flex items-center gap-2.5 py-3 border-b border-gold/10 text-left'
  const navRow = (target, Icon, label) => (
    <button onClick={() => setPage(target)} className={rowCls}>
      <Icon size={16} className="text-gold shrink-0" />
      <span className={`flex-1 text-sm font-bold ${lang === 'ur' ? 'font-urdu' : ''}`}>{label}</span>
      <ChevronRight size={15} className="opacity-50 shrink-0" />
    </button>
  )
  const back = () => setPage('main')

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-end" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm h-full overflow-y-auto bg-[#0a3527] dark:bg-[#0a3527] bg-[#fffdf8] border-l border-gold/30 p-5">
        {page === 'profiles' ? <ProfilesPage lang={lang} onBack={back} />
        : page === 'goals' ? <DhikrGoalsPage lang={lang} onBack={back} />
        : page === 'a11y' ? <AccessibilityPage lang={lang} onBack={back} a11y={a11y} onA11yChange={onA11yChange} />
        : page === 'arabicFont' ? <ArabicFontPage lang={lang} onBack={back} arabicFont={arabicFont} onArabicFontChange={onArabicFontChange} />
        : page === 'homeTiles' ? <HomeTilesPage lang={lang} onBack={back} homeTiles={homeTiles} onHomeTilesChange={onHomeTilesChange} />
        : page === 'nav' ? <NavCustomPage lang={lang} onBack={back} navItems={navItems} onNavItemsChange={onNavItemsChange} navLabel={navLabel} />
        : page === 'offline' ? <OfflinePacksPage lang={lang} onBack={back} />
        : page === 'sources' ? <SourcesPage lang={lang} onBack={back} />
        : page === 'privacy' ? <PrivacyPage lang={lang} onBack={back} />
        : page === 'whatsnew' ? <WhatsNewPage lang={lang} onBack={back} />
        : page === 'data' ? <DataStoragePage lang={lang} onBack={back} onDataRestored={onDataRestored} />
        : (
          <>
            <div className="flex items-center justify-between"><h3 className={`font-extrabold ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'profileSettings')}</h3><button onClick={onClose} aria-label={t(lang, 'closeBtn')}><X /></button></div>

            {/* D1: when Supabase is not configured there is NO sync UI at all —
                just a plain guest note. The whole sign-in section only exists
                when sync is actually configured. */}
            {!isSupabaseConfigured && <p className={`mt-4 text-xs rounded-xl border border-gold/30 bg-gold/10 p-3 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'guestNote')}</p>}
            {isSupabaseConfigured && (user ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm">{t(lang, 'signedInAs')} <b>{user.email}</b></p>
                <input value={name} onChange={(e) => saveName(e.target.value)} placeholder={t(lang, 'displayName')} className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm" />
                <button onClick={async () => { await signOut(); onClose() }} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-red-400/50 text-red-300 text-xs font-bold"><LogOut size={13} /> {t(lang, 'signOut')}</button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs opacity-75 leading-relaxed">{t(lang, 'guestExplainer')}</p>
                <button onClick={async () => { const r = await signInWithGoogle(); if (r?.error) setMsg(r.error.message) }} className="w-full py-3 rounded-2xl bg-gold text-black font-bold text-sm">{t(lang, 'continueGoogle')}</button>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t(lang, 'emailPh')} type="email" className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t(lang, 'passwordPh')} type="password" className="w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <button disabled={!email} onClick={async () => { const r = await signInWithEmailLink(email); setMsg(r?.error ? r.error.message : t(lang, 'magicSent')) }} className="py-2.5 rounded-xl border border-gold font-bold text-xs disabled:opacity-40">{t(lang, 'magicLinkBtn')}</button>
                  <button disabled={!email || !password} onClick={async () => { const r = await signInWithPassword(email, password); setMsg(r?.error ? r.error.message : t(lang, 'signedInMsg')) }} className="py-2.5 rounded-xl border border-gold font-bold text-xs disabled:opacity-40">{t(lang, 'emailPassBtn')}</button>
                </div>
                {msg && <p className="text-xs text-gold">{msg}</p>}
              </div>
            ))}

            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={sectionTitle}>{t(lang, 'profilesTitle')}</p>
              {navRow('profiles', Users, t(lang, 'profilesTitle'))}
            </div>

            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={sectionTitle}>{t(lang, 'language')}</p>
              <div className="flex gap-2">
                <button onClick={() => onSetLang && onSetLang('en')} className={`px-3 py-2 rounded-full border text-xs font-bold ${lang === 'en' ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>English</button>
                <button onClick={() => onSetLang && onSetLang('ur')} className={`px-3 py-2 rounded-full border text-xs font-bold font-urdu ${lang === 'ur' ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>اردو</button>
                <button onClick={() => onSetLang && onSetLang('roman')} className={`px-3 py-2 rounded-full border text-xs font-bold ${lang === 'roman' ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>Roman Urdu</button>
              </div>
            </div>

            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={`${sectionTitle} inline-flex items-center gap-1.5`}><Bell size={14} /> {t(lang, 'reminderTitle')}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => saveReminder(!reminderOn, reminderTime)} className={`px-3 py-2 rounded-full border text-xs font-bold ${reminderOn ? 'bg-gold text-black border-gold' : 'border-gold/40'}`} aria-pressed={reminderOn}>{reminderOn ? t(lang, 'on') : t(lang, 'off')}</button>
                <input type="time" value={reminderTime} onChange={(e) => saveReminder(reminderOn, e.target.value)} className="rounded-xl border border-gold/25 bg-white/5 px-3 py-2 text-sm" aria-label={t(lang, 'reminderTitle')} />
              </div>
              <p className="text-[11px] opacity-60 mt-2 leading-relaxed">{t(lang, 'reminderHelp')}</p>
              {msg && isSupabaseConfigured === false && <p className="text-xs text-gold mt-1">{msg}</p>}
            </div>

            {/* Item 69 (Wave 5): Intention screen toggle (default OFF) */}
            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={sectionTitle}>{t(lang, 'intentionTitle')}</p>
              <button onClick={() => { const v = !intentionOn; setIntentionOn(v); saveIntention(v) }} className={`px-3 py-2 rounded-full border text-xs font-bold ${intentionOn ? 'bg-gold text-black border-gold' : 'border-gold/40'}`} aria-pressed={intentionOn}>{intentionOn ? t(lang, 'on') : t(lang, 'off')}</button>
              <p className={`text-[11px] opacity-60 mt-2 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'intentionHelp')}</p>
            </div>

            {/* Item 50 (Wave 4): Kids Mode toggle */}
            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={sectionTitle}>{t(lang, 'kidsModeLabel')}</p>
              <button onClick={() => onKidsModeChange && onKidsModeChange(!kidsMode)} className={`px-3 py-2 rounded-full border text-xs font-bold ${kidsMode ? 'bg-gold text-black border-gold' : 'border-gold/40'}`} aria-pressed={kidsMode}>{kidsMode ? t(lang, 'on') : t(lang, 'off')}</button>
              <p className={`text-[11px] opacity-60 mt-2 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'kidsModeHelp')}</p>
            </div>

            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={`${sectionTitle} inline-flex items-center gap-1.5`}><MapPin size={14} /> {t(lang, 'locationTitle')}</p>
              <div className="flex flex-wrap items-center gap-2">
                <select value={loc && CITY_PRESETS.some((c) => c.name === loc.name) ? loc.name : ''} onChange={(e) => pickCity(e.target.value)} className="flex-1 min-w-[150px] rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold" aria-label={t(lang, 'locationTitle')}>
                  <option value="" disabled>{loc ? loc.name : t(lang, 'selectCity')}</option>
                  {CITY_PRESETS.map((c) => <option key={c.name} value={c.name} className="text-black">{c.name}{c.country ? `, ${c.country}` : ''}</option>)}
                </select>
                <button onClick={useMyLocation} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-gold/40 text-xs font-bold"><Navigation size={13} /> {t(lang, 'useMyLocation')}</button>
              </div>
              {loc && <p className="text-[11px] opacity-60 mt-2">{loc.name} · {loc.lat}, {loc.lng}{loc.isDefault ? ` (${t(lang, 'defaultCity')})` : ''}</p>}
              {locMsg && <p className="text-xs text-gold mt-1">{locMsg}</p>}
              <p className="text-[11px] opacity-60 mt-2 leading-relaxed">{t(lang, 'locationHelp')}</p>
            </div>

            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={sectionTitle}>{t(lang, 'appearance')}</p>
              <button onClick={onToggleTheme} className="px-3 py-2 rounded-full border border-gold/40 text-xs font-bold">{theme === 'dark' ? t(lang, 'toLight') : t(lang, 'toDark')}</button>
              <div className="mt-2">
                {navRow('arabicFont', Type, t(lang, 'arabicFontTitle'))}
                {navRow('a11y', SlidersHorizontal, t(lang, 'a11yTitle'))}
              </div>
              <p className="text-[11px] opacity-60 mt-3 leading-relaxed">{t(lang, 'appearanceNote')}</p>
            </div>

            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={sectionTitle}>{t(lang, 'customiseTitle')}</p>
              {navRow('homeTiles', SlidersHorizontal, t(lang, 'homeTilesTitle'))}
              {navRow('nav', Navigation, t(lang, 'navTitle'))}
              {navRow('goals', Target, t(lang, 'goalsTitle'))}
            </div>

            <div className="mt-6 border-t border-gold/20 pt-4">
              <p className={sectionTitle}>{t(lang, 'appName')}</p>
              {navRow('offline', Download, t(lang, 'offlineTitle'))}
              {navRow('data', Database, t(lang, 'dataTitle'))}
              {navRow('sources', BookOpen, t(lang, 'sourcesTitle'))}
              {navRow('privacy', ShieldCheck, t(lang, 'privacyTitle'))}
              {navRow('whatsnew', Newspaper, t(lang, 'whatsNewTitle'))}
              <p className="text-[11px] opacity-50 mt-3 inline-flex items-center gap-1"><Info size={11} /> {APP_VERSION_LABEL}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
