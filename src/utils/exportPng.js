// Canvas API로 텍스트를 직접 그려 PNG로 저장하는 유틸리티
// html2canvas 대신 Canvas 2D를 사용해 공백/폰트 렌더링을 브라우저와 동일하게 유지

function hexToRgba(hex, fallbackAlpha = 1) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const a = clean.length === 8 ? parseInt(clean.slice(6, 8), 16) / 255 : fallbackAlpha
  return `rgba(${r},${g},${b},${a})`
}

function buildShadowList(state) {
  const shadows = []

  // 외곽선 outside (16방향)
  if (state.strokeWidth > 0 && state.strokePosition === 'outside') {
    const steps = 16
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * 2 * Math.PI
      shadows.push({
        x: Math.cos(angle) * state.strokeWidth,
        y: Math.sin(angle) * state.strokeWidth,
        blur: 0,
        color: state.strokeColor,
      })
    }
  }

  // 일반 그림자
  if (state.shadowEnabled) {
    shadows.push({
      x: state.shadowOffsetX,
      y: state.shadowOffsetY,
      blur: state.shadowBlur,
      color: state.shadowColor,
    })
  }

  // 3D 입체
  if (state.threeDEnabled) {
    const rad = (state.threeDAngle * Math.PI) / 180
    const dx = -Math.cos(rad)
    const dy = -Math.sin(rad)
    const hex = state.threeDColor.replace('#', '')
    const br = parseInt(hex.slice(0, 2), 16)
    const bg = parseInt(hex.slice(2, 4), 16)
    const bb = parseInt(hex.slice(4, 6), 16)
    for (let i = 1; i <= state.threeDDepth; i++) {
      const darken = Math.max(0, 1 - (i / state.threeDDepth) * 0.5)
      shadows.push({
        x: dx * i, y: dy * i, blur: 0,
        color: `rgb(${Math.round(br*darken)},${Math.round(bg*darken)},${Math.round(bb*darken)})`,
      })
    }
    shadows.push({ x: dx*(state.threeDDepth+2), y: dy*(state.threeDDepth+2), blur: 6, color: 'rgba(0,0,0,0.5)' })
    if (state.threeDHighlight) {
      shadows.unshift({ x: Math.cos(rad)*1.5, y: Math.sin(rad)*1.5, blur: 0, color: 'rgba(255,255,255,0.4)' })
    }
  }

  // 롱 섀도우
  if (state.longShadowEnabled) {
    const rad = (state.longShadowAngle * Math.PI) / 180
    const dx = Math.cos(rad)
    const dy = Math.sin(rad)
    const hex = state.longShadowColor.replace('#', '')
    const lr = parseInt(hex.slice(0, 2), 16)
    const lg = parseInt(hex.slice(2, 4), 16)
    const lb = parseInt(hex.slice(4, 6), 16)
    const baseAlpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
    for (let i = 1; i <= state.longShadowLength; i++) {
      const alpha = state.longShadowFade ? baseAlpha * (1 - i / state.longShadowLength) : baseAlpha
      shadows.push({ x: dx*i, y: dy*i, blur: 0, color: `rgba(${lr},${lg},${lb},${alpha.toFixed(3)})` })
    }
  }

  return shadows
}

export async function exportToPng(element, { width, height, transparent }, state) {
  if (!state) throw new Error('state가 필요합니다.')

  const canvas = document.createElement('canvas')
  canvas.width  = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // 배경
  if (!transparent) {
    if (state.bgType === 'solid') {
      ctx.fillStyle = state.bgColor
      ctx.fillRect(0, 0, width, height)
    } else if (state.bgType === 'gradient') {
      const rad = (state.gradientAngle * Math.PI) / 180
      const cx = width / 2, cy = height / 2
      const len = Math.sqrt(width**2 + height**2) / 2
      const grd = ctx.createLinearGradient(
        cx - Math.cos(rad)*len, cy - Math.sin(rad)*len,
        cx + Math.cos(rad)*len, cy + Math.sin(rad)*len,
      )
      grd.addColorStop(0, state.gradientStart)
      grd.addColorStop(1, state.gradientEnd)
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)
    }
  }

  // 텍스트 설정
  const fontSize = state.fontSize
  ctx.font = `${state.fontWeight} ${fontSize}px ${state.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // skew 변환
  ctx.save()
  ctx.translate(width / 2, height / 2)
  const skewXrad = (state.skewX * Math.PI) / 180
  const skewYrad = (state.skewY * Math.PI) / 180
  ctx.transform(1, Math.tan(skewYrad), Math.tan(skewXrad), 1, 0, 0)

  const lines = (state.text || ' ').split('\n')
  const lineH  = fontSize * 1.3
  const totalH = lines.length * lineH
  const startY = -(totalH - lineH) / 2

  const opacity = state.opacity / 100
  ctx.globalAlpha = opacity

  const shadows = buildShadowList(state)

  // 그림자 레이어들 (뒤에서 앞 순으로 그림)
  for (const sh of [...shadows].reverse()) {
    ctx.save()
    ctx.shadowOffsetX = sh.x
    ctx.shadowOffsetY = sh.y
    ctx.shadowBlur    = sh.blur
    ctx.shadowColor   = sh.color
    ctx.fillStyle     = 'rgba(0,0,0,0)' // 투명 fill — shadow만 찍기
    lines.forEach((line, i) => {
      ctx.fillText(line, 0, startY + i * lineH)
    })
    ctx.restore()
  }

  // 텍스트 본체
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur    = 0
  ctx.shadowColor   = 'transparent'

  if (state.strokeWidth > 0 && state.strokePosition === 'center') {
    ctx.strokeStyle = state.strokeColor
    ctx.lineWidth   = state.strokeWidth
    ctx.lineJoin    = 'round'
    lines.forEach((line, i) => ctx.strokeText(line, 0, startY + i * lineH))
  }
  if (state.strokeWidth > 0 && state.strokePosition === 'inside') {
    ctx.strokeStyle = state.strokeColor
    ctx.lineWidth   = state.strokeWidth * 2
    ctx.lineJoin    = 'round'
    lines.forEach((line, i) => ctx.strokeText(line, 0, startY + i * lineH))
  }

  ctx.fillStyle = state.textColor
  lines.forEach((line, i) => ctx.fillText(line, 0, startY + i * lineH))

  // inside stroke — fill로 바깥 절반 덮기
  if (state.strokeWidth > 0 && state.strokePosition === 'inside') {
    ctx.fillStyle = state.textColor
    lines.forEach((line, i) => ctx.fillText(line, 0, startY + i * lineH))
  }

  ctx.restore()

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(new Error('PNG 변환에 실패했습니다.')); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `textstyle-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png')
  })
}
