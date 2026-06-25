// Canvas 기반 실시간 미리보기 컴포넌트 — Light 테마
import { forwardRef, useEffect, useRef, useCallback } from 'react'
import { renderToCanvas } from '../../utils/renderToCanvas'

export const PreviewCanvas = forwardRef(function PreviewCanvas({ state }, exportRef) {
  const canvasRef  = useRef(null)
  const wrapperRef = useRef(null)

  const draw = useCallback(() => {
    const canvas  = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const w = wrapper.offsetWidth
    const h = wrapper.offsetHeight
    if (!w || !h) return

    const dpr = window.devicePixelRatio || 1
    canvas.width  = w * dpr
    canvas.height = h * dpr
    canvas.style.width  = `${w}px`
    canvas.style.height = `${h}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    renderToCanvas(canvas, state, 1)
  }, [state])

  useEffect(() => { draw() }, [draw])

  useEffect(() => {
    const observer = new ResizeObserver(draw)
    if (wrapperRef.current) observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [draw])

  useEffect(() => {
    if (exportRef) {
      if (typeof exportRef === 'function') exportRef(wrapperRef.current)
      else exportRef.current = wrapperRef.current
    }
  }, [exportRef])

  const isTransparent = state.bgType === 'transparent'

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      <div className="relative w-full max-w-4xl" style={{ aspectRatio: '16/9' }}>

        {/* 투명 배경 체크보드 */}
        {isTransparent && (
          <div className="absolute inset-0 rounded checkerboard" />
        )}

        {/* Canvas 미리보기 — 살짝 그림자로 미리보기 영역 구분 */}
        <div
          ref={wrapperRef}
          className="absolute inset-0 rounded overflow-hidden"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        >
          <canvas ref={canvasRef} className="block" />
        </div>

        {/* 코너 마커 */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-3 h-3 pointer-events-none`}
            style={{
              border: `1.5px solid var(--color-primary-active)`,
              opacity: 0.7,
              borderRight:  pos.includes('left')   ? 'none' : undefined,
              borderLeft:   pos.includes('right')  ? 'none' : undefined,
              borderBottom: pos.includes('top')    ? 'none' : undefined,
              borderTop:    pos.includes('bottom') ? 'none' : undefined,
            }}
          />
        ))}
      </div>

      {/* 하단 상태 바 */}
      <div className="absolute bottom-3 right-5">
        <span className="text-xs tabular-nums" style={{ color: 'var(--color-muted)' }}>
          {state.fontSize}px · {state.fontWeight}
        </span>
      </div>
    </div>
  )
})
