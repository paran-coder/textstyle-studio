// 텍스트 스타일러 앱의 루트 레이아웃 — Binance 디자인 시스템 적용
import { useRef, useState } from 'react'
import { useStyleState, PRESET_RESOLUTIONS } from './hooks/useStyleState'
import { TextInput } from './components/ControlPanel/TextInput'
import { FontSection } from './components/ControlPanel/FontSection'
import { StyleSection } from './components/ControlPanel/StyleSection'
import { BgSection } from './components/ControlPanel/BgSection'
import { ExportSection } from './components/ControlPanel/ExportSection'
import { PreviewCanvas } from './components/Preview/PreviewCanvas'
import { useToast } from './components/Toast'
import { exportToPng } from './utils/exportPng'

export default function App() {
  const { state, update, addUploadedFont, getExportSize, reset } = useStyleState()
  const { showToast, ToastRenderer } = useToast()
  const previewRef = useRef(null)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!state.text.trim()) { showToast('텍스트를 입력해 주세요.'); return }
    const size = getExportSize()
    if (size.width < 1 || size.height < 1) { showToast('해상도는 1px 이상이어야 합니다.'); return }

    setExporting(true)
    try {
      await exportToPng(previewRef.current, {
        width: size.width,
        height: size.height,
        transparent: state.bgType === 'transparent',
      }, state)
      showToast('PNG가 저장되었습니다.', 'success')
    } catch {
      showToast('저장에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setExporting(false)
    }
  }

  const preset = PRESET_RESOLUTIONS[state.exportPreset]
  const resLabel = state.useCustomSize
    ? `${state.customWidth} × ${state.customHeight} px`
    : `${preset.width} × ${preset.height} px`

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-canvas-dark)' }}>
      <ToastRenderer />

      {/* 좌측 컨트롤 패널 */}
      <aside
        className="w-72 shrink-0 flex flex-col overflow-hidden"
        style={{ background: 'var(--color-surface-card)', borderRight: '1px solid var(--color-hairline)' }}
      >
        {/* 헤더 */}
        <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary)' }}>
                <span style={{ color: 'var(--color-ink)', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>T</span>
              </div>
              <h1 className="text-sm font-semibold" style={{ color: 'var(--color-on-dark)' }}>
                TextStyle Studio
              </h1>
            </div>
            <button
              onClick={reset}
              className="text-xs px-2.5 py-1 rounded transition-colors"
              style={{
                color: 'var(--color-on-dark)',
                border: '1px solid var(--color-surface-elevated)',
                background: 'var(--color-surface-elevated)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--color-trading-down)'
                e.currentTarget.style.borderColor = 'var(--color-trading-down)'
                e.currentTarget.style.background = 'rgba(246,70,93,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--color-on-dark)'
                e.currentTarget.style.borderColor = 'var(--color-surface-elevated)'
                e.currentTarget.style.background = 'var(--color-surface-elevated)'
              }}
            >
              초기화
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
            텍스트 꾸미고 PNG로 저장
          </p>
        </div>

        {/* 컨트롤 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <TextInput value={state.text} onChange={v => update('text', v)} />
          <FontSection state={state} update={update} addUploadedFont={addUploadedFont} showToast={showToast} />
          <StyleSection state={state} update={update} />
          <BgSection state={state} update={update} />
          <ExportSection state={state} update={update} onExport={handleExport} exporting={exporting} />
        </div>
      </aside>

      {/* 우측 미리보기 */}
      <main className="flex-1 flex flex-col" style={{ background: 'var(--color-canvas-dark)' }}>
        {/* 상단 바 */}
        <div className="flex items-center justify-between px-5 py-2.5"
          style={{ borderBottom: '1px solid var(--color-hairline)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>미리보기</span>
          <span className="text-xs tabular-nums" style={{ color: 'var(--color-muted)' }}>
            {resLabel}
          </span>
        </div>
        <PreviewCanvas ref={previewRef} state={state} />
      </main>
    </div>
  )
}
