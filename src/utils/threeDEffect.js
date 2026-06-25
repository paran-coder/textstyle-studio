// CSS text-shadow 누적으로 3D 입체 텍스트 효과를 생성하는 유틸리티

/**
 * angle: 그림자가 향하는 방향 (0=오른쪽, 90=아래, 135=오른쪽아래)
 * 두께 레이어는 angle 방향으로 쌓이고,
 * 하이라이트는 angle 반대 방향(빛이 오는 쪽)에 표시
 */
export function get3DShadow(depth, angle, color, highlight) {
  const rad = (angle * Math.PI) / 180
  // 그림자 방향으로 쌓임
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)

  const baseRgb = hexToRgb(color)
  const shadows = []

  // 측면 레이어: 그림자 방향으로 1px씩 밀면서 점점 어두워짐
  for (let i = 1; i <= depth; i++) {
    const x = (dx * i).toFixed(1)
    const y = (dy * i).toFixed(1)
    const darken = Math.max(0, 1 - (i / depth) * 0.5)
    const r = Math.round(baseRgb.r * darken)
    const g = Math.round(baseRgb.g * darken)
    const b = Math.round(baseRgb.b * darken)
    shadows.push(`${x}px ${y}px 0 rgb(${r},${g},${b})`)
  }

  // 드롭 섀도우: 두께 끝에 진한 그림자
  const dropX = (dx * (depth + 2)).toFixed(1)
  const dropY = (dy * (depth + 2)).toFixed(1)
  shadows.push(`${dropX}px ${dropY}px 6px rgba(0,0,0,0.5)`)

  // 하이라이트: 빛이 오는 방향(그림자 반대)에 밝은 레이어
  if (highlight) {
    const hx = (-dx * 1.5).toFixed(1)
    const hy = (-dy * 1.5).toFixed(1)
    shadows.unshift(`${hx}px ${hy}px 0 rgba(255,255,255,0.4)`)
  }

  return shadows
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}
