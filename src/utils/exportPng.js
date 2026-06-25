// PNG 내보내기 — renderToCanvas 공용 로직 사용
import { renderToCanvas } from './renderToCanvas'

export async function exportToPng(element, { width, height, transparent }, state) {
  if (!state) throw new Error('state가 필요합니다.')

  const previewW = element.offsetWidth
  const previewH = element.offsetHeight
  const scale    = Math.min(width / previewW, height / previewH)

  // dpr 적용으로 고해상도 렌더링
  const dpr    = window.devicePixelRatio || 1
  const canvas = document.createElement('canvas')
  canvas.width  = width  * dpr
  canvas.height = height * dpr

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  // transparent일 때 배경 생략 — renderToCanvas 내부에서 처리
  renderToCanvas(canvas, { ...state, bgType: transparent ? 'transparent' : state.bgType }, scale)

  // dpr 고해상도 → 목표 해상도로 다운스케일
  const output    = document.createElement('canvas')
  output.width    = width
  output.height   = height
  const outCtx    = output.getContext('2d')
  outCtx.imageSmoothingEnabled = true
  outCtx.imageSmoothingQuality = 'high'
  outCtx.drawImage(canvas, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    output.toBlob(blob => {
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
