// 미리보기와 내보내기가 공유하는 Canvas 렌더링 핵심 로직
// scale: 미리보기 크기 대비 배율 (미리보기=1, 내보내기=목표해상도/미리보기크기)

function parseColor(hex) {
  const clean = (hex || '#000000').replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16) || 0,
    g: parseInt(clean.slice(2, 4), 16) || 0,
    b: parseInt(clean.slice(4, 6), 16) || 0,
    a: clean.length === 8 ? parseInt(clean.slice(6, 8), 16) / 255 : 1,
  }
}

function clearShadow(ctx) {
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur    = 0
  ctx.shadowColor   = 'transparent'
}

function drawTextLayers(ctx, lines, startY, lineH, state, scale) {
  const sw = state.strokeWidth * scale
  clearShadow(ctx)

  // ── 1. 롱 섀도우 (가장 아래 레이어) ──────────────────────
  if (state.longShadowEnabled) {
    const rad = (state.longShadowAngle * Math.PI) / 180
    const dx  = Math.cos(rad)
    const dy  = Math.sin(rad)
    const c   = parseColor(state.longShadowColor)
    const len = state.longShadowLength * scale
    for (let i = Math.floor(len); i >= 1; i--) {
      const alpha = state.longShadowFade ? c.a * (1 - i / len) : c.a
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha.toFixed(3)})`
      lines.forEach((line, li) => ctx.fillText(line, dx * i, startY + dy * i + li * lineH))
    }
  }

  // ── 2. 3D 입체 ────────────────────────────────────────────
  if (state.threeDEnabled) {
    const rad   = (state.threeDAngle * Math.PI) / 180
    const dx    = Math.cos(rad)
    const dy    = Math.sin(rad)
    const c     = parseColor(state.threeDColor)
    const depth = state.threeDDepth * scale

    // 드롭 섀도우
    ctx.shadowOffsetX = dx * (depth + 2 * scale)
    ctx.shadowOffsetY = dy * (depth + 2 * scale)
    ctx.shadowBlur    = 6 * scale
    ctx.shadowColor   = 'rgba(0,0,0,0.5)'
    ctx.fillStyle     = state.textColor
    lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineH))
    clearShadow(ctx)

    // 측면 레이어 — 뒤에서 앞으로, 지정한 측면색 사용
    for (let i = Math.floor(depth); i >= 1; i--) {
      const darken = Math.max(0, 1 - (i / depth) * 0.5)
      ctx.fillStyle = `rgb(${Math.round(c.r*darken)},${Math.round(c.g*darken)},${Math.round(c.b*darken)})`
      lines.forEach((line, li) => ctx.fillText(line, dx * i, startY + dy * i + li * lineH))
    }

    // 하이라이트 — 그림자 반대 방향에 살짝 밝은 레이어
    if (state.threeDHighlight) {
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      lines.forEach((line, li) =>
        ctx.fillText(line, -dx * 1.2 * scale, startY + (-dy) * 1.2 * scale + li * lineH)
      )
    }
  }

  // ── 3. 일반 그림자 ────────────────────────────────────────
  if (state.shadowEnabled) {
    ctx.shadowOffsetX = state.shadowOffsetX * scale
    ctx.shadowOffsetY = state.shadowOffsetY * scale
    ctx.shadowBlur    = state.shadowBlur * scale
    ctx.shadowColor   = state.shadowColor
    ctx.fillStyle     = state.textColor
    lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineH))
    clearShadow(ctx)
  }

  // ── 4. 외곽선 outside (16방향) ────────────────────────────
  if (sw > 0 && state.strokePosition === 'outside') {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * 2 * Math.PI
      ctx.shadowOffsetX = Math.cos(angle) * sw
      ctx.shadowOffsetY = Math.sin(angle) * sw
      ctx.shadowBlur    = 0
      ctx.shadowColor   = state.strokeColor
      ctx.fillStyle     = state.textColor
      lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineH))
    }
    clearShadow(ctx)
  }

  // ── 5. 텍스트 본체 ────────────────────────────────────────
  if (sw > 0 && (state.strokePosition === 'center' || state.strokePosition === 'inside')) {
    ctx.strokeStyle = state.strokeColor
    ctx.lineWidth   = state.strokePosition === 'inside' ? sw * 2 : sw
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

/**
 * state를 받아 canvas에 배경 + 텍스트를 그림
 * @param {HTMLCanvasElement} canvas
 * @param {object} state
 * @param {number} scale  — 미리보기=1, 내보내기=목표해상도/미리보기크기
 */
export function renderToCanvas(canvas, state, scale = 1) {
  const { width, height } = canvas
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, width, height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // ── 배경 ──────────────────────────────────────────────────
  if (state.bgType !== 'transparent') {
    if (state.bgType === 'solid') {
      ctx.fillStyle = state.bgColor
      ctx.fillRect(0, 0, width, height)
    } else if (state.bgType === 'gradient') {
      const rad = (state.gradientAngle * Math.PI) / 180
      const cx  = width / 2
      const cy  = height / 2
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

  // ── 폰트 / 레이아웃 ───────────────────────────────────────
  const fontSize = state.fontSize * scale
  ctx.font         = `${state.fontWeight} ${fontSize}px ${state.fontFamily}`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'

  const lines  = (state.text || ' ').split('\n')
  const lineH  = fontSize * 1.3
  const totalH = lines.length * lineH
  const startY = -(totalH - lineH) / 2

  // ── skew + opacity ────────────────────────────────────────
  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.transform(
    1, Math.tan((state.skewY * Math.PI) / 180),
    Math.tan((state.skewX * Math.PI) / 180), 1,
    0, 0,
  )
  ctx.globalAlpha = state.opacity / 100

  drawTextLayers(ctx, lines, startY, lineH, state, scale)

  ctx.restore()
}
