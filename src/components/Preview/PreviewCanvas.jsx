// 스타일이 실시간으로 반영되는 미리보기 영역 컴포넌트
import { forwardRef } from 'react'
import { getStrokeStyle } from '../../utils/strokeStyle'
import { getLongShadow } from '../../utils/longShadow'

function getBackground(state) {
  if (state.bgType === 'transparent') return 'transparent'
  if (state.bgType === 'gradient') {
    return `linear-gradient(${state.gradientAngle}deg, ${state.gradientStart}, ${state.gradientEnd})`
  }
  return state.bgColor
}

function buildTextShadow(state, strokeShadows) {
  const parts = []

  // 1. 롱 섀도우 (가장 아래 레이어)
  if (state.longShadowEnabled) {
    parts.push(getLongShadow(
      state.longShadowLength,
      state.longShadowAngle,
      state.longShadowColor,
      state.longShadowFade,
    ))
  }

  // 2. 외곽선 outside shadows
  if (strokeShadows) parts.push(...strokeShadows)

  // 3. 일반 그림자 (가장 위 레이어)
  if (state.shadowEnabled) {
    parts.push(
      `${state.shadowOffsetX}px ${state.shadowOffsetY}px ${state.shadowBlur}px ${state.shadowColor}`
    )
  }

  return parts.length > 0 ? parts.join(', ') : 'none'
}

export const PreviewCanvas = forwardRef(function PreviewCanvas({ state }, ref) {
  const isTransparent = state.bgType === 'transparent'
  const background = getBackground(state)

  const strokeStyle = getStrokeStyle(state.strokeWidth, state.strokeColor, state.strokePosition)
  const textShadow = buildTextShadow(state, strokeStyle._strokeShadows)

  const textStyle = {
    fontFamily: state.fontFamily,
    fontSize: `${state.fontSize}px`,
    fontWeight: state.fontWeight,
    color: state.textColor,
    transform: `skewX(${state.skewX}deg) skewY(${state.skewY}deg)`,
    textShadow,
    WebkitTextStroke: strokeStyle.WebkitTextStroke,
    paintOrder: strokeStyle.paintOrder,
    opacity: state.opacity / 100,
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    lineHeight: 1.3,
    maxWidth: '90%',
    wordBreak: 'break-word',
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      <div
        className="relative w-full max-w-3xl"
        style={{ aspectRatio: '16/9' }}
      >
        {/* 체크보드 (투명일 때 배경으로) */}
        {isTransparent && (
          <div className="absolute inset-0 rounded-2xl checkerboard opacity-40" />
        )}

        {/* 실제 캡처 대상 */}
        <div
          ref={ref}
          className="absolute inset-0 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{ background }}
        >
          <div style={textStyle}>
            {state.text || ' '}
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-4 text-xs text-white/20">
        미리보기 (실제 저장 크기와 다를 수 있습니다)
      </div>
    </div>
  )
})
