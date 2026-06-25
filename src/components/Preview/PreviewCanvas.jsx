// 스타일이 실시간으로 반영되는 미리보기 영역 컴포넌트
import { forwardRef } from 'react'

function getBackground(state) {
  if (state.bgType === 'transparent') return 'transparent'
  if (state.bgType === 'gradient') {
    return `linear-gradient(${state.gradientAngle}deg, ${state.gradientStart}, ${state.gradientEnd})`
  }
  return state.bgColor
}

function getTextShadow(state) {
  if (!state.shadowEnabled) return 'none'
  return `${state.shadowOffsetX}px ${state.shadowOffsetY}px ${state.shadowBlur}px ${state.shadowColor}`
}

export const PreviewCanvas = forwardRef(function PreviewCanvas({ state }, ref) {
  const isTransparent = state.bgType === 'transparent'
  const background = getBackground(state)
  const textShadow = getTextShadow(state)

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      {/* 미리보기 컨테이너 */}
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
          <div
            style={{
              fontFamily: state.fontFamily,
              fontSize: `${state.fontSize}px`,
              fontWeight: state.fontWeight,
              color: state.textColor,
              transform: `skewX(${state.skewX}deg) skewY(${state.skewY}deg)`,
              textShadow,
              border: state.borderWidth > 0
                ? `${state.borderWidth}px solid ${state.borderColor}`
                : 'none',
              borderRadius: `${state.borderRadius}px`,
              opacity: state.opacity / 100,
              padding: state.borderWidth > 0 ? '0.5em 0.75em' : '0',
              whiteSpace: 'pre-wrap',
              textAlign: 'center',
              lineHeight: 1.3,
              maxWidth: '90%',
              wordBreak: 'break-word',
            }}
          >
            {state.text || ' '}
          </div>
        </div>
      </div>

      {/* 해상도 표시 */}
      <div className="absolute bottom-3 right-4 text-xs text-white/20">
        미리보기 (실제 저장 크기와 다를 수 있습니다)
      </div>
    </div>
  )
})
