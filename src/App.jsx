import React, { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { BarChart3, Bell, BookMarked, BookOpen, CalendarDays, Compass, Flame, GraduationCap, Home, LayoutGrid, ListChecks, Moon, ScrollText, Settings, Sparkles, Sun, Wrench, X } from 'lucide-react'
import { wazifaData } from './data/wazifaData'
import { adhkarSets } from './data/adhkarSets'
import { rabbanaSet } from './data/rabbanaSets'
import { dailyQuotes } from './data/dailyQuotes'
import { db, getSetting, recordHistorySnapshot, setSetting, todayLocal, queueSync } from './lib/db'
import { syncNow } from './lib/sync'
import { categoryLabel, loadLang, saveLang, t } from './lib/i18n'
import { APP_VERSION, intentionShownDate, isOnboarded, lastSeenVersion, loadA11y, loadArabicFont, loadHomeTiles, loadIntention, loadKidsMode, loadNavItems, saveA11y, saveArabicFont, saveHomeTiles, saveKidsMode, saveNavItems, setIntentionShownDate, setLastSeenVersion, setOnboarded } from './lib/uiPrefs'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import WazifaCard from './components/WazifaCard'
import WazifaReader from './components/WazifaReader'
import RoutineView from './components/RoutineView'
import NamesView from './components/NamesView'
import HistoryView from './components/HistoryView'
import AdhkarRunner from './components/AdhkarRunner'
import CustomWazifaModal from './components/CustomWazifaModal'
import SettingsDrawer from './components/SettingsDrawer'
import InstallPrompt from './components/InstallPrompt'
import PrayerStrip from './components/PrayerStrip'
import QiblaCompass from './components/QiblaCompass'
import SurahView from './components/SurahView'
import RoutineRing from './components/RoutineRing'
import QuranView from './components/QuranView'
import PrayerHub from './components/PrayerHub'
import { ALERT_PRAYERS, loadPrayerAlerts } from './lib/quran'
import { fetchPrayerTimes, loadLocation } from './lib/prayerTimes'
import Onboarding from './components/Onboarding'
import CategoriesView from './components/CategoriesView'
import TodayCard from './components/TodayCard'
import FridayChecklist from './components/FridayChecklist'
import WhatsNewModal from './components/WhatsNew'
import TasbihHub from './components/TasbihHub'
import DuaHub, { DebtPackView, DuaJournalView, ExamPackView, HisnulView, MoodView, NikahView, ParentsView, PregnancyView, QuoteArchiveView } from './components/DuaViews'
import { nameOfTheDay } from './components/NamesView'
import LearnHub, { AlphabetView, FlashcardsView, PathView, QuizView, WordDayView } from './components/LearnHub'
import { NawawiView, ProphetsView, SahabaView, SeerahView } from './components/StoriesViews'
import KidsView from './components/KidsView'
import SeasonsHub, { DhulHijjahView, EidView, FidyaView, IslamicYearView, MuharramView, QadrView, RamadanDuasView, RamadanView, ZakatView } from './components/SeasonsViews'
import HabitsHub, { AchievementsView, ChallengesView, EveningFlowView, FastingView, GratitudeView, MorningFlowView, ReportView, SleepView } from './components/HabitsViews'
import SharingHub, { FamilyView, GiftView, StatusPackView } from './components/SharingViews'
import ToolsHub, { BabyNamesView, ConverterView, DebtTrackerView, HajjView, JanazaView, NikahChecklistView, SadaqahView, TravelView, UmrahView } from './components/ToolsViews'
import { presetByKey, presetWazifa } from './data/dhikrPresets'

const FREE_TASBIH = {
  id: 'free-tasbih',
  title: 'Free Tasbih',
  category: 'Daily Adhkar',
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
  transliteration: 'SubhanAllahi wa bihamdihi — or any dhikr you wish.',
  english_translation: 'Glory be to Allah and praise Him. In free mode you may recite any dhikr; the counter simply counts without a target.',
  urdu_translation: 'اللہ پاک ہے اور اسی کی تعریف ہے۔ فری موڈ میں آپ کوئی بھی ذکر کر سکتے ہیں؛ کاؤنٹر بغیر کسی حد کے گنتا رہے گا۔',
  target_count: 33,
  recommended_time: 'Any Time',
  reference: 'Sahih al-Bukhari 6405, Sahih Muslim',
  instructions: '',
  keywords: []
}

const NAV_ICONS = { home: Home, routine: ListChecks, names: BookOpen, history: BarChart3, categories: LayoutGrid, quran: BookMarked, learn: GraduationCap, seasons: CalendarDays, habits: Flame, tools: Wrench, settings: Settings }

export default function App() {
  const [view, setView] = useState('home')
  const [backView, setBackView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [adhkarId, setAdhkarId] = useState('morning')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [situation, setSituation] = useState(null)
  const [routines, setRoutines] = useState({})
  const [customs, setCustoms] = useState([])
  const [streak, setStreak] = useState(0)
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState(loadLang)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [editingCustom, setEditingCustom] = useState(null)
  const [reminderBanner, setReminderBanner] = useState(false)
  const [prayerAlert, setPrayerAlert] = useState(null)
  const [homeTiles, setHomeTiles] = useState(loadHomeTiles)
  const [navItems, setNavItems] = useState(loadNavItems)
  const [kidsMode, setKidsMode] = useState(loadKidsMode)
  const [a11y, setA11y] = useState(loadA11y)
  const [arabicFont, setArabicFont] = useState(loadArabicFont)
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboarded())
  const [showWhatsNew, setShowWhatsNew] = useState(() => isOnboarded() && lastSeenVersion() !== APP_VERSION)
  const [gift, setGift] = useState(null) // item 75: { preset, target, message }
  const [showIntention, setShowIntention] = useState(false) // item 69
  const routinesRef = useRef({})
  routinesRef.current = routines
  const langRef = useRef(lang)
  langRef.current = lang
  const streakRef = useRef(streak)
  streakRef.current = streak

  const allWazaif = useMemo(() => [...wazifaData, ...customs.map((c) => ({ ...c, reference: c.reference || 'Personal / Custom', keywords: c.keywords || [] }))], [customs])

  const wazifaOfDay = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const doy = Math.floor((now - start) / 86400000)
    return wazifaData[doy % wazifaData.length]
  }, [])

  const quoteOfDay = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const doy = Math.floor((now - start) / 86400000)
    return dailyQuotes[doy % dailyQuotes.length]
  }, [])

  const isFriday = new Date().getDay() === 5
  const kahfEntry = useMemo(() => wazifaData.find((w) => w.id === 'surah-al-kahf'), [])
  const duroodEntry = useMemo(() => wazifaData.find((w) => w.id === 'durood-e-ibrahimi'), [])

  async function refresh() {
    const rows = await db.routines.toArray()
    const map = {}; rows.forEach((r) => { map[r.wazifa_id] = r })
    setRoutines(map)
    setCustoms(await db.customWazaif.toArray())
    setStreak(await getSetting('daily_streak', 0))
    await recordHistorySnapshot(todayLocal())
  }

  async function ensureDailyReset() {
    const today = todayLocal()
    const lastReset = await getSetting('last_global_reset', null)
    if (lastReset === today) return false
    if (lastReset) await recordHistorySnapshot(lastReset)
    const rows = await db.routines.toArray()
    const bookmarked = rows.filter((r) => r.is_bookmarked)
    const allDone = bookmarked.length > 0 && bookmarked.every((r) => r.completed_today)
    const countedDate = await getSetting('streak_counted_date', null)
    if (lastReset && allDone && countedDate !== lastReset) {
      const s = (await getSetting('daily_streak', 0)) + 1
      await setSetting('daily_streak', s)
      await setSetting('streak_counted_date', lastReset)
    }
    for (const r of rows) await db.routines.put({ ...r, current_count: 0, completed_today: false, rounds_today: 0, last_reset_date: today, updated_at: new Date().toISOString() })
    await setSetting('last_global_reset', today)
    await setSetting('taps_today', 0)
    await setSetting('taps_today_date', today)
    return true
  }

  useEffect(() => {
    ;(async () => {
      const prefs = await getSetting('preferences', {})
      const t2 = prefs.theme || 'dark'; setTheme(t2); document.documentElement.classList.toggle('dark', t2 === 'dark')
      await ensureDailyReset()
      await refresh(); syncNow()
      try {
        const params = new URLSearchParams(window.location.search)
        const open = params.get('open')
        if (open === 'tasbih') { setBackView('home'); setSelected(FREE_TASBIH); setView('reader') }
        else if (open === 'morning' || open === 'evening' || open === 'rabbana') { setAdhkarId(open); setView('adhkar') }
        // Item 72: ?w=<id> opens that wazifa in the reader directly.
        const wId = params.get('w')
        if (wId) {
          const customRows = await db.customWazaif.toArray()
          const found = wazifaData.find((x) => x.id === wId) || customRows.find((x) => x.id === wId)
          if (found) { setBackView('home'); setSelected({ ...found, reference: found.reference || 'Personal / Custom', keywords: found.keywords || [] }); setView('reader') }
        }
        // Item 75: ?gift=<presetKey>&n=<target>&m=<msg> shows the gift card.
        const giftKey = params.get('gift')
        if (giftKey && presetByKey(giftKey)) {
          const n = Math.max(1, Math.floor(Number(params.get('n')) || 100))
          setGift({ preset: presetByKey(giftKey), target: n, message: params.get('m') || '' })
        }
        // Item 69: intention screen — only when nothing else is about to
        // show (onboarding / What's New take precedence this launch).
        if (loadIntention() && isOnboarded() && lastSeenVersion() === APP_VERSION && intentionShownDate() !== todayLocal()) {
          setShowIntention(true)
        }
      } catch { /* deep link is optional */ }
    })()
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'ur' ? 'ur' : 'en'
  }, [lang])

  // Item 93: large-text scales the root font size (Tailwind sizes are rem-based).
  useEffect(() => {
    document.documentElement.classList.toggle('large-text', !!a11y.largeText)
  }, [a11y])

  useEffect(() => {
    let running = false
    async function onReturn() {
      if (document.visibilityState !== 'visible' || running) return
      running = true
      try { if (await ensureDailyReset()) await refresh() } finally { running = false }
    }
    document.addEventListener('visibilitychange', onReturn)
    window.addEventListener('focus', onReturn)
    return () => { document.removeEventListener('visibilitychange', onReturn); window.removeEventListener('focus', onReturn) }
  }, [])

  useEffect(() => {
    const bookmarked = Object.values(routines).filter((r) => r.is_bookmarked)
    if (bookmarked.length > 0 && bookmarked.every((r) => r.completed_today)) {
      getSetting('streak_counted_date', null).then(async (d) => {
        const today = todayLocal()
        if (d !== today) {
          const s = (await getSetting('daily_streak', 0)) + 1
          await setSetting('daily_streak', s); await setSetting('streak_counted_date', today); setStreak(s)
        }
      })
    }
    if (Object.keys(routines).length) recordHistorySnapshot(todayLocal())
  }, [routines])

  useEffect(() => {
    let alive = true
    async function checkReminder() {
      const r = await getSetting('reminder', { enabled: false, time: '07:00' })
      if (!alive || !r.enabled) return
      const today = todayLocal()
      const reminded = await getSetting('reminder_last_date', null)
      if (reminded === today) return
      const now = new Date()
      const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      if (nowStr < (r.time || '07:00')) return
      const bookmarked = Object.values(routinesRef.current).filter((x) => x.is_bookmarked)
      if (bookmarked.length === 0 || bookmarked.every((x) => x.completed_today)) return
      await setSetting('reminder_last_date', today)
      setReminderBanner(true)
      if ('Notification' in window && Notification.permission === 'granted') {
        try { new Notification(t(langRef.current, 'appName'), { body: t(langRef.current, 'reminderBanner').replace('{streak}', streakRef.current), icon: 'icons/icon-192.png' }) } catch { /* notifications optional */ }
      }
    }
    checkReminder()
    const id = setInterval(checkReminder, 60000)
    return () => { alive = false; clearInterval(id) }
  }, [])

  // Item 13: prayer alerts fire through the same in-app (app-open) mechanism
  // as the reminder above — a banner + optional system notification while the
  // app is open, never a background alarm.
  useEffect(() => {
    let alive = true
    async function checkPrayerAlerts() {
      const alerts = loadPrayerAlerts()
      const active = ALERT_PRAYERS.filter((p) => alerts[p] && alerts[p].on)
      if (!active.length) return
      const res = await fetchPrayerTimes(loadLocation())
      if (!alive || !res || !res.timings) return
      const today = todayLocal()
      let fired = {}
      try { fired = JSON.parse(localStorage.getItem('wl-prayer-alerts-fired')) || {} } catch { fired = {} }
      if (fired.date !== today) fired = { date: today, keys: [] }
      const now = new Date()
      for (const name of active) {
        const tstr = res.timings[name]
        if (!tstr) continue
        const [h, m] = tstr.split(':').map(Number)
        const at = new Date(now); at.setHours(h, m, 0, 0)
        const alertAt = new Date(at.getTime() - (alerts[name].offset || 0) * 60000)
        const key = `${name}@${alerts[name].offset || 0}`
        if (now >= alertAt && now <= new Date(at.getTime() + 30 * 60000) && !fired.keys.includes(key)) {
          fired.keys.push(key)
          try { localStorage.setItem('wl-prayer-alerts-fired', JSON.stringify(fired)) } catch { /* storage unavailable */ }
          setPrayerAlert(name)
          if ('Notification' in window && Notification.permission === 'granted') {
            try { new Notification(t(langRef.current, 'appName'), { body: t(langRef.current, 'prayerAlertBanner').replace('{prayer}', t(langRef.current, `prayer${name}`)), icon: 'icons/icon-192.png' }) } catch { /* notifications optional */ }
          }
        }
      }
    }
    checkPrayerAlerts()
    const id = setInterval(checkPrayerAlerts, 60000)
    return () => { alive = false; clearInterval(id) }
  }, [])

  const fuse = useMemo(() => new Fuse(allWazaif, { keys: ['title', 'arabic', 'transliteration', 'english_translation', 'urdu_translation', 'keywords', 'category'], threshold: 0.35, includeScore: true }), [allWazaif])
  const filtered = useMemo(() => {
    let list = query.trim() ? fuse.search(query).map((r) => r.item) : allWazaif
    if (situation) list = list.filter((w) => situation.ids.includes(w.id))
    else if (category !== 'All') list = list.filter((w) => w.category === category)
    return list
  }, [query, category, situation, allWazaif, fuse])

  async function toggleBookmark(w) {
    const existing = routines[w.id]
    const row = { wazifa_id: w.id, is_bookmarked: !(existing?.is_bookmarked), current_count: existing?.current_count || 0, target_count: existing?.target_count || w.target_count, completed_today: existing?.completed_today || false, rounds_today: existing?.rounds_today || 0, lifetime_count: existing?.lifetime_count || 0, days: existing?.days, last_reset_date: todayLocal(), updated_at: new Date().toISOString() }
    await db.routines.put(row); await queueSync('routine', row); setRoutines((m) => ({ ...m, [w.id]: row })); syncNow()
  }

  function handleRoutineChange(row) {
    setRoutines((m) => ({ ...m, [row.wazifa_id]: row }))
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    getSetting('preferences', {}).then((p) => setSetting('preferences', { ...p, theme: next }))
  }

  function applyLang(next) {
    setLang(next)
    saveLang(next)
  }

  function cycleLang() {
    applyLang(lang === 'en' ? 'ur' : lang === 'ur' ? 'roman' : 'en')
  }

  function changeHomeTiles(v) { setHomeTiles(v); saveHomeTiles(v) }
  function changeNavItems(v) { setNavItems(v); saveNavItems(v) }
  function changeKidsMode(v) { setKidsMode(v); saveKidsMode(v); if (v) setView('home') }
  function changeA11y(v) { setA11y(v); saveA11y(v) }
  function changeArabicFont(v) { setArabicFont(v); saveArabicFont(v) }

  function finishOnboarding() {
    setOnboarded()
    setShowOnboarding(false)
    if (lastSeenVersion() !== APP_VERSION) setShowWhatsNew(true)
  }

  function closeWhatsNew() {
    setLastSeenVersion(APP_VERSION)
    setShowWhatsNew(false)
  }

  // Item 75: starting a gift opens the Tasbih (reader) with the gifted
  // preset loaded at the gifted target.
  function startGift() {
    if (!gift) return
    const w = { ...presetWazifa(gift.preset), target_count: gift.target }
    setGift(null)
    openReader(w, 'home')
  }

  // Item 69: Begin dismisses the intention screen for the rest of the day.
  function beginIntention() {
    setIntentionShownDate(todayLocal())
    setShowIntention(false)
  }

  function openReader(w, from) {
    setBackView(from || view)
    setSelected(w)
    setView('reader')
  }

  function openAdhkar(id) {
    setAdhkarId(id)
    setView('adhkar')
  }

  function navLabel(id) {
    if (id === 'categories') return t(lang, 'categoriesTitle')
    if (id === 'settings') return t(lang, 'settings')
    return t(lang, id)
  }

  const routineItems = allWazaif.filter((w) => routines[w.id]?.is_bookmarked).map((w) => ({ wazifa: w, routine: routines[w.id] }))
  const doneCount = routineItems.filter((i) => i.routine?.completed_today).length

  const tileBtn = (key, Icon, title, sub, onClick) => (
    <button key={key} onClick={onClick} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
      <Icon className="text-gold" size={19} />
      <span className={`block font-bold text-sm mt-1.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{title}</span>
      <span className={`block text-[11px] opacity-70 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{sub}</span>
    </button>
  )

  const tiles = []
  if (homeTiles.adhkar) {
    tiles.push(tileBtn('morning', Sun, t(lang, 'morningAdhkar'), t(lang, 'morningAdhkarSub'), () => openAdhkar('morning')))
    tiles.push(tileBtn('evening', Moon, t(lang, 'eveningAdhkar'), t(lang, 'eveningAdhkarSub'), () => openAdhkar('evening')))
  }
  if (homeTiles.freeTasbih) tiles.push(tileBtn('freetasbih', BookOpen, t(lang, 'freeTasbih'), t(lang, 'freeTasbihSub'), () => openReader(FREE_TASBIH, 'home')))
  if (homeTiles.names) tiles.push(tileBtn('names', Sparkles, t(lang, 'namesTitle'), t(lang, 'namesSub'), () => setView('names')))
  if (homeTiles.rabbana) tiles.push(tileBtn('rabbana', ScrollText, `${rabbanaSet.items.length} Rabbana Duas`, t(lang, 'rabbanaSub'), () => openAdhkar('rabbana')))
  if (homeTiles.juzAmma) tiles.push(tileBtn('juzamma', BookOpen, t(lang, 'juzAmma'), t(lang, 'juzAmmaSub'), () => setView('juzamma')))
  if (homeTiles.qibla) tiles.push(tileBtn('qibla', Compass, t(lang, 'qiblaTitle'), t(lang, 'qiblaSub'), () => setView('qibla')))
  if (homeTiles.quran) tiles.push(tileBtn('quran', BookMarked, t(lang, 'quran'), t(lang, 'quranSub'), () => setView('quran')))
  if (homeTiles.dhikr) tiles.push(tileBtn('dhikr', Sparkles, t(lang, 'dhikrHubTitle'), t(lang, 'dhikrHubSub'), () => setView('tasbih')))
  if (homeTiles.duas) tiles.push(tileBtn('duas', ScrollText, t(lang, 'duaHubTitle'), t(lang, 'duaHubSub'), () => setView('duas')))
  if (homeTiles.nameDay) { const nd = nameOfTheDay(); tiles.push(tileBtn('nameday', Sparkles, `${t(lang, 'nameOfDayLabel')}: ${nd.transliteration}`, nd.english, () => setView('names'))) }
  if (homeTiles.learn) tiles.push(tileBtn('learn', GraduationCap, t(lang, 'learnTitle'), t(lang, 'learnSub'), () => setView('learn')))
  if (homeTiles.seasons) tiles.push(tileBtn('seasons', CalendarDays, t(lang, 'seasonsTitle'), t(lang, 'ramadanSub'), () => setView('seasons')))
  if (homeTiles.habits) tiles.push(tileBtn('habits', Flame, t(lang, 'habitsTitle'), t(lang, 'habitsSub'), () => setView('habits')))
  if (homeTiles.sharing) tiles.push(tileBtn('sharing', Sparkles, t(lang, 'sharingTitle'), t(lang, 'sharingSub'), () => setView('sharing')))
  if (homeTiles.tools) tiles.push(tileBtn('tools', Wrench, t(lang, 'toolsTitle'), t(lang, 'toolsSub'), () => setView('tools')))

  const rootCls = `min-h-screen bg-cream text-[#12211c] dark:bg-deep dark:text-[#f5f1e6] arabic-${arabicFont}${a11y.highContrast ? ' high-contrast' : ''}${a11y.reduceMotion ? ' reduce-motion' : ''}`

  return (
    <div className={rootCls}>
      <Header theme={theme} onToggleTheme={toggleTheme} onOpenSettings={() => setSettingsOpen(true)} streak={streak} lang={lang} onToggleLang={cycleLang} />

      {reminderBanner && (
        <div className="max-w-2xl mx-auto px-4 mt-3">
          <div className="rounded-2xl border border-gold/40 bg-gold/15 p-3.5 flex items-start gap-2.5">
            <Bell className="text-gold shrink-0 mt-0.5" size={18} />
            <p className={`text-xs flex-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'reminderBanner').replace('{streak}', streak)}</p>
            <button onClick={() => { setReminderBanner(false); setView('routine') }} className="px-2.5 py-1 rounded-full bg-gold text-black text-[11px] font-bold shrink-0">{t(lang, 'openBtn')}</button>
            <button onClick={() => setReminderBanner(false)} className="p-1 shrink-0" aria-label={t(lang, 'dismiss')}><X size={14} /></button>
          </div>
        </div>
      )}

      {prayerAlert && (
        <div className="max-w-2xl mx-auto px-4 mt-3">
          <div className="rounded-2xl border border-gold/40 bg-gold/15 p-3.5 flex items-start gap-2.5">
            <Bell className="text-gold shrink-0 mt-0.5" size={18} />
            <p className={`text-xs flex-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'prayerAlertBanner').replace('{prayer}', t(lang, `prayer${prayerAlert}`))}</p>
            <button onClick={() => { setPrayerAlert(null); setView('prayer') }} className="px-2.5 py-1 rounded-full bg-gold text-black text-[11px] font-bold shrink-0">{t(lang, 'openBtn')}</button>
            <button onClick={() => setPrayerAlert(null)} className="p-1 shrink-0" aria-label={t(lang, 'dismiss')}><X size={14} /></button>
          </div>
        </div>
      )}

      {view === 'reader' && selected ? (
        <WazifaReader wazifa={selected} routine={routines[selected.id]} onBack={() => setView(backView === 'reader' ? 'home' : backView)} onToggleBookmark={toggleBookmark} onRoutineChange={handleRoutineChange} lang={lang} freeMode={selected.id === 'free-tasbih'} />
      ) : view === 'adhkar' ? (
        <AdhkarRunner set={adhkarId === 'rabbana' ? rabbanaSet : adhkarSets[adhkarId]} routines={routines} onRoutineChange={handleRoutineChange} onBack={() => setView('home')} lang={lang} />
      ) : view === 'quran' ? (
        <QuranView lang={lang} onBack={() => setView('home')} />
      ) : view === 'prayer' ? (
        <PrayerHub lang={lang} onBack={() => setView('home')} />
      ) : view === 'qibla' ? (
        <QiblaCompass lang={lang} onBack={() => setView('home')} />
      ) : view === 'juzamma' ? (
        <SurahView lang={lang} onBack={() => setView('home')} />
      ) : view === 'categories' ? (
        <CategoriesView allWazaif={allWazaif} lang={lang} onBack={() => setView('home')} onSelect={(c) => { setCategory(c); setSituation(null); setView('home') }} onSelectSituation={(s) => { setSituation(s); setCategory('All'); setView('home') }} />
      ) : view === 'tasbih' ? (
        <TasbihHub lang={lang} routines={routines} onRoutineChange={handleRoutineChange} onBack={() => setView('home')} />
      ) : view === 'duas' ? (
        <DuaHub lang={lang} onBack={() => setView('home')} onNavigate={(p) => setView(p)} />
      ) : view === 'hisnul' ? (
        <HisnulView lang={lang} onBack={() => setView('duas')} onOpenWazifa={(w) => openReader(w, 'hisnul')} onOpenAdhkar={(id) => openAdhkar(id)} />
      ) : view === 'journal' ? (
        <DuaJournalView lang={lang} onBack={() => setView('duas')} />
      ) : view === 'parents' ? (
        <ParentsView lang={lang} onBack={() => setView('duas')} onOpenWazifa={(w) => openReader(w, 'parents')} onOpenAdhkar={(id) => openAdhkar(id)} />
      ) : view === 'exampack' ? (
        <ExamPackView lang={lang} onBack={() => setView('duas')} onOpenWazifa={(w) => openReader(w, 'exampack')} />
      ) : view === 'debtpack' ? (
        <DebtPackView lang={lang} onBack={() => setView('duas')} onOpenWazifa={(w) => openReader(w, 'debtpack')} />
      ) : view === 'pregnancy' ? (
        <PregnancyView lang={lang} onBack={() => setView('duas')} onOpenWazifa={(w) => openReader(w, 'pregnancy')} onOpenAdhkar={(id) => openAdhkar(id)} />
      ) : view === 'nikah' ? (
        <NikahView lang={lang} onBack={() => setView('duas')} onOpenWazifa={(w) => openReader(w, 'nikah')} onOpenAdhkar={(id) => openAdhkar(id)} />
      ) : view === 'mood' ? (
        <MoodView lang={lang} onBack={() => setView('duas')} onOpenWazifa={(w) => openReader(w, 'mood')} />
      ) : view === 'archive' ? (
        <QuoteArchiveView lang={lang} onBack={() => setView('duas')} />
      ) : view === 'learn' ? (
        <LearnHub lang={lang} onBack={() => setView('home')} onNavigate={(v) => setView(v)} />
      ) : view === 'alphabet' ? (
        <AlphabetView lang={lang} onBack={() => setView('learn')} />
      ) : view === 'quiz' ? (
        <QuizView lang={lang} onBack={() => setView('learn')} />
      ) : view === 'seerah' ? (
        <SeerahView lang={lang} onBack={() => setView('learn')} />
      ) : view === 'prophets' ? (
        <ProphetsView lang={lang} onBack={() => setView(kidsMode ? 'home' : 'learn')} onOpenSeerah={() => setView('seerah')} />
      ) : view === 'sahaba' ? (
        <SahabaView lang={lang} onBack={() => setView('learn')} />
      ) : view === 'nawawi' ? (
        <NawawiView lang={lang} onBack={() => setView('learn')} />
      ) : view === 'path' ? (
        <PathView lang={lang} onBack={() => setView('learn')} onNavigate={(v) => setView(v)} />
      ) : view === 'wordday' ? (
        <WordDayView lang={lang} onBack={() => setView('learn')} />
      ) : view === 'flashcards' ? (
        <FlashcardsView lang={lang} onBack={() => setView('learn')} />
      ) : view === 'seasons' ? (
        <SeasonsHub lang={lang} onBack={() => setView('home')} onNavigate={(v) => setView(v)} />
      ) : view === 'ramadan' ? (
        <RamadanView lang={lang} onBack={() => setView('seasons')} onNavigate={(v) => setView(v)} />
      ) : view === 'qadr' ? (
        <QadrView lang={lang} onBack={() => setView('seasons')} />
      ) : view === 'ramadanduas' ? (
        <RamadanDuasView lang={lang} onBack={() => setView('seasons')} onOpenWazifa={(w) => openReader(w, 'ramadanduas')} />
      ) : view === 'zakat' ? (
        <ZakatView lang={lang} onBack={() => setView('seasons')} />
      ) : view === 'fidya' ? (
        <FidyaView lang={lang} onBack={() => setView('seasons')} />
      ) : view === 'eid' ? (
        <EidView lang={lang} onBack={() => setView('seasons')} />
      ) : view === 'dhulhijjah' ? (
        <DhulHijjahView lang={lang} onBack={() => setView('seasons')} onNavigate={(v) => setView(v)} />
      ) : view === 'muharram' ? (
        <MuharramView lang={lang} onBack={() => setView('seasons')} onNavigate={(v) => setView(v)} />
      ) : view === 'islamicyear' ? (
        <IslamicYearView lang={lang} onBack={() => setView('seasons')} />
      ) : view === 'habits' ? (
        <HabitsHub lang={lang} onBack={() => setView('home')} onNavigate={(v) => setView(v)} />
      ) : view === 'challenges' ? (
        <ChallengesView lang={lang} onBack={() => setView('habits')} onNavigate={(v) => setView(v)} />
      ) : view === 'gratitude' ? (
        <GratitudeView lang={lang} onBack={() => setView('habits')} />
      ) : view === 'sleep' ? (
        <SleepView lang={lang} onBack={() => setView('habits')} onOpenWazifa={(w) => openReader(w, 'sleep')} />
      ) : view === 'morningflow' ? (
        <MorningFlowView lang={lang} onBack={() => setView('habits')} onNavigate={(v) => setView(v)} onOpenAdhkar={openAdhkar} quote={quoteOfDay} streak={streak} />
      ) : view === 'eveningflow' ? (
        <EveningFlowView lang={lang} onBack={() => setView('habits')} onNavigate={(v) => setView(v)} onOpenAdhkar={openAdhkar} quote={quoteOfDay} streak={streak} />
      ) : view === 'report' ? (
        <ReportView lang={lang} onBack={() => setView('habits')} />
      ) : view === 'achievements' ? (
        <AchievementsView lang={lang} onBack={() => setView('habits')} />
      ) : view === 'fasting' ? (
        <FastingView lang={lang} onBack={() => setView('habits')} />
      ) : view === 'sharing' ? (
        <SharingHub lang={lang} onBack={() => setView('home')} onNavigate={(v) => setView(v)} />
      ) : view === 'family' ? (
        <FamilyView lang={lang} onBack={() => setView('sharing')} />
      ) : view === 'statuspack' ? (
        <StatusPackView lang={lang} onBack={() => setView('sharing')} />
      ) : view === 'gift' ? (
        <GiftView lang={lang} onBack={() => setView('sharing')} />
      ) : view === 'tools' ? (
        <ToolsHub lang={lang} onBack={() => setView('home')} onNavigate={(v) => setView(v)} />
      ) : view === 'converter' ? (
        <ConverterView lang={lang} onBack={() => setView('tools')} />
      ) : view === 'babynames' ? (
        <BabyNamesView lang={lang} onBack={() => setView('tools')} />
      ) : view === 'janaza' ? (
        <JanazaView lang={lang} onBack={() => setView('tools')} onNavigate={(v) => setView(v)} />
      ) : view === 'umrah' ? (
        <UmrahView lang={lang} onBack={() => setView('tools')} />
      ) : view === 'hajj' ? (
        <HajjView lang={lang} onBack={() => setView('tools')} onNavigate={(v) => setView(v)} />
      ) : view === 'nikahlist' ? (
        <NikahChecklistView lang={lang} onBack={() => setView('tools')} onNavigate={(v) => setView(v)} />
      ) : view === 'travel' ? (
        <TravelView lang={lang} onBack={() => setView('tools')} onOpenWazifa={(w) => openReader(w, 'travel')} />
      ) : view === 'sadaqah' ? (
        <SadaqahView lang={lang} onBack={() => setView('tools')} />
      ) : view === 'debttracker' ? (
        <DebtTrackerView lang={lang} onBack={() => setView('tools')} onNavigate={(v) => setView(v)} />
      ) : view === 'routine' ? (
        <RoutineView items={routineItems} streak={streak} onOpen={(w) => openReader(w, 'routine')} onAddCustom={() => { setEditingCustom(null); setCustomOpen(true) }} onOpenAdhkar={openAdhkar} onOpenHistory={() => setView('history')} onRoutineChange={handleRoutineChange} lang={lang} />
      ) : view === 'names' ? (
        <NamesView routines={routines} onRoutineChange={handleRoutineChange} lang={lang} />
      ) : view === 'history' ? (
        <HistoryView streak={streak} lang={lang} />
      ) : kidsMode ? (
        <KidsView lang={lang} routines={routines} onRoutineChange={handleRoutineChange} onOpenWazifa={(w) => openReader(w, 'home')} onNavigate={(v) => setView(v)} onExit={() => changeKidsMode(false)} />
      ) : (
        <main className="max-w-2xl mx-auto px-4 py-4 pb-28 space-y-4">
          <div>
            <h2 className={`text-lg font-extrabold ${lang === 'ur' ? 'font-urdu' : ''}`}>{(() => { const h = new Date().getHours(); return h >= 4 && h < 12 ? t(lang, 'greetingMorning') : (h >= 19 || h < 4) ? t(lang, 'greetingEvening') : t(lang, 'greeting') })()}</h2>
            <p className={`text-xs opacity-70 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'tagline')}</p>
          </div>

          {homeTiles.ring && (
            <RoutineRing
              percent={routineItems.length ? (doneCount / routineItems.length) * 100 : 0}
              done={doneCount}
              total={routineItems.length}
              streak={streak}
              lang={lang}
              onClick={() => setView('routine')}
            />
          )}

          {homeTiles.prayer && <PrayerStrip lang={lang} onOpenQibla={() => setView('qibla')} onOpen={() => setView('prayer')} />}

          {isFriday && homeTiles.friday && (
            <FridayChecklist
              lang={lang}
              onOpenKahf={kahfEntry ? () => openReader(kahfEntry, 'home') : undefined}
              onOpenDurood={duroodEntry ? () => openReader(duroodEntry, 'home') : undefined}
            />
          )}

          {homeTiles.today && <TodayCard wazifa={wazifaOfDay} quote={quoteOfDay} lang={lang} onOpenWazifa={(w) => openReader(w, 'home')} onOpenArchive={() => setView('archive')} />}

          {tiles.length > 0 && <div className="grid grid-cols-2 gap-2">{tiles}</div>}

          <SearchBar value={query} onChange={setQuery} placeholder={t(lang, 'searchPlaceholder')} />
          {/* D10: the pills row is gone — categories live on their own page (item 87). */}
          <div className="flex items-center gap-2">
            <button onClick={() => setView('categories')} className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border border-gold/40 font-bold text-xs ${lang === 'ur' ? 'font-urdu' : ''}`}>
              <LayoutGrid size={14} className="text-gold" /> {t(lang, 'browseCategories')}
            </button>
            {category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gold text-black text-xs font-bold">
                <span className={lang === 'ur' ? 'font-urdu' : ''}>{categoryLabel(lang, category)}</span>
                <button onClick={() => setCategory('All')} aria-label={t(lang, 'dismiss')}><X size={13} /></button>
              </span>
            )}
            {situation && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gold text-black text-xs font-bold">
                <span className={lang === 'ur' ? 'font-urdu' : ''}>{t(lang, situation.labelKey)}</span>
                <button onClick={() => setSituation(null)} aria-label={t(lang, 'dismiss')}><X size={13} /></button>
              </span>
            )}
          </div>
          <div className="space-y-3">
            {filtered.length === 0 && <p className="text-sm opacity-70 text-center py-8">{t(lang, 'noResults')}</p>}
            {filtered.map((w) => <WazifaCard key={w.id} wazifa={w} routine={routines[w.id]} onOpen={(x) => openReader(x, 'home')} onToggleBookmark={toggleBookmark} lang={lang} />)}
          </div>
          <button onClick={() => { setEditingCustom(null); setCustomOpen(true) }} className={`w-full py-3 rounded-2xl border border-dashed border-gold/50 text-gold font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'addOwn')}</button>
        </main>
      )}

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-gold/20 bg-[#FAF8F5] dark:bg-[#062C22] backdrop-blur" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-2xl mx-auto grid" style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
          {navItems.map((id) => {
            const Icon = NAV_ICONS[id] || Home
            if (id === 'settings') {
              return (
                <button key="settings" onClick={() => setSettingsOpen(true)} className={`py-3 flex flex-col items-center gap-0.5 text-[11px] font-bold opacity-80 ${lang === 'ur' ? 'font-urdu' : ''}`}><Settings size={19} />{navLabel('settings')}</button>
              )
            }
            return (
              <button key={id} onClick={() => setView(id)} className={`py-3 flex flex-col items-center gap-0.5 text-[11px] font-bold ${view === id ? 'text-gold' : 'opacity-60'} ${lang === 'ur' ? 'font-urdu' : ''}`}><Icon size={19} />{navLabel(id)}</button>
            )
          })}
        </div>
      </nav>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onToggleTheme={toggleTheme} lang={lang} onSetLang={applyLang} onDataRestored={() => refresh()}
        homeTiles={homeTiles} onHomeTilesChange={changeHomeTiles} navItems={navItems} onNavItemsChange={changeNavItems}
        a11y={a11y} onA11yChange={changeA11y} arabicFont={arabicFont} onArabicFontChange={changeArabicFont} navLabel={navLabel}
        kidsMode={kidsMode} onKidsModeChange={changeKidsMode} />
      {customOpen && <CustomWazifaModal initial={editingCustom} onClose={() => setCustomOpen(false)} onSaved={() => refresh()} lang={lang} />}
      <InstallPrompt lang={lang} />
      {showOnboarding && <Onboarding lang={lang} onDone={finishOnboarding} />}
      {!showOnboarding && showWhatsNew && <WhatsNewModal lang={lang} onClose={closeWhatsNew} />}

      {/* Item 69: intention screen (opt-in, once per day). */}
      {!showOnboarding && !showWhatsNew && showIntention && (
        <div className="fixed inset-0 z-50 bg-[#062C22] text-[#f5f1e6] flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <p className="font-arabic text-4xl leading-relaxed text-gold" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p className={`text-base mt-6 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'intentionLine')}</p>
            <p className="text-[11px] font-bold text-gold mt-6">{t(lang, 'intentionFocusLabel')}</p>
            <p className="font-bold mt-1">{wazifaOfDay.title}</p>
            <button onClick={beginIntention} className={`w-full mt-8 py-3.5 rounded-2xl bg-gold text-black font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'intentionBegin')}</button>
          </div>
        </div>
      )}

      {/* Item 75: a dhikr gift arrived via link. */}
      {!showOnboarding && gift && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-gold/40 bg-[#0a3527] text-[#f5f1e6] p-5 text-center">
            <p className="text-3xl">🎁</p>
            <h3 className={`font-extrabold text-lg mt-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'giftCardTitle')}</h3>
            {gift.message && <p className={`text-sm opacity-85 mt-2 leading-relaxed ${lang === 'ur' ? 'font-urdu' : ''}`}>“{gift.message}”</p>}
            <p className="font-arabic text-3xl mt-4" dir="rtl">{gift.preset.arabic}</p>
            <p className="font-bold mt-1">{gift.preset.transliteration} × {gift.target}</p>
            <p className="text-xs opacity-70 mt-1">{lang === 'ur' ? gift.preset.urdu : gift.preset.english}</p>
            <button onClick={startGift} className={`w-full mt-5 py-3 rounded-2xl bg-gold text-black font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'giftStartBtn')}</button>
            <button onClick={() => setGift(null)} className="w-full mt-2 py-2.5 rounded-2xl border border-gold/30 text-xs font-bold">{t(lang, 'giftLaterBtn')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
