import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Copy, Download, Gift, Image as ImageIcon, MessageCircle, Share2, Users } from 'lucide-react'
import { dailyQuotes } from '../data/dailyQuotes'
import { dhikrPresets, presetByKey } from '../data/dhikrPresets'
import { useAuth } from '../context/AuthContext'
import { getSetting } from '../lib/db'
import { getDhikrStats } from '../lib/dhikrStats'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { t } from '../lib/i18n'

function Shell({ title, sub, lang, onBack, children }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm"><ArrowLeft size={17} /> {t(lang, 'back')}</button>
      <h2 className={`text-xl font-extrabold mt-3 ${lang === 'ur' ? 'font-urdu' : ''}`}>{title}</h2>
      {sub && <p className={`text-xs opacity-70 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>{sub}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}
const urduCls = (lang) => (lang === 'ur' ? 'font-urdu' : '')

export function quoteOfToday() {
  const now = new Date()
  const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  return dailyQuotes[doy % dailyQuotes.length]
}

// ================= Hub =================
export default function SharingHub({ lang = 'en', onBack, onNavigate }) {
  const btn = (target, Icon, title, sub) => (
    <button key={target} onClick={() => onNavigate(target)} className="w-full rounded-2xl border border-gold/25 p-4 bg-white/5 text-left flex items-center gap-3 active:scale-[0.99]">
      <Icon className="text-gold shrink-0" size={20} />
      <span className="min-w-0">
        <span className={`block font-bold text-sm ${urduCls(lang)}`}>{title}</span>
        <span className={`block text-[11px] opacity-70 mt-0.5 ${urduCls(lang)}`}>{sub}</span>
      </span>
    </button>
  )
  return (
    <Shell title={t(lang, 'sharingTitle')} sub={t(lang, 'sharingSub')} lang={lang} onBack={onBack}>
      <div className="space-y-2">
        {btn('family', Users, t(lang, 'familyTitle'), t(lang, 'familySub'))}
        {btn('statuspack', ImageIcon, t(lang, 'statusTitle'), t(lang, 'statusSub'))}
        {btn('gift', Gift, t(lang, 'giftTitle'), t(lang, 'giftSub'))}
      </div>
    </Shell>
  )
}

// ================= Item 71: Family Circle =================
export function FamilyView({ lang = 'en', onBack }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    ;(async () => {
      const streak = await getSetting('daily_streak', 0)
      const prefs = await getSetting('preferences', {})
      const ds = await getDhikrStats()
      const week = Object.values(ds).reduce((s, v) => s + (v.week || 0), 0)
      setStats({ streak: streak || 0, week, name: prefs.display_name || '' })
    })()
  }, [])

  async function copyCode() {
    if (!user) return
    try { await navigator.clipboard.writeText(user.id); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard unavailable */ }
  }

  return (
    <Shell title={t(lang, 'familyTitle')} sub={t(lang, 'familySub')} lang={lang} onBack={onBack}>
      {!isSupabaseConfigured ? (
        <div className="rounded-3xl border border-gold/30 bg-gold/10 p-4">
          <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'familyNeedsSync')}</p>
        </div>
      ) : user ? (
        <div className="rounded-3xl border border-gold/25 p-4 bg-white/5">
          <p className={`text-sm font-bold ${urduCls(lang)}`}>{t(lang, 'familyYourCode')}</p>
          <p className="text-xs font-mono break-all mt-2 rounded-xl bg-black/20 px-3 py-2.5">{user.id}</p>
          <button onClick={copyCode} className="mt-3 px-4 py-2 rounded-full bg-gold text-black text-xs font-bold inline-flex items-center gap-1.5">
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? t(lang, 'copiedLabel') : t(lang, 'copyBtn')}
          </button>
          <p className={`text-[11px] opacity-60 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'familyCodeHelp')}</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-gold/30 bg-gold/10 p-4">
          <p className={`text-sm leading-relaxed ${urduCls(lang)}`}>{t(lang, 'familySignInNote')}</p>
        </div>
      )}

      <p className={`text-sm font-bold mt-5 mb-2 ${urduCls(lang)}`}>{t(lang, 'familyPreviewTitle')}</p>
      <div className="rounded-3xl border border-gold/40 p-5 bg-gradient-to-br from-[#0a3527] to-[#062C22] text-[#f5f1e6]">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-gold text-black grid place-items-center font-extrabold text-lg">{(stats?.name || 'Y').slice(0, 1).toUpperCase()}</span>
          <div>
            <p className="font-extrabold">{stats?.name || t(lang, 'familyYou')}</p>
            <p className="text-[11px] opacity-70">{t(lang, 'appName')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="rounded-2xl bg-white/5 border border-gold/20 p-3 text-center">
            <p className="text-xl font-extrabold text-gold">{stats ? stats.streak : '…'}</p>
            <p className="text-[10px] opacity-70">{t(lang, 'currentStreak')}</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-gold/20 p-3 text-center">
            <p className="text-xl font-extrabold text-gold">{stats ? stats.week.toLocaleString() : '…'}</p>
            <p className="text-[10px] opacity-70">{t(lang, 'reportDhikrWeek')}</p>
          </div>
        </div>
      </div>
      <p className={`text-[11px] opacity-60 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'familyPreviewNote')}</p>
    </Shell>
  )
}

// ================= Item 74: WhatsApp status pack =================
// NOTE: this is a NEW, separate status-image feature built inside this
// component. The old wazifa image-card library was deleted in Wave 1 (D7)
// on purpose and is not restored by this page.
function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w } else line = test
  }
  if (line) lines.push(line)
  return lines
}

export function StatusPackView({ lang = 'en', onBack }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [msg, setMsg] = useState('')
  const quote = quoteOfToday()

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 1080; const H = 1920
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#0a3527'); grad.addColorStop(0.55, '#062C22'); grad.addColorStop(1, '#041f18')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H)
    // soft gold glow circles
    ctx.save()
    for (const [x, y, r] of [[880, 260, 340], [140, 1640, 300], [540, 960, 620]]) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, 'rgba(212,175,55,0.10)'); g.addColorStop(1, 'rgba(212,175,55,0)')
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }
    ctx.restore()
    // double gold frame
    ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = 6; ctx.strokeRect(48, 48, W - 96, H - 96)
    ctx.lineWidth = 2; ctx.strokeRect(72, 72, W - 144, H - 144)
    ctx.textAlign = 'center'
    // header
    ctx.fillStyle = '#D4AF37'
    ctx.font = '700 44px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('W A Z I F A   L I B R A R Y', W / 2, 190)
    ctx.font = '34px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = 'rgba(245,241,230,0.75)'
    ctx.fillText(quote.type === 'ayah' ? 'Ayah of the Day' : 'Hadith of the Day', W / 2, 252)
    ctx.fillRect(W / 2 - 90, 292, 180, 3)
    // arabic quote
    ctx.fillStyle = '#f5f1e6'
    ctx.font = '76px Amiri, serif'
    const arLines = wrapText(ctx, quote.arabic, W - 260).slice(0, 9)
    let y = 470
    for (const ln of arLines) { ctx.fillText(ln, W / 2, y); y += 128 }
    // translation
    ctx.font = '42px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = 'rgba(245,241,230,0.92)'
    const trText = lang === 'ur' ? quote.urdu : quote.english
    if (lang === 'ur') ctx.font = '44px "Noto Nastaliq Urdu", serif'
    const trLines = wrapText(ctx, trText, W - 240).slice(0, 7)
    y += 30
    for (const ln of trLines) { ctx.fillText(ln, W / 2, y); y += lang === 'ur' ? 84 : 62 }
    // reference
    ctx.font = '700 38px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#D4AF37'
    ctx.fillText(quote.reference, W / 2, Math.min(y + 40, H - 330))
    // footer
    ctx.font = '34px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = 'rgba(245,241,230,0.7)'
    ctx.fillText(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), W / 2, H - 210)
    ctx.font = '700 40px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#D4AF37'
    ctx.fillText('farrakhimtiaz74.github.io/wazifa-library', W / 2, H - 140)
    setReady(true)
  }

  useEffect(() => {
    let alive = true
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (alive) draw() })
    else draw()
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'wazifa-status.png'; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 4000)
      setMsg(t(lang, 'statusDownloaded'))
    }, 'image/png')
  }

  async function shareImage() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], 'wazifa-status.png', { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: t(lang, 'statusTitle') }); return } catch { /* cancelled */ }
      }
      download()
    }, 'image/png')
  }

  return (
    <Shell title={t(lang, 'statusTitle')} sub={t(lang, 'statusSub')} lang={lang} onBack={onBack}>
      <div className="mx-auto max-w-[300px] rounded-2xl overflow-hidden border border-gold/30">
        <canvas ref={canvasRef} width={1080} height={1920} className="w-full h-auto block" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button onClick={download} disabled={!ready} className="py-3 rounded-2xl bg-gold text-black font-bold text-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-40"><Download size={15} /> {t(lang, 'downloadBtn')}</button>
        <button onClick={shareImage} disabled={!ready} className="py-3 rounded-2xl border border-gold/40 font-bold text-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-40"><Share2 size={15} /> {t(lang, 'share')}</button>
      </div>
      {msg && <p className="text-xs text-gold mt-2 text-center">{msg}</p>}
      <p className={`text-[11px] opacity-60 mt-3 leading-relaxed ${urduCls(lang)}`}>{t(lang, 'statusNote')}</p>
    </Shell>
  )
}

// ================= Item 75: Gift-a-dhikr (builder) =================
export function buildGiftLink(key, target, message) {
  const base = `${window.location.origin}${window.location.pathname}`
  const params = new URLSearchParams()
  params.set('gift', key)
  params.set('n', String(target))
  if (message && message.trim()) params.set('m', message.trim())
  return `${base}?${params.toString()}`
}

export function GiftView({ lang = 'en', onBack }) {
  const [key, setKey] = useState('durood')
  const [target, setTarget] = useState(100)
  const [custom, setCustom] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const effTarget = custom ? Math.max(1, Number(custom) || 1) : target
  const link = buildGiftLink(key, effTarget, message)
  const preset = presetByKey(key)

  async function copy() {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard unavailable */ }
  }
  const waText = encodeURIComponent(`${t(lang, 'giftWaText')} ${preset ? preset.transliteration : ''} × ${effTarget}\n${link}`)

  return (
    <Shell title={t(lang, 'giftTitle')} sub={t(lang, 'giftSub')} lang={lang} onBack={onBack}>
      <p className={`text-sm font-bold mb-2 ${urduCls(lang)}`}>{t(lang, 'giftPickDhikr')}</p>
      <div className="flex flex-wrap gap-2">
        {dhikrPresets.map((p) => (
          <button key={p.key} onClick={() => setKey(p.key)} aria-pressed={key === p.key} className={`px-3 py-1.5 rounded-full text-xs border ${key === p.key ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30 opacity-80'}`}>{p.transliteration}</button>
        ))}
      </div>
      <p className={`text-sm font-bold mt-4 mb-2 ${urduCls(lang)}`}>{t(lang, 'giftPickTarget')}</p>
      <div className="flex items-center gap-2">
        {[100, 500, 1000].map((n) => (
          <button key={n} onClick={() => { setTarget(n); setCustom('') }} aria-pressed={!custom && target === n} className={`px-4 py-2 rounded-full text-sm border ${!custom && target === n ? 'bg-gold text-black border-gold font-bold' : 'border-gold/30'}`}>{n}</button>
        ))}
        <input type="number" min="1" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={t(lang, 'customTarget')} className="w-24 rounded-full border border-gold/30 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold" aria-label={t(lang, 'customTarget')} />
      </div>
      <p className={`text-sm font-bold mt-4 mb-2 ${urduCls(lang)}`}>{t(lang, 'giftMessageLabel')}</p>
      <input value={message} onChange={(e) => setMessage(e.target.value)} maxLength={120} placeholder={t(lang, 'giftMessagePh')} className={`w-full rounded-xl border border-gold/25 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-gold ${urduCls(lang)}`} />
      <div className="rounded-2xl border border-gold/25 bg-black/10 p-3.5 mt-4">
        <p className="font-arabic text-2xl text-center" dir="rtl">{preset?.arabic}</p>
        <p className="text-center text-sm font-bold mt-1">{preset?.transliteration} × {effTarget}</p>
        <p className="text-[11px] break-all opacity-60 mt-2 text-center">{link}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button onClick={copy} className="py-3 rounded-2xl bg-gold text-black font-bold text-sm inline-flex items-center justify-center gap-1.5">{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? t(lang, 'copiedLabel') : t(lang, 'copyLinkBtn')}</button>
        <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer" className="py-3 rounded-2xl border border-gold/40 font-bold text-sm inline-flex items-center justify-center gap-1.5"><MessageCircle size={15} /> WhatsApp</a>
      </div>
    </Shell>
  )
}
