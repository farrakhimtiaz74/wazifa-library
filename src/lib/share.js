// Wave 5, item 72: deep link that opens this exact wazifa in the reader
// (?w=<id> is handled on app load in App.jsx). Synthetic ids (preset-*,
// durood-*, free-*) are local session shapes, so they get no link.
export function wazifaDeepLink(wazifa) {
  if (!wazifa || !wazifa.id) return ''
  if (wazifa.id.startsWith('preset-') || wazifa.id.startsWith('durood-') || wazifa.id.startsWith('free-')) return ''
  try {
    return `${window.location.origin}${window.location.pathname}?w=${encodeURIComponent(wazifa.id)}`
  } catch { return '' }
}

export function formatWazifaShareText(wazifa) {
  const lines = [wazifa.title, '']
  if (wazifa.arabic) lines.push(wazifa.arabic, '')
  if (wazifa.transliteration) lines.push(wazifa.transliteration)
  if (wazifa.english_translation) lines.push(wazifa.english_translation)
  if (wazifa.urdu_translation) lines.push(wazifa.urdu_translation)
  lines.push('')
  const meta = [`Target: ${wazifa.target_count}x`]
  if (wazifa.recommended_time) meta.push(wazifa.recommended_time)
  if (wazifa.reference) meta.push(`Reference: ${wazifa.reference}`)
  lines.push(meta.join(' · '))
  const link = wazifaDeepLink(wazifa)
  if (link) lines.push('', `Open in the app: ${link}`)
  lines.push('', '— via Wazifa Library')
  return lines.join('\n')
}

export function whatsAppShareUrl(wazifa) {
  return `https://wa.me/?text=${encodeURIComponent(formatWazifaShareText(wazifa))}`
}

export async function shareWazifa(wazifa) {
  const text = formatWazifaShareText(wazifa)
  if (navigator.share) {
    try {
      const url = wazifaDeepLink(wazifa)
      await navigator.share(url ? { title: wazifa.title, text, url } : { title: wazifa.title, text })
      return 'shared'
    } catch (err) {
      if (err && err.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}
