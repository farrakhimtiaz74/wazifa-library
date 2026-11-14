import React, { useEffect, useState } from 'react'
import { Cloud, CloudOff, RefreshCw, HardDrive } from 'lucide-react'
import { subscribeSync } from '../lib/sync'

export default function SyncBadge() {
  const [status, setStatus] = useState('local')
  useEffect(() => subscribeSync(setStatus), [])
  const map = {
    synced: { icon: Cloud, label: 'Synced', cls: 'text-emerald-400' },
    offline: { icon: CloudOff, label: 'Offline - Saved Locally', cls: 'text-amber-400' },
    syncing: { icon: RefreshCw, label: 'Syncing...', cls: 'text-gold animate-spin' },
    local: { icon: HardDrive, label: 'Saved Locally', cls: 'text-white/60' }
  }
  const m = map[status] || map.local
  const Icon = m.icon
  return <span className={`inline-flex items-center gap-1 text-[11px] ${m.cls}`}><Icon size={13} />{m.label}</span>
}
