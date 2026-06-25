// 텍스트 외곽선 위치(outside/center/inside)별 CSS 스타일을 계산하는 유틸리티

/**
 * outside: text-shadow를 360° 16방향으로 촘촘히 채워 균일한 바깥 외곽선
 * center:  -webkit-text-stroke (stroke가 안팎으로 반반 퍼짐)
 * inside:  center와 동일하게 stroke를 치되, fill 색상으로 바깥 절반을 덮는
 *          추가 레이어를 호출부(PreviewCanvas)에서 처리
 *
 * paint-order는 SVG 전용이라 HTML div에서는 동작하지 않으므로 사용하지 않음.
 * inside는 _insideStroke 플래그로 호출부에 알리고, 래퍼 div에 별도 처리.
 */
export function getStrokeStyle(strokeWidth, strokeColor, strokePosition) {
  if (strokeWidth === 0) {
    return { WebkitTextStroke: '0px transparent' }
  }

  if (strokePosition === 'center') {
    return {
      WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
    }
  }

  if (strokePosition === 'outside') {
    // 360° / 16스텝으로 균일하게 퍼뜨려 부드러운 외곽선 구현
    const w = strokeWidth
    const c = strokeColor
    const steps = 16
    const shadows = Array.from({ length: steps }, (_, i) => {
      const angle = (i / steps) * 2 * Math.PI
      const x = (Math.cos(angle) * w).toFixed(2)
      const y = (Math.sin(angle) * w).toFixed(2)
      return `${x}px ${y}px 0 ${c}`
    })
    return {
      WebkitTextStroke: '0px transparent',
      _strokeShadows: shadows,
    }
  }

  if (strokePosition === 'inside') {
    // stroke를 2배 두께로 치고 → 텍스트 fill 색상과 동일한 색으로
    // 바깥 절반을 덮는 WebkitTextStroke를 textColor로 덮어씌우는 방식.
    // _insideStroke 플래그를 호출부에 전달해 별도 처리.
    return {
      WebkitTextStroke: `${strokeWidth * 2}px ${strokeColor}`,
      _insideStroke: true,
      _insideWidth: strokeWidth,
    }
  }

  return {}
}
