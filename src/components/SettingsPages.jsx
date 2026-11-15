import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Download, Trash2, Upload } from 'lucide-react'
import { wazifaData } from '../data/wazifaData'
import { dhikrPresets } from '../data/dhikrPresets'
import { db, getSetting } from '../lib/db'
import { getDhikrStats, loadDhikrGoals, saveDhikrGoals } from '../lib/dhikrStats'
import { categoryLabel, t } from '../lib/i18n'
import { PROFILE_IDS, ensureProfile, getActiveProfileId, loadProfileMeta, saveProfileMeta, switchProfile } from '../lib/profiles'
import { HOME_TILE_KEYS, NAV_CANDIDATES, lastBackupDate, loadReports, saveReports, setLastBackupDate } from '../lib/uiPrefs'
import { WhatsNewList } from './WhatsNew'

export function PageShell({ title, lang, onBack, children }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 -ml-1.5" aria-label={t(lang, 'back')}><ArrowLeft size={18} /></button>
        <h3 className={`font-extrabold ${lang === 'ur' ? 'font-urdu' : ''}`}>{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Toggle({ on, onClick, label, help, lang }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gold/10 last:border-0">
      <div className="min-w-0">
        <p className={`text-sm font-bold ${lang === 'ur' ? 'font-urdu' : ''}`}>{label}</p>
        {help && <p className="text-[11px] opacity-60 mt-0.5">{help}</p>}
      </div>
      <button onClick={onClick} aria-pressed={on} className={`px-3 py-1.5 rounded-full border text-xs font-bold shrink-0 ${on ? 'bg-gold text-black border-gold' : 'border-gold/40'}`}>{on ? t(lang, 'on') : t(lang, 'off')}</button>
    </div>
  )
}

// --- Item 94: Profiles ---
export function ProfilesPage({ lang, onBack }) {
  const [meta, setMeta] = useState(loadProfileMeta)
  const active = getActiveProfileId()

  function rename(id, name) {
    const next = meta.map((p) => (p.id === id ? { ...p, name } : p))
    setMeta(next)
    saveProfileMeta(next)
  }

  function addAndSwitch(id) {
    ensureProfile(id)
    setMeta(loadProfileMeta())
    switchProfile(id)
  }

  const unused = PROFILE_IDS.filter((id) => !meta.some((p) => p.id === id))
  return (
    <PageShell title={t(lang, 'profilesTitle')} lang={lang} onBack={onBack}>
      <p className="text-xs opacity-75 leading-relaxed">{t(lang, 'profilesHelp')}</p>
      <div className="space-y-3 mt-4">
        {meta.map((p) => (
          <div key={p.id} className="rounded-2xl border border-gold/25 p-3 bg-white/5">
            <div className="flex items-center gap-2">
              <input value={p.name} onChange={(e) => rename(p.id, e.target.value)} className="flex-1 min-w-0 rounded-xl border border-gold/25 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold" aria-label={t(lang, 'displayName')} />
              {p.id === active
                ? <span className="px-2.5 py-1.5 rounded-full bg-gold/20 border border-gold text-gold text-[11px] font-bold shrink-0 inline-flex items-center gap-1"><Check size={12} /> {t(lang, 'activeLabel')}</span>
                : <button onClick={() => switchProfile(p.id)} className="px-3 py-2 rounded-full bg-gold text-black text-xs font-bold shrink-0">{t(lang, 'switchBtn')}</button>}
            </div>
          </div>
        ))}
        {unused.map((id) => (
          <button key={id} onClick={() => addAndSwitch(id)} className="w-full py-3 rounded-2xl border border-dashed border-gold/50 text-gold font-bold text-sm">+ {`Profile ${PROFILE_IDS.indexOf(id) + 1}`}</button>
        ))}
      </div>
      <p className="text-[11px] opacity-60 mt-3">{t(lang, 'profilesMax')}</p>
    </PageShell>
  )
}

// --- Wave 3, item 27: Weekly dhikr goals ---
// Targets are stored in settings ('dhikr_goals'); progress is the rolling
// last-7-days total from the dhikrLog table (see lib/dhikrStats.js).
export function DhikrGoalsPage({ lang, onBack }) {
  const [goals, setGoals] = useState(null)
  const [stats, setStats] = useState({})
  const [msg, setMsg] = useState('')

  useEffect(() => {
    loadDhikrGoals().then(setGoals)
    getDhikrStats().then(setStats)
  }, [])

  async function save(next) {
    setGoals(next)
    await saveDhikrGoals(next)
    setMsg(t(lang, 'savedMsg'))
    setTimeout(() => setMsg(''), 1500)
  }

  if (!goals) return <PageShell title={t(lang, 'goalsTitle')} lang={lang} onBack={onBack}><p className="text-sm opacity-70">…</p></PageShell>

  const totalWeek = Object.values(stats).reduce((s, x) => s + (x.week || 0), 0)
  const totalTarget = goals.__total || 0
  const bar = (done, target) => (
    <div className="h-2 rounded-full bg-white/10 mt-1.5 overflow-hidden"><div className="h-full bg-gold rounded-full" style={{ width: `${target > 0 ? Math.min(100, (done / target) * 100) : 0}%` }} /></div>
  )

  return (
    <PageShell title={t(lang, 'goalsTitle')} lang={lang} onBack={onBack}>
      <p className="text-xs opacity-75 leading-relaxed">{t(lang, 'goalsHelp')}</p>
      <div className="rounded-2xl border border-gold/25 p-3.5 bg-white/5 mt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold">{t(lang, 'goalsTotalLabel')}</p>
          <input type="number" min="0" value={totalTarget || ''} placeholder="0" onChange={(e) => save({ ...goals, __total: Math.max(0, Number(e.target.value) || 0) })} className="w-24 rounded-xl border border-gold/25 bg-white/5 px-2.5 py-1.5 text-sm outline-none focus:border-gold" aria-label={t(lang, 'goalsTotalLabel')} />
        </div>
        <p className="text-[11px] opacity-70 mt-1">{t(lang, 'thisWeek')}: {totalWeek}{totalTarget > 0 ? ` / ${totalTarget}` : ''}</p>
        {totalTarget > 0 && bar(totalWeek, totalTarget)}
      </div>
      <div className="space-y-2 mt-3">
        {dhikrPresets.map((p) => {
          const target = goals[p.key] || 0
          const week = stats[p.key]?.week || 0
          return (
            <div key={p.key} className="rounded-2xl border border-gold/20 p-3 bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold">{p.transliteration}</p>
                <input type="number" min="0" value={target || ''} placeholder="0" onChange={(e) => save({ ...goals, [p.key]: Math.max(0, Number(e.target.value) || 0) })} className="w-24 rounded-xl border border-gold/25 bg-white/5 px-2.5 py-1.5 text-sm outline-none focus:border-gold" aria-label={`${p.transliteration} ${t(lang, 'goalsPerWeek')}`} />
              </div>
              <p className="text-[11px] opacity-70 mt-1">{t(lang, 'thisWeek')}: {week}{target > 0 ? ` / ${target}` : ''} · {t(lang, 'goalsPerWeek')}</p>
              {target > 0 && bar(week, target)}
            </div>
          )
        })}
      </div>
      {msg && <p className="text-xs text-gold mt-2">{msg}</p>}
    </PageShell>
  )
}

// --- Item 93: Accessibility ---
export function AccessibilityPage({ lang, onBack, a11y, onA11yChange }) {
  const set = (k, v) => onA11yChange({ ...a11y, [k]: v })
  return (
    <PageShell title={t(lang, 'a11yTitle')} lang={lang} onBack={onBack}>
      <Toggle on={a11y.largeText} onClick={() => set('largeText', !a11y.largeText)} label={t(lang, 'largeText')} help={t(lang, 'largeTextHelp')} lang={lang} />
      <Toggle on={a11y.highContrast} onClick={() => set('highContrast', !a11y.highContrast)} label={t(lang, 'highContrast')} help={t(lang, 'highContrastHelp')} lang={lang} />
      <Toggle on={a11y.reduceMotion} onClick={() => set('reduceMotion', !a11y.reduceMotion)} label={t(lang, 'reduceMotion')} help={t(lang, 'reduceMotionHelp')} lang={lang} />
    </PageShell>
  )
}

// --- Item 91: Arabic script style ---
export function ArabicFontPage({ lang, onBack, arabicFont, onArabicFontChange }) {
  const options = [
    { id: 'amiri', label: t(lang, 'fontAmiri'), cls: '' },
    { id: 'scheherazade', label: t(lang, 'fontScheherazade'), cls: 'arabic-scheherazade' },
    { id: 'indopak', label: t(lang, 'fontIndopak'), cls: 'arabic-indopak' }
  ]
  return (
    <PageShell title={t(lang, 'arabicFontTitle')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {options.map((o) => (
          <button key={o.id} onClick={() => onArabicFontChange(o.id)} aria-pressed={arabicFont === o.id}
            className={`w-full text-left rounded-2xl border p-3.5 ${arabicFont === o.id ? 'border-gold bg-gold/10' : 'border-gold/25 bg-white/5'}`}>
            <span className="block text-sm font-bold">{o.label}</span>
            <span className={`${o.cls} block mt-1.5`}><span className="font-arabic text-xl" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span></span>
          </button>
        ))}
      </div>
    </PageShell>
  )
}

// --- Item 89: Home tiles ---
const TILE_LABEL_KEYS = {
  prayer: 'tilePrayer', today: 'tileToday', ring: 'tileRing', friday: 'tileFriday', adhkar: 'tileAdhkar',
  freeTasbih: 'tileFreeTasbih', names: 'tileNames', rabbana: 'tileRabbana', juzAmma: 'tileJuzAmma', qibla: 'tileQibla',
  quran: 'tileQuran', dhikr: 'tileDhikr', duas: 'tileDuas', nameDay: 'tileNameDay',
  learn: 'tileLearn', seasons: 'tileSeasons',
  habits: 'tileHabits', sharing: 'tileSharing', tools: 'tileTools'
}
export function HomeTilesPage({ lang, onBack, homeTiles, onHomeTilesChange }) {
  return (
    <PageShell title={t(lang, 'homeTilesTitle')} lang={lang} onBack={onBack}>
      <p className="text-xs opacity-75">{t(lang, 'homeTilesHelp')}</p>
      <div className="mt-2">
        {HOME_TILE_KEYS.map((k) => (
          <Toggle key={k} on={!!homeTiles[k]} onClick={() => onHomeTilesChange({ ...homeTiles, [k]: !homeTiles[k] })} label={t(lang, TILE_LABEL_KEYS[k])} lang={lang} />
        ))}
      </div>
    </PageShell>
  )
}

// --- Item 90: Bottom navigation ---
export function NavCustomPage({ lang, onBack, navItems, onNavItemsChange, navLabel }) {
  const [draft, setDraft] = useState(navItems)
  const [msg, setMsg] = useState('')
  function toggleId(id) {
    if (id === 'home') return
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : d.length >= 5 ? d : [...d, id]))
  }
  function save() {
    if (draft.length !== 5) { setMsg(t(lang, 'navHelp')); return }
    const ordered = NAV_CANDIDATES.filter((c) => draft.includes(c))
    onNavItemsChange(ordered)
    setMsg(t(lang, 'savedMsg'))
    setTimeout(() => setMsg(''), 2000)
  }
  return (
    <PageShell title={t(lang, 'navTitle')} lang={lang} onBack={onBack}>
      <p className="text-xs opacity-75">{t(lang, 'navHelp')}</p>
      <div className="space-y-2 mt-3">
        {NAV_CANDIDATES.map((id) => {
          const on = draft.includes(id)
          return (
            <button key={id} onClick={() => toggleId(id)} aria-pressed={on} disabled={id === 'home'}
              className={`w-full flex items-center justify-between rounded-2xl border px-3.5 py-3 text-sm font-bold ${on ? 'border-gold bg-gold/10' : 'border-gold/25 bg-white/5'} ${id === 'home' ? 'opacity-80' : ''}`}>
              <span className={lang === 'ur' ? 'font-urdu' : ''}>{navLabel(id)}</span>
              <span className={`w-6 h-6 rounded-lg border grid place-items-center text-sm font-extrabold ${on ? 'bg-gold text-black border-gold' : 'border-gold/50 text-transparent'}`}>✓</span>
            </button>
          )
        })}
      </div>
      <p className="text-[11px] opacity-60 mt-2">{draft.length} / 5</p>
      <button onClick={save} disabled={draft.length !== 5} className="w-full mt-3 py-3 rounded-2xl bg-gold text-black font-bold text-sm disabled:opacity-40">{t(lang, 'saveBtn')}</button>
      {msg && <p className="text-xs text-gold mt-2">{msg}</p>}
    </PageShell>
  )
}

// --- Item 92: Offline packs ---
export function OfflinePacksPage({ lang, onBack }) {
  const [appState, setAppState] = useState('checking')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function checkCache() {
    try {
      if (!('caches' in window)) { setAppState('missing'); return }
      const names = await caches.keys()
      let found = false
      for (const name of names) {
        const cache = await caches.open(name)
        if (await cache.match('./', { ignoreSearch: true })) { found = true; break }
        if (await cache.match(new URL('./', window.location.href).href, { ignoreSearch: true })) { found = true; break }
      }
      setAppState(found ? 'ready' : 'missing')
    } catch { setAppState('missing') }
  }

  useEffect(() => { checkCache() }, [])

  async function warm() {
    setBusy(true); setMsg('')
    try {
      // Cache-warming: request the app shell + bundled assets through the
      // service worker so they are stored for offline use. No fake downloads —
      // packs that are not real yet are labelled as such below.
      const urls = ['./', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'manifest.webmanifest']
      const results = await Promise.all(urls.map((u) => fetch(u).then((r) => r.ok).catch(() => false)))
      await checkCache()
      setMsg(results.every(Boolean) ? t(lang, 'offlineReady') : t(lang, 'offlinePartial'))
    } catch { setMsg(t(lang, 'offlinePartial')) }
    setBusy(false)
  }

  const row = (title, note, badge, badgeCls) => (
    <div className="rounded-2xl border border-gold/25 p-3.5 bg-white/5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold">{title}</p>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badgeCls}`}>{badge}</span>
      </div>
      <p className="text-[11px] opacity-70 mt-1 leading-relaxed">{note}</p>
    </div>
  )

  return (
    <PageShell title={t(lang, 'offlineTitle')} lang={lang} onBack={onBack}>
      <div className="space-y-2.5">
        {row(t(lang, 'packTranslations'), t(lang, 'packTranslationsNote'), t(lang, 'includedLabel'), 'border-gold/40 text-gold')}
        {row(t(lang, 'packAudio'), t(lang, 'packAudioNote'), t(lang, 'availableOnlineLabel'), 'border-gold/40 text-gold')}
        <div className="rounded-2xl border border-gold/25 p-3.5 bg-white/5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold">{t(lang, 'packApp')}</p>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-gold/25 shrink-0">{appState === 'ready' ? t(lang, 'includedLabel') : appState === 'checking' ? '…' : t(lang, 'notDownloadedLabel')}</span>
          </div>
          <p className="text-[11px] opacity-70 mt-1 leading-relaxed">{t(lang, 'packAppNote')}</p>
          <button onClick={warm} disabled={busy} className="mt-2.5 inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gold text-black text-xs font-bold disabled:opacity-50"><Download size={13} /> {t(lang, 'downloadOffline')}</button>
          {msg && <p className="text-xs text-gold mt-2">{msg}</p>}
        </div>
      </div>
    </PageShell>
  )
}

// --- Item 97: Sources ---
export function SourcesPage({ lang, onBack }) {
  return (
    <PageShell title={t(lang, 'sourcesTitle')} lang={lang} onBack={onBack}>
      <p className="text-xs opacity-75 leading-relaxed">{t(lang, 'sourcesHelp')}</p>
      <div className="space-y-2 mt-3">
        {wazifaData.map((w) => (
          <div key={w.id} className="rounded-2xl border border-gold/20 p-3 bg-white/5">
            <p className="text-sm font-bold">{w.title}</p>
            <p className={`text-[11px] opacity-60 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{categoryLabel(lang, w.category)}</p>
            <p className="text-[11px] text-gold mt-1">{t(lang, 'referenceLabel')}: {w.reference || '—'}</p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

// --- Item 98: Privacy ---
export function PrivacyPage({ lang, onBack }) {
  return (
    <PageShell title={t(lang, 'privacyTitle')} lang={lang} onBack={onBack}>
      <div className="space-y-3">
        {[t(lang, 'privacyP1'), t(lang, 'privacyP2'), t(lang, 'privacyP3'), t(lang, 'privacyP4')].map((p, i) => (
          <p key={i} className={`text-sm leading-relaxed opacity-90 ${lang === 'ur' ? 'font-urdu' : ''}`}>{p}</p>
        ))}
      </div>
    </PageShell>
  )
}

// --- Item 95: What's New page ---
export function WhatsNewPage({ lang, onBack }) {
  return (
    <PageShell title={t(lang, 'whatsNewTitle')} lang={lang} onBack={onBack}>
      <WhatsNewList lang={lang} />
    </PageShell>
  )
}

// --- Item 99: Data & Storage (backup lives here; reports from item 96 too) ---
export function DataStoragePage({ lang, onBack, onDataRestored }) {
  const [counts, setCounts] = useState({ custom: 0, routines: 0, days: 0, lifetime: 0, totalTaps: 0 })
  const [backupMsg, setBackupMsg] = useState('')
  const [reports, setReports] = useState(loadReports)
  const fileRef = useRef(null)

  async function refreshCounts() {
    const routines = await db.routines.toArray()
    setCounts({
      custom: await db.customWazaif.count(),
      routines: routines.length,
      days: await db.history.count(),
      lifetime: routines.reduce((s, r) => s + (r.lifetime_count || 0), 0),
      totalTaps: await getSetting('total_taps', 0)
    })
  }

  useEffect(() => { refreshCounts() }, [])

  async function exportBackup() {
    const data = {
      app: 'wazifa-library',
      version: 2,
      exported_at: new Date().toISOString(),
      routines: await db.routines.toArray(),
      customWazaif: await db.customWazaif.toArray(),
      settings: await db.settings.toArray(),
      history: await db.history.toArray()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wazifa-library-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    setLastBackupDate(new Date().toISOString().slice(0, 10))
    setBackupMsg(t(lang, 'backupDownloaded'))
  }

  async function importBackup(e) {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (!parsed || parsed.app !== 'wazifa-library' || !Array.isArray(parsed.routines) || !Array.isArray(parsed.customWazaif) || !Array.isArray(parsed.settings)) {
        throw new Error('shape')
      }
      const ok = window.confirm(t(lang, 'importConfirm'))
      if (!ok) return
      await db.routines.clear(); await db.routines.bulkPut(parsed.routines)
      await db.customWazaif.clear(); await db.customWazaif.bulkPut(parsed.customWazaif)
      await db.settings.clear(); await db.settings.bulkPut(parsed.settings)
      if (Array.isArray(parsed.history)) { await db.history.clear(); await db.history.bulkPut(parsed.history) }
      for (const r of parsed.routines) await db.syncQueue.add({ type: 'routine', payload: r, created_at: new Date().toISOString() })
      for (const c of parsed.customWazaif) await db.syncQueue.add({ type: 'custom', payload: c, created_at: new Date().toISOString() })
      setBackupMsg(t(lang, 'backupRestored'))
      onDataRestored && onDataRestored()
      setTimeout(() => window.location.reload(), 600)
    } catch {
      setBackupMsg(t(lang, 'backupInvalid'))
    }
  }

  async function clearCache() {
    try {
      if ('caches' in window) {
        const names = await caches.keys()
        await Promise.all(names.map((n) => caches.delete(n)))
      }
    } catch { /* cache API optional */ }
    window.location.reload()
  }

  function deleteReport(id) {
    const next = reports.filter((r) => r.id !== id)
    setReports(next)
    saveReports(next)
  }

  async function copyReport(r) {
    try { await navigator.clipboard.writeText(`${t(lang, 'reportMistake')} — ${r.wazifaTitle}\n${r.text}\n${r.date}`) } catch { /* clipboard unavailable */ }
  }

  const stat = (label, value) => (
    <div className="rounded-2xl border border-gold/20 bg-white/5 p-3 text-center">
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-[11px] opacity-70 mt-0.5">{label}</p>
    </div>
  )

  return (
    <PageShell title={t(lang, 'dataTitle')} lang={lang} onBack={onBack}>
      <div className="grid grid-cols-2 gap-2">
        {stat(t(lang, 'customCountLabel'), counts.custom)}
        {stat(t(lang, 'routineCountLabel'), counts.routines)}
        {stat(t(lang, 'historyDaysLabel'), counts.days)}
        {stat(t(lang, 'lifetimeTotalLabel'), Math.max(counts.lifetime, 0).toLocaleString())}
      </div>
      <p className="text-[11px] opacity-60 mt-2">{t(lang, 'totalDhikr')}: {counts.totalTaps.toLocaleString()}</p>
      <p className="text-[11px] opacity-60 mt-1">{t(lang, 'lastBackupLabel')}: {lastBackupDate() || t(lang, 'neverLabel')}</p>

      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'backupTitle')}</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={exportBackup} className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gold text-black text-xs font-bold"><Download size={13} /> {t(lang, 'exportBtn')}</button>
        <button onClick={() => fileRef.current && fileRef.current.click()} className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-gold/40 text-xs font-bold"><Upload size={13} /> {t(lang, 'importBtn')}</button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={importBackup} />
      </div>
      {backupMsg && <p className="text-xs text-gold mt-2">{backupMsg}</p>}
      <p className="text-[11px] opacity-60 mt-2">{t(lang, 'backupNote')}</p>

      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'clearCacheBtn')}</p>
      <button onClick={clearCache} className="px-3 py-2 rounded-full border border-gold/40 text-xs font-bold">{t(lang, 'clearCacheBtn')}</button>
      <p className="text-[11px] opacity-60 mt-2">{t(lang, 'clearCacheHelp')}</p>

      <p className="text-sm font-bold mt-5 mb-2">{t(lang, 'reportsTitle')}</p>
      {reports.length === 0 && <p className="text-xs opacity-60">{t(lang, 'noReports')}</p>}
      <div className="space-y-2">
        {reports.map((r) => (
          <div key={r.id} className="rounded-2xl border border-gold/20 p-3 bg-white/5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold">{r.wazifaTitle}</p>
              <span className="text-[10px] opacity-50 shrink-0">{r.date}</span>
            </div>
            <p className="text-xs opacity-80 mt-1 leading-relaxed">{r.text}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => copyReport(r)} className="px-2.5 py-1 rounded-full border border-gold/40 text-[11px] font-bold">{t(lang, 'copyReportBtn')}</button>
              <button onClick={() => deleteReport(r.id)} className="px-2.5 py-1 rounded-full border border-red-400/50 text-red-300 text-[11px] font-bold inline-flex items-center gap-1"><Trash2 size={11} /> {t(lang, 'deleteBtn')}</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
