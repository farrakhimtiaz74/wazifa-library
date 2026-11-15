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
      await navigator.share({ title: wazifa.title, text })
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
