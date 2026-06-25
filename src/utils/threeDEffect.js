// CSS text-shadow 누적으로 3D 입체 텍스트 효과를 생성하는 유틸리티

/**
 * 3D 효과 구성:
 * 1. 측면 두께 레이어 — 같은 방향으로 1px씩 밀면서 점점 어두워지는 shadow 누적
 * 2. 하이라이트 — 빛 방향 반대쪽에 밝은 shadow 1~2px (선택)
 * 3. 드롭 섀도우 — 가장 아래에 진한 그림자
 *
 * angle: 빛이 오는 방향 (0=오른쪽, 90=아래, 135=오른쪽아래)
 * depth가 클수록 두께가 두꺼워짐
 */
export function get3DShadow(depth, angle, color, highlight) {
  const rad = (angle * Math.PI) / 180
  // 두께는 빛 반대 방향으로 쌓임
  const dx = -Math.cos(rad)
  const dy = -Math.sin(rad)

  const baseRgb = hexToRgb(color)
  const shadows = []

  // 측면 레이어: 1px씩 밀면서 점점 어두운 색으로
  for (let i = 1; i <= depth; i++) {
    const x = (dx * i).toFixed(1)
    const y = (dy * i).toFixed(1)
    // 앞쪽(i=1)은 원색, 뒤쪽(i=depth)은 더 어둡게
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

  // 하이라이트: 빛 방향으로 살짝 밝은 shadow
  if (highlight) {
    const hx = (Math.cos(rad) * 1.5).toFixed(1)
    const hy = (Math.sin(rad) * 1.5).toFixed(1)
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
