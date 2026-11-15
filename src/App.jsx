import React, { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { BarChart3, Bell, BookOpen, Home, ListChecks, Moon, Settings, Sparkles, Sun, X } from 'lucide-react'
import { wazifaData } from './data/wazifaData'
import { adhkarSets } from './data/adhkarSets'
import { db, getSetting, recordHistorySnapshot, setSetting, todayLocal, queueSync } from './lib/db'
import { syncNow } from './lib/sync'
import { loadLang, saveLang, t } from './lib/i18n'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CategoryPills from './components/CategoryPills'
import WazifaCard from './components/WazifaCard'
import WazifaReader from './components/WazifaReader'
import RoutineView from './components/RoutineView'
import NamesView from './components/NamesView'
import HistoryView from './components/HistoryView'
import AdhkarRunner from './components/AdhkarRunner'
import CustomWazifaModal from './components/CustomWazifaModal'
import SettingsDrawer from './components/SettingsDrawer'
import InstallPrompt from './components/InstallPrompt'

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

export default function App() {
  const [view, setView] = useState('home')
  const [backView, setBackView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [adhkarId, setAdhkarId] = useState('morning')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [routines, setRoutines] = useState({})
  const [customs, setCustoms] = useState([])
  const [streak, setStreak] = useState(0)
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState(loadLang)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [editingCustom, setEditingCustom] = useState(null)
  const [reminderBanner, setReminderBanner] = useState(false)
  const routinesRef = useRef({})
  routinesRef.current = routines

  const allWazaif = useMemo(() => [...wazifaData, ...customs.map((c) => ({ ...c, reference: c.reference || 'Personal / Custom', keywords: c.keywords || [] }))], [customs])

  const wazifaOfDay = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const doy = Math.floor((now - start) / 86400000)
    return wazifaData[doy % wazifaData.length]
  }, [])

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
    })()
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'ur' ? 'ur' : 'en'
  }, [lang])

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
        try { new Notification('Wazifa Library', { body: 'Time for your daily routine — a few Wazaif are still incomplete today.', icon: 'icons/icon-192.png' }) } catch { /* notifications optional */ }
      }
    }
    checkReminder()
    const id = setInterval(checkReminder, 60000)
    return () => { alive = false; clearInterval(id) }
  }, [])

  const fuse = useMemo(() => new Fuse(allWazaif, { keys: ['title', 'arabic', 'transliteration', 'english_translation', 'urdu_translation', 'keywords', 'category'], threshold: 0.35, includeScore: true }), [allWazaif])
  const filtered = useMemo(() => {
    let list = query.trim() ? fuse.search(query).map((r) => r.item) : allWazaif
    if (category !== 'All') list = list.filter((w) => w.category === category)
    return list
  }, [query, category, allWazaif, fuse])

  async function toggleBookmark(w) {
    const existing = routines[w.id]
    const row = { wazifa_id: w.id, is_bookmarked: !(existing?.is_bookmarked), current_count: existing?.current_count || 0, target_count: existing?.target_count || w.target_count, completed_today: existing?.completed_today || false, rounds_today: existing?.rounds_today || 0, last_reset_date: todayLocal(), updated_at: new Date().toISOString() }
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

  function openReader(w, from) {
    setBackView(from || view)
    setSelected(w)
    setView('reader')
  }

  function openAdhkar(id) {
    setAdhkarId(id)
    setView('adhkar')
  }

  const routineItems = allWazaif.filter((w) => routines[w.id]?.is_bookmarked).map((w) => ({ wazifa: w, routine: routines[w.id] }))
  const navBtn = (id, Icon, label) => (
    <button onClick={() => setView(id)} className={`py-3 flex flex-col items-center gap-0.5 text-[11px] font-bold ${view === id ? 'text-gold' : 'opacity-60'} ${lang === 'ur' ? 'font-urdu' : ''}`}><Icon size={19} />{label}</button>
  )

  return (
    <div className="min-h-screen bg-cream text-[#12211c] dark:bg-deep dark:text-[#f5f1e6]">
      <Header theme={theme} onToggleTheme={toggleTheme} onOpenSettings={() => setSettingsOpen(true)} streak={streak} lang={lang} onToggleLang={() => applyLang(lang === 'ur' ? 'en' : 'ur')} />

      {reminderBanner && (
        <div className="max-w-2xl mx-auto px-4 mt-3">
          <div className="rounded-2xl border border-gold/40 bg-gold/15 p-3.5 flex items-start gap-2.5">
            <Bell className="text-gold shrink-0 mt-0.5" size={18} />
            <p className="text-xs flex-1">Reminder: your daily routine is not complete yet today. A little dhikr now keeps your {streak}-day streak growing.</p>
            <button onClick={() => { setReminderBanner(false); setView('routine') }} className="px-2.5 py-1 rounded-full bg-gold text-black text-[11px] font-bold shrink-0">Open</button>
            <button onClick={() => setReminderBanner(false)} className="p-1 shrink-0" aria-label="Dismiss reminder"><X size={14} /></button>
          </div>
        </div>
      )}

      {view === 'reader' && selected ? (
        <WazifaReader wazifa={selected} routine={routines[selected.id]} onBack={() => setView(backView === 'reader' ? 'home' : backView)} onToggleBookmark={toggleBookmark} onRoutineChange={handleRoutineChange} lang={lang} freeMode={selected.id === 'free-tasbih'} />
      ) : view === 'adhkar' ? (
        <AdhkarRunner set={adhkarSets[adhkarId]} routines={routines} onRoutineChange={handleRoutineChange} onBack={() => setView('home')} lang={lang} />
      ) : view === 'routine' ? (
        <RoutineView items={routineItems} streak={streak} onOpen={(w) => openReader(w, 'routine')} onAddCustom={() => { setEditingCustom(null); setCustomOpen(true) }} onOpenAdhkar={openAdhkar} onOpenHistory={() => setView('history')} onRoutineChange={handleRoutineChange} lang={lang} />
      ) : view === 'names' ? (
        <NamesView routines={routines} onRoutineChange={handleRoutineChange} lang={lang} />
      ) : view === 'history' ? (
        <HistoryView streak={streak} lang={lang} />
      ) : (
        <main className="max-w-2xl mx-auto px-4 py-4 pb-28 space-y-4">
          <div>
            <h2 className={`text-lg font-extrabold ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'greeting')}</h2>
            <p className={`text-xs opacity-70 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'tagline')}</p>
          </div>

          <button onClick={() => openReader(wazifaOfDay, 'home')} className="w-full text-left rounded-3xl border border-gold/40 bg-gold/10 p-4 active:scale-[0.99]">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gold uppercase tracking-wider"><Sparkles size={12} /> {t(lang, 'wazifaOfDay')}</span>
            <span className="block font-bold mt-1">{wazifaOfDay.title}</span>
            <span className="font-arabic block text-xl mt-1.5 line-clamp-2" dir="rtl">{wazifaOfDay.arabic}</span>
            <span className="block text-[11px] opacity-70 mt-1.5">{wazifaOfDay.recommended_time} · Target {wazifaOfDay.target_count}x · {wazifaOfDay.reference}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => openAdhkar('morning')} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <Sun className="text-gold" size={19} />
              <span className="block font-bold text-sm mt-1.5">{t(lang, 'morningAdhkar')}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'morningAdhkarSub')}</span>
            </button>
            <button onClick={() => openAdhkar('evening')} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <Moon className="text-gold" size={19} />
              <span className="block font-bold text-sm mt-1.5">{t(lang, 'eveningAdhkar')}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'eveningAdhkarSub')}</span>
            </button>
            <button onClick={() => openReader(FREE_TASBIH, 'home')} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <BookOpen className="text-gold" size={19} />
              <span className="block font-bold text-sm mt-1.5">{t(lang, 'freeTasbih')}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'freeTasbihSub')}</span>
            </button>
            <button onClick={() => setView('names')} className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 text-left active:scale-[0.99]">
              <Sparkles className="text-gold" size={19} />
              <span className="block font-bold text-sm mt-1.5">{t(lang, 'namesTitle')}</span>
              <span className="block text-[11px] opacity-70 mt-0.5">{t(lang, 'namesSub')}</span>
            </button>
          </div>

          <SearchBar value={query} onChange={setQuery} placeholder={t(lang, 'searchPlaceholder')} />
          <CategoryPills active={category} onSelect={setCategory} lang={lang} />
          <div className="space-y-3">
            {filtered.length === 0 && <p className="text-sm opacity-70 text-center py-8">{t(lang, 'noResults')}</p>}
            {filtered.map((w) => <WazifaCard key={w.id} wazifa={w} routine={routines[w.id]} onOpen={(x) => openReader(x, 'home')} onToggleBookmark={toggleBookmark} />)}
          </div>
          <button onClick={() => { setEditingCustom(null); setCustomOpen(true) }} className={`w-full py-3 rounded-2xl border border-dashed border-gold/50 text-gold font-bold text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'addOwn')}</button>
        </main>
      )}

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-gold/20 bg-[#062C22] dark:bg-[#062C22] bg-[#FAF8F5] backdrop-blur" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-2xl mx-auto grid grid-cols-5">
          {navBtn('home', Home, t(lang, 'home'))}
          {navBtn('routine', ListChecks, t(lang, 'routine'))}
          {navBtn('names', BookOpen, t(lang, 'names'))}
          {navBtn('history', BarChart3, t(lang, 'history'))}
          <button onClick={() => setSettingsOpen(true)} className={`py-3 flex flex-col items-center gap-0.5 text-[11px] font-bold opacity-80 ${lang === 'ur' ? 'font-urdu' : ''}`}><Settings size={19} />{t(lang, 'settings')}</button>
        </div>
      </nav>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onToggleTheme={toggleTheme} lang={lang} onSetLang={applyLang} onDataRestored={() => refresh()} />
      {customOpen && <CustomWazifaModal initial={editingCustom} onClose={() => setCustomOpen(false)} onSaved={() => refresh()} />}
      <InstallPrompt />
    </div>
  )
}
