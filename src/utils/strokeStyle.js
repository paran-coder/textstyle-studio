// 텍스트 외곽선 위치(outside/center/inside)별 CSS 스타일을 계산하는 유틸리티

/**
 * outside: text-shadow를 8방향으로 퍼뜨려 바깥쪽 외곽선 시뮬레이션
 * center:  -webkit-text-stroke 그대로 사용 (기본 동작)
 * inside:  stroke를 두껍게 친 뒤 clip으로 텍스트 내부만 남김
 *          → paint-order: stroke fill 로 fill이 stroke 위에 덮여 안쪽만 보이는 효과
 */
export function getStrokeStyle(strokeWidth, strokeColor, strokePosition) {
  if (strokeWidth === 0) {
    return {
      WebkitTextStroke: '0px transparent',
      textShadow: undefined, // 기존 shadow와 병합은 호출부에서 처리
      paintOrder: undefined,
    }
  }

  if (strokePosition === 'center') {
    return {
      WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
      paintOrder: 'stroke fill',
    }
  }

  if (strokePosition === 'outside') {
    // text-shadow 8방향 + 대각 보완으로 균일한 외곽선 구현
    const w = strokeWidth
    const c = strokeColor
    const shadows = [
      `${w}px 0 0 ${c}`,
      `-${w}px 0 0 ${c}`,
      `0 ${w}px 0 ${c}`,
      `0 -${w}px 0 ${c}`,
      `${w}px ${w}px 0 ${c}`,
      `-${w}px ${w}px 0 ${c}`,
      `${w}px -${w}px 0 ${c}`,
      `-${w}px -${w}px 0 ${c}`,
    ]
    return {
      WebkitTextStroke: '0px transparent',
      _strokeShadows: shadows, // 호출부에서 기존 shadow와 합산
    }
  }

  if (strokePosition === 'inside') {
    // stroke를 2배 두껍게 → fill이 stroke 위에 덮여 안쪽 절반만 보임
    return {
      WebkitTextStroke: `${strokeWidth * 2}px ${strokeColor}`,
      paintOrder: 'stroke fill',
    }
  }

  return {}
}
