// 텍스트 스타일러 앱의 루트 레이아웃 컴포넌트
import { useRef, useState } from 'react'
import { useStyleState } from './hooks/useStyleState'
import { TextInput } from './components/ControlPanel/TextInput'
import { FontSection } from './components/ControlPanel/FontSection'
import { StyleSection } from './components/ControlPanel/StyleSection'
import { BgSection } from './components/ControlPanel/BgSection'
import { ExportSection } from './components/ControlPanel/ExportSection'
import { PreviewCanvas } from './components/Preview/PreviewCanvas'
import { useToast } from './components/Toast'
import { exportToPng } from './utils/exportPng'

export default function App() {
  const { state, update, addUploadedFont, getExportSize } = useStyleState()
  const { showToast, ToastRenderer } = useToast()
  const previewRef = useRef(null)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!state.text.trim()) {
      showToast('텍스트를 입력해 주세요.')
      return
    }

    const size = getExportSize()
    if (size.width < 1 || size.height < 1) {
      showToast('해상도는 1px 이상이어야 합니다.')
      return
    }

    setExporting(true)
    try {
      await exportToPng(previewRef.current, {
        width: size.width,
        height: size.height,
        transparent: state.bgType === 'transparent',
      })
      showToast('PNG가 저장되었습니다.', 'success')
    } catch (e) {
      showToast('저장에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f1a]">
      <ToastRenderer />

      {/* 좌측 컨트롤 패널 */}
      <aside className="w-80 shrink-0 bg-[#1a1a2e] border-r border-white/5 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-white/5">
          <h1 className="text-base font-bold text-white tracking-tight">TextStyle Studio</h1>
          <p className="text-xs text-white/30 mt-0.5">텍스트 꾸미고 PNG로 저장</p>
        </div>

        {/* 컨트롤 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0">
          <TextInput value={state.text} onChange={v => update('text', v)} />
          <FontSection
            state={state}
            update={update}
            addUploadedFont={addUploadedFont}
            showToast={showToast}
          />
          <StyleSection state={state} update={update} />
          <BgSection state={state} update={update} />
          <ExportSection
            state={state}
            update={update}
            onExport={handleExport}
            exporting={exporting}
          />
        </div>
      </aside>

      {/* 우측 미리보기 */}
      <main className="flex-1 bg-[#0f0f1a] flex flex-col">
        <PreviewCanvas ref={previewRef} state={state} />
      </main>
    </div>
  )
}
