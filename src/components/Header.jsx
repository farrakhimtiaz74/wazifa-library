import React from 'react'
import { Moon, Sun, User, BookOpen } from 'lucide-react'
import SyncBadge from './SyncBadge'
import { useAuth } from '../context/AuthContext'

export default function Header({ theme, onToggleTheme, onOpenSettings }) {
  const { user } = useAuth()
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-deep/90 dark:bg-[#062C22]/90 bg-[#FAF8F5]/90 border-b border-gold/20 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/40 grid place-items-center text-gold shrink-0"><BookOpen size={18} /></span>
          <div className="min-w-0">
            <h1 className="font-bold text-base leading-tight truncate">Wazifa Library</h1>
            <SyncBadge />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onToggleTheme} className="p-2 rounded-full border border-gold/30" aria-label="Toggle theme">{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button onClick={onOpenSettings} className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gold text-black text-xs font-bold">
            <User size={14} />{user ? 'Profile' : 'Sign in to Sync'}
          </button>
        </div>
      </div>
    </header>
  )
}
