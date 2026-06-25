// Canvas API로 텍스트를 직접 그려 PNG로 저장하는 유틸리티
// 미리보기 실제 크기 대비 배율을 계산해 폰트·효과 수치를 스케일업

function parseColor(hex) {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
    a: clean.length === 8 ? parseInt(clean.slice(6, 8), 16) / 255 : 1,
  }
}

function toRgba({ r, g, b, a }) {
  return `rgba(${r},${g},${b},${a})`
}

// 텍스트를 실제로 그리는 함수 — shadow/stroke/fill 모두 처리
function drawText(ctx, lines, startY, lineH, state, scale) {
  const sw = state.strokeWidth * scale

  // 그림자 설정 초기화
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur    = 0
  ctx.shadowColor   = 'transparent'

  // ── 롱 섀도우 (가장 아래) ──────────────────────────────────
  if (state.longShadowEnabled) {
    const rad = (state.longShadowAngle * Math.PI) / 180
    const dx = Math.cos(rad)
    const dy = Math.sin(rad)
    const c  = parseColor(state.longShadowColor)
    const len = state.longShadowLength * scale
    for (let i = Math.floor(len); i >= 1; i--) {
      const alpha = state.longShadowFade ? c.a * (1 - i / len) : c.a
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha.toFixed(3)})`
      lines.forEach((line, li) => ctx.fillText(line, dx * i, startY + dy * i + li * lineH))
    }
  }

  // ── 3D 입체 (뒤 레이어부터) ──────────────────────────────
  if (state.threeDEnabled) {
    const rad = (state.threeDAngle * Math.PI) / 180
    const dx = Math.cos(rad)   // 그림자 방향
    const dy = Math.sin(rad)
    const c  = parseColor(state.threeDColor)
    const depth = state.threeDDepth * scale

    // 드롭 섀도우
    ctx.shadowOffsetX = dx * (depth + 2 * scale)
    ctx.shadowOffsetY = dy * (depth + 2 * scale)
    ctx.shadowBlur    = 6 * scale
    ctx.shadowColor   = 'rgba(0,0,0,0.5)'
    ctx.fillStyle     = state.textColor
    lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineH))
    ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'

    // 측면 레이어 (뒤에서 앞으로)
    for (let i = Math.floor(depth); i >= 1; i--) {
      const darken = Math.max(0, 1 - (i / depth) * 0.5)
      ctx.fillStyle = `rgb(${Math.round(c.r*darken)},${Math.round(c.g*darken)},${Math.round(c.b*darken)})`
      lines.forEach((line, li) => ctx.fillText(line, dx * i, startY + dy * i + li * lineH))
    }

    // 하이라이트: 빛이 오는 방향(그림자 반대)
    if (state.threeDHighlight) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      lines.forEach((line, li) => ctx.fillText(line, -dx*1.5*scale, startY + (-dy)*1.5*scale + li * lineH))
    }
  }

  // ── 일반 그림자 ──────────────────────────────────────────
  if (state.shadowEnabled) {
    ctx.shadowOffsetX = state.shadowOffsetX * scale
    ctx.shadowOffsetY = state.shadowOffsetY * scale
    ctx.shadowBlur    = state.shadowBlur * scale
    ctx.shadowColor   = state.shadowColor
    ctx.fillStyle     = state.textColor
    lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineH))
    ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
  }

  // ── 외곽선 outside (16방향 shadow) ───────────────────────
  if (sw > 0 && state.strokePosition === 'outside') {
    const steps = 16
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * 2 * Math.PI
      ctx.shadowOffsetX = Math.cos(angle) * sw
      ctx.shadowOffsetY = Math.sin(angle) * sw
      ctx.shadowBlur    = 0
      ctx.shadowColor   = state.strokeColor
      ctx.fillStyle     = state.textColor
      lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineH))
    }
    ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.shadowColor = 'transparent'
  }

  // ── 텍스트 본체 + stroke ─────────────────────────────────
  if (sw > 0 && state.strokePosition === 'center') {
    ctx.strokeStyle = state.strokeColor
    ctx.lineWidth   = sw
    ctx.lineJoin    = 'round'
    lines.forEach((line, li) => ctx.strokeText(line, 0, startY + li * lineH))
  }
  if (sw > 0 && state.strokePosition === 'inside') {
    ctx.strokeStyle = state.strokeColor
    ctx.lineWidth   = sw * 2
    ctx.lineJoin    = 'round'
    lines.forEach((line, li) => ctx.strokeText(line, 0, startY + li * lineH))
  }

  ctx.fillStyle = state.textColor
  lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineH))

  // inside — fill로 바깥 절반 덮기
  if (sw > 0 && state.strokePosition === 'inside') {
    ctx.fillStyle = state.textColor
    lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineH))
  }
}

export async function exportToPng(element, { width, height, transparent }, state) {
  if (!state) throw new Error('state가 필요합니다.')

  // 미리보기 실제 크기 대비 배율 계산
  const previewW = element.offsetWidth
  const previewH = element.offsetHeight
  const scale = Math.min(width / previewW, height / previewH)

  const canvas = document.createElement('canvas')
  canvas.width  = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // ── 배경 ────────────────────────────────────────────────
  if (!transparent) {
    if (state.bgType === 'solid') {
      ctx.fillStyle = state.bgColor
      ctx.fillRect(0, 0, width, height)
    } else if (state.bgType === 'gradient') {
      const rad = (state.gradientAngle * Math.PI) / 180
      const cx = width / 2, cy = height / 2
      const len = Math.sqrt(width ** 2 + height ** 2) / 2
      const grd = ctx.createLinearGradient(
        cx - Math.cos(rad) * len, cy - Math.sin(rad) * len,
        cx + Math.cos(rad) * len, cy + Math.sin(rad) * len,
      )
      grd.addColorStop(0, state.gradientStart)
      grd.addColorStop(1, state.gradientEnd)
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)
    }
  }

  // ── 폰트 / 레이아웃 (배율 적용) ─────────────────────────
  const fontSize = state.fontSize * scale
  ctx.font         = `${state.fontWeight} ${fontSize}px ${state.fontFamily}`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'

  const lines  = (state.text || ' ').split('\n')
  const lineH  = fontSize * 1.3
  const totalH = lines.length * lineH
  const startY = -(totalH - lineH) / 2

  // ── skew + opacity ───────────────────────────────────────
  ctx.save()
  ctx.translate(width / 2, height / 2)
  const skewXrad = (state.skewX * Math.PI) / 180
  const skewYrad = (state.skewY * Math.PI) / 180
  ctx.transform(1, Math.tan(skewYrad), Math.tan(skewXrad), 1, 0, 0)
  ctx.globalAlpha = state.opacity / 100

  drawText(ctx, lines, startY, lineH, state, scale)

  ctx.restore()

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(new Error('PNG 변환에 실패했습니다.')); return }
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href     = url
      a.download = `textstyle-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png')
  })
}
