function wrapText(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w } else line = test
  }
  if (line) lines.push(line)
  return lines
}

export async function generateWazifaImageCard(wazifa) {
  try { await document.fonts.ready } catch { /* fonts may already be loaded */ }
  const W = 1080
  const H = 1350
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#0a3d2c')
  grad.addColorStop(0.55, '#062C22')
  grad.addColorStop(1, '#041f17')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = '#D4AF37'
  ctx.lineWidth = 6
  ctx.strokeRect(36, 36, W - 72, H - 72)
  ctx.lineWidth = 1.5
  ctx.strokeRect(56, 56, W - 112, H - 112)
  ctx.fillStyle = '#D4AF37'
  for (const [x, y] of [[36, 36], [W - 36, 36], [36, H - 36], [W - 36, H - 36]]) {
    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill()
  }

  let y = 150
  ctx.textAlign = 'center'
  ctx.fillStyle = '#D4AF37'
  ctx.font = '700 44px "Plus Jakarta Sans", sans-serif'
  const titleLines = wrapText(ctx, wazifa.title || 'Wazifa', W - 220)
  for (const l of titleLines) { ctx.fillText(l, W / 2, y); y += 56 }
  y += 6
  ctx.fillRect(W / 2 - 90, y, 180, 3); y += 54

  const arabic = String(wazifa.arabic || '')
  let aSize = arabic.length > 220 ? 44 : arabic.length > 110 ? 54 : 64
  ctx.fillStyle = '#f5f1e6'
  ctx.font = `${aSize}px Amiri, "Scheherazade New", serif`
  let aLines = wrapText(ctx, arabic, W - 200)
  while (aLines.length * (aSize * 1.9) > 560 && aSize > 30) {
    aSize -= 4
    ctx.font = `${aSize}px Amiri, "Scheherazade New", serif`
    aLines = wrapText(ctx, arabic, W - 200)
  }
  const aLH = aSize * 1.9
  for (const l of aLines) { ctx.fillText(l, W / 2, y); y += aLH }
  y += 26

  ctx.font = 'italic 400 32px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = 'rgba(245,241,230,0.92)'
  const tLines = wrapText(ctx, wazifa.transliteration || '', W - 200).slice(0, 3)
  for (const l of tLines) { ctx.fillText(l, W / 2, y); y += 44 }
  if (tLines.length) y += 10
  ctx.font = '400 32px "Plus Jakarta Sans", sans-serif'
  const eLines = wrapText(ctx, wazifa.english_translation || '', W - 200).slice(0, 4)
  for (const l of eLines) { ctx.fillText(l, W / 2, y); y += 44 }

  ctx.fillStyle = '#D4AF37'
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif'
  const meta = [wazifa.reference || '', wazifa.target_count ? `Target ${wazifa.target_count}x` : ''].filter(Boolean).join('  ·  ')
  if (meta) ctx.fillText(meta, W / 2, H - 140)
  ctx.font = '700 30px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('Wazifa Library', W / 2, H - 96)
  ctx.font = '400 23px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = 'rgba(245,241,230,0.75)'
  ctx.fillText('farrakhimtiaz74.github.io/wazifa-library', W / 2, H - 62)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

export async function shareOrDownloadImageCard(wazifa) {
  const blob = await generateWazifaImageCard(wazifa)
  if (!blob) return 'failed'
  const fileName = `${(wazifa.id || 'wazifa').replace(/[^a-z0-9-]/gi, '-')}-card.png`
  const file = new File([blob], fileName, { type: 'image/png' })
  if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
    try {
      await navigator.share({ files: [file], title: wazifa.title })
      return 'shared'
    } catch (err) {
      if (err && err.name === 'AbortError') return 'cancelled'
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
  return 'downloaded'
}
