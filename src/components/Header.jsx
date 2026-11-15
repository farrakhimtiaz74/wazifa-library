import React, { useMemo } from 'react'
import { Flame, Moon, Sun, User, BookOpen } from 'lucide-react'
import SyncBadge from './SyncBadge'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { t } from '../lib/i18n'

export function hijriToday() {
  try {
    return new Intl.DateTimeFormat('en-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
  } catch {
    try { return new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()) } catch { return '' }
  }
}

export default function Header({ theme, onToggleTheme, onOpenSettings, streak = 0, lang = 'en', onToggleLang }) {
  const { user } = useAuth()
  const hijri = useMemo(() => hijriToday(), [])
  const gregorian = useMemo(() => new Date().toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' }), [])
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-deep/90 dark:bg-[#062C22]/90 bg-[#FAF8F5]/90 border-b border-gold/20 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/40 grid place-items-center text-gold shrink-0"><BookOpen size={18} /></span>
          <div className="min-w-0">
            <h1 className={`font-bold text-base leading-tight truncate ${lang === 'ur' ? 'font-urdu' : ''}`}>{t(lang, 'appName')}</h1>
            <p className="text-[10px] opacity-70 truncate">{hijri ? `${hijri} · ` : ''}{gregorian}</p>
            {/* D1: no sync UI at all when Supabase is not configured. */}
            {isSupabaseConfigured && <SyncBadge />}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-1.5 rounded-full border border-gold/30 text-gold text-xs font-bold" title={`${streak} ${t(lang, 'streakDay')}`} aria-label={`${streak} ${t(lang, 'streakDay')}`}><Flame size={14} />{streak}</span>
          {onToggleLang && <button onClick={onToggleLang} className={`px-2.5 py-2 rounded-full border border-gold/30 text-xs font-bold ${lang === 'en' ? 'font-urdu' : ''}`} aria-label={t(lang, 'language')}>{lang === 'en' ? 'اردو' : lang === 'ur' ? 'Roman' : 'EN'}</button>}
          <button onClick={onToggleTheme} className="p-2 rounded-full border border-gold/30" aria-label={t(lang, 'toggleTheme')}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          {/* D1: the sign-in button only exists when sync is configured;
              otherwise this button simply opens Settings. */}
          <button onClick={onOpenSettings} className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gold text-black text-xs font-bold">
            <User size={14} />{isSupabaseConfigured ? (user ? t(lang, 'profile') : t(lang, 'signIn')) : t(lang, 'settings')}
          </button>
        </div>
      </div>
    </header>
  )
}
