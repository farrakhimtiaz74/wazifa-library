import React, { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { Home, ListChecks, Settings } from 'lucide-react'
import { wazifaData } from './data/wazifaData'
import { db, getSetting, setSetting, todayLocal, queueSync } from './lib/db'
import { syncNow } from './lib/sync'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CategoryPills from './components/CategoryPills'
import WazifaCard from './components/WazifaCard'
import WazifaReader from './components/WazifaReader'
import RoutineView from './components/RoutineView'
import CustomWazifaModal from './components/CustomWazifaModal'
import SettingsDrawer from './components/SettingsDrawer'
import InstallPrompt from './components/InstallPrompt'

export default function App() {
  const [view, setView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [routines, setRoutines] = useState({})
  const [customs, setCustoms] = useState([])
  const [streak, setStreak] = useState(0)
  const [theme, setTheme] = useState('dark')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [editingCustom, setEditingCustom] = useState(null)

  const allWazaif = useMemo(() => [...wazifaData, ...customs.map((c) => ({ ...c, reference: c.reference || 'Personal / Custom', keywords: c.keywords || [] }))], [customs])

  async function refresh() {
    const rows = await db.routines.toArray()
    const map = {}; rows.forEach((r) => { map[r.wazifa_id] = r })
    setRoutines(map)
    setCustoms(await db.customWazaif.toArray())
    setStreak(await getSetting('daily_streak', 0))
  }

  async function ensureDailyReset() {
    const today = todayLocal()
    const lastReset = await getSetting('last_global_reset', null)
    if (lastReset === today) return false
    const rows = await db.routines.toArray()
    const bookmarked = rows.filter((r) => r.is_bookmarked)
    const allDone = bookmarked.length > 0 && bookmarked.every((r) => r.completed_today)
    const countedDate = await getSetting('streak_counted_date', null)
    if (lastReset && allDone && countedDate !== lastReset) {
      const s = (await getSetting('daily_streak', 0)) + 1
      await setSetting('daily_streak', s)
      await setSetting('streak_counted_date', lastReset)
    }
    for (const r of rows) await db.routines.put({ ...r, current_count: 0, completed_today: false, last_reset_date: today, updated_at: new Date().toISOString() })
    await setSetting('last_global_reset', today)
    return true
  }

  useEffect(() => {
    ;(async () => {
      const prefs = await getSetting('preferences', {})
      const t = prefs.theme || 'dark'; setTheme(t); document.documentElement.classList.toggle('dark', t === 'dark')
      await ensureDailyReset()
      await refresh(); syncNow()
    })()
  }, [])

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
  }, [routines])

  const fuse = useMemo(() => new Fuse(allWazaif, { keys: ['title', 'arabic', 'transliteration', 'english_translation', 'urdu_translation', 'keywords', 'category'], threshold: 0.35, includeScore: true }), [allWazaif])
  const filtered = useMemo(() => {
    let list = query.trim() ? fuse.search(query).map((r) => r.item) : allWazaif
    if (category !== 'All') list = list.filter((w) => w.category === category)
    return list
  }, [query, category, allWazaif, fuse])

  async function toggleBookmark(w) {
    const existing = routines[w.id]
    const row = { wazifa_id: w.id, is_bookmarked: !(existing?.is_bookmarked), current_count: existing?.current_count || 0, target_count: existing?.target_count || w.target_count, completed_today: existing?.completed_today || false, last_reset_date: todayLocal(), updated_at: new Date().toISOString() }
    await db.routines.put(row); await queueSync('routine', row); setRoutines((m) => ({ ...m, [w.id]: row })); syncNow()
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    getSetting('preferences', {}).then((p) => setSetting('preferences', { ...p, theme: next }))
  }

  const routineItems = allWazaif.filter((w) => routines[w.id]?.is_bookmarked).map((w) => ({ wazifa: w, routine: routines[w.id] }))

  return (
    <div className="min-h-screen bg-cream text-[#12211c] dark:bg-deep dark:text-[#f5f1e6]">
      <Header theme={theme} onToggleTheme={toggleTheme} onOpenSettings={() => setSettingsOpen(true)} streak={streak} />
      {view === 'reader' && selected ? (
        <WazifaReader wazifa={selected} routine={routines[selected.id]} onBack={() => setView('home')} onToggleBookmark={toggleBookmark} onRoutineChange={(row) => setRoutines((m) => ({ ...m, [row.wazifa_id]: row }))} />
      ) : view === 'routine' ? (
        <RoutineView items={routineItems} streak={streak} onOpen={(w) => { setSelected(w); setView('reader') }} onAddCustom={() => { setEditingCustom(null); setCustomOpen(true) }} />
      ) : (
        <main className="max-w-2xl mx-auto px-4 py-4 pb-28 space-y-4">
          <div><h2 className="text-lg font-extrabold">Assalamu Alaikum</h2><p className="text-xs opacity-70">Authentic Wazaif & Adhkar — works fully offline, no account needed.</p></div>
          <SearchBar value={query} onChange={setQuery} />
          <CategoryPills active={category} onSelect={setCategory} />
          <div className="space-y-3">
            {filtered.length === 0 && <p className="text-sm opacity-70 text-center py-8">No Wazaif found. Try another word, e.g. “debt”, “stress” or “shifa”.</p>}
            {filtered.map((w) => <WazifaCard key={w.id} wazifa={w} routine={routines[w.id]} onOpen={(x) => { setSelected(x); setView('reader') }} onToggleBookmark={toggleBookmark} />)}
          </div>
          <button onClick={() => { setEditingCustom(null); setCustomOpen(true) }} className="w-full py-3 rounded-2xl border border-dashed border-gold/50 text-gold font-bold text-sm">+ Add Your Own Wazifa</button>
        </main>
      )}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-gold/20 bg-[#062C22] dark:bg-[#062C22] bg-[#FAF8F5] backdrop-blur" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-2xl mx-auto grid grid-cols-3">
          <button onClick={() => setView('home')} className={`py-3 flex flex-col items-center gap-0.5 text-[11px] font-bold ${view === 'home' ? 'text-gold' : 'opacity-60'}`}><Home size={19} />Home</button>
          <button onClick={() => setView('routine')} className={`py-3 flex flex-col items-center gap-0.5 text-[11px] font-bold ${view === 'routine' ? 'text-gold' : 'opacity-60'}`}><ListChecks size={19} />My Routine</button>
          <button onClick={() => setSettingsOpen(true)} className="py-3 flex flex-col items-center gap-0.5 text-[11px] font-bold opacity-80"><Settings size={19} />Settings</button>
        </div>
      </nav>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onToggleTheme={toggleTheme} />
      {customOpen && <CustomWazifaModal initial={editingCustom} onClose={() => setCustomOpen(false)} onSaved={() => refresh()} />}
      <InstallPrompt />
    </div>
  )
}
