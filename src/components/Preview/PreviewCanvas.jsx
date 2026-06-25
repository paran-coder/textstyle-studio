// 스타일이 실시간으로 반영되는 미리보기 영역 컴포넌트 (Binance 스타일)
import { forwardRef } from 'react'
import { getStrokeStyle } from '../../utils/strokeStyle'
import { getLongShadow } from '../../utils/longShadow'
import { get3DShadow } from '../../utils/threeDEffect'

function getBackground(state) {
  if (state.bgType === 'transparent') return 'transparent'
  if (state.bgType === 'gradient') {
    return `linear-gradient(${state.gradientAngle}deg, ${state.gradientStart}, ${state.gradientEnd})`
  }
  return state.bgColor
}

function buildTextShadow(state, strokeShadows) {
  const parts = []
  if (strokeShadows) parts.push(...strokeShadows)
  if (state.shadowEnabled) {
    parts.push(`${state.shadowOffsetX}px ${state.shadowOffsetY}px ${state.shadowBlur}px ${state.shadowColor}`)
  }
  if (state.threeDEnabled) {
    parts.push(...get3DShadow(state.threeDDepth, state.threeDAngle, state.threeDColor, state.threeDHighlight))
  }
  if (state.longShadowEnabled) {
    parts.push(getLongShadow(state.longShadowLength, state.longShadowAngle, state.longShadowColor, state.longShadowFade))
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
    opacity: state.opacity / 100,
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    lineHeight: 1.3,
    maxWidth: '90%',
    wordBreak: 'break-word',
    position: 'relative',
  }

  const insideOverlayStyle = strokeStyle._insideStroke ? {
    fontFamily: state.fontFamily,
    fontSize: `${state.fontSize}px`,
    fontWeight: state.fontWeight,
    color: state.textColor,
    WebkitTextStroke: `${strokeStyle._insideWidth * 2}px ${state.textColor}`,
    transform: `skewX(${state.skewX}deg) skewY(${state.skewY}deg)`,
    opacity: state.opacity / 100,
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    lineHeight: 1.3,
    maxWidth: '90%',
    wordBreak: 'break-word',
    position: 'absolute',
    pointerEvents: 'none',
    userSelect: 'none',
  } : null

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      <div className="relative w-full max-w-4xl" style={{ aspectRatio: '16/9' }}>
        {/* 투명 배경 체크보드 */}
        {isTransparent && (
          <div className="absolute inset-0 rounded checkerboard" />
        )}

        {/* 캡처 대상 */}
        <div
          ref={ref}
          className="absolute inset-0 rounded flex items-center justify-center overflow-hidden"
          style={{ background }}
        >
          <div style={textStyle}>{state.text || ' '}</div>
          {insideOverlayStyle && (
            <div style={insideOverlayStyle}>{state.text || ' '}</div>
          )}
        </div>

        {/* 코너 마커 — Binance 스타일 */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-3 h-3`}
            style={{ border: `1.5px solid var(--color-primary)`, opacity: 0.6,
              borderRight: pos.includes('left') ? 'none' : undefined,
              borderLeft: pos.includes('right') ? 'none' : undefined,
              borderBottom: pos.includes('top') ? 'none' : undefined,
              borderTop: pos.includes('bottom') ? 'none' : undefined,
            }} />
        ))}
      </div>

      {/* 하단 상태 바 */}
      <div className="absolute bottom-3 right-5 flex items-center gap-3">
        <span className="text-xs tabular-nums" style={{ color: 'var(--color-muted)' }}>
          {state.fontSize}px · {state.fontWeight}
        </span>
      </div>
    </div>
  )
})
