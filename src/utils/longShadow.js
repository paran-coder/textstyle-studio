// 롱 섀도우 효과를 text-shadow 레이어 누적으로 구현하는 유틸리티

/**
 * angle: 0° = 오른쪽, 90° = 아래, 135° = 오른쪽 아래 (이미지 예시 방향)
 * length: 그림자 총 길이 (px)
 * fade: true면 끝으로 갈수록 alpha 감소
 */
export function getLongShadow(length, angle, color, fade) {
  const rad = (angle * Math.PI) / 180
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)

  // color에서 rgb 추출 (hex or rgba 모두 대응)
  const baseRgb = hexToRgb(color)
  const baseAlpha = hexToAlpha(color)

  const shadows = []
  for (let i = 1; i <= length; i++) {
    const x = (dx * i).toFixed(2)
    const y = (dy * i).toFixed(2)
    const alpha = fade
      ? (baseAlpha * (1 - i / length)).toFixed(3)
      : baseAlpha.toFixed(3)
    shadows.push(`${x}px ${y}px 0 rgba(${baseRgb},${alpha})`)
  }

  return shadows.join(', ')
}

function hexToRgb(hex) {
  // #rrggbb 또는 #rrggbbaa
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r},${g},${b}`
}

function hexToAlpha(hex) {
  const clean = hex.replace('#', '')
  if (clean.length === 8) {
    return parseInt(clean.slice(6, 8), 16) / 255
  }
  return 1
}
