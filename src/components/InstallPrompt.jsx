import React, { useEffect, useState } from 'react'
import { X, Download, Share } from 'lucide-react'

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [showIos, setShowIos] = useState(false)
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('install-dismissed') === '1')
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferred(e) }
    window.addEventListener('beforeinstallprompt', handler)
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    if (isIos && !standalone) setShowIos(true)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
  if (dismissed || (!deferred && !showIos)) return null
  function dismiss() { localStorage.setItem('install-dismissed', '1'); setDismissed(true) }
  return (
    <div className="fixed bottom-20 left-3 right-3 z-40 max-w-2xl mx-auto rounded-2xl border border-gold/40 bg-[#0a3527] text-white p-4 shadow-2xl flex items-start gap-3">
      <Download className="text-gold shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        <p className="font-bold">Install Wazifa Library</p>
        {deferred ? <p className="opacity-80 text-xs mt-0.5">Add it to your home screen for full offline access.</p> : <p className="opacity-80 text-xs mt-0.5 inline-flex items-center gap-1 flex-wrap">On iPhone: tap <Share size={12} /> Share, then “Add to Home Screen”.</p>}
        {deferred && <button onClick={async () => { deferred.prompt(); await deferred.userChoice; dismiss() }} className="mt-2 px-3 py-1.5 rounded-full bg-gold text-black text-xs font-bold">Install App</button>}
      </div>
      <button onClick={dismiss} aria-label="Dismiss"><X size={16} /></button>
    </div>
  )
}
