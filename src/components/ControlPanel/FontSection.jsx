// 폰트 선택 및 업로드 섹션 (Light 테마)
import { useRef, useState } from 'react'
import { Section, SliderRow, ColorRow } from './UIAtoms'
import { BUILTIN_FONTS } from '../../hooks/useStyleState'
import { loadFontFromFile } from '../../utils/fontLoader'

const FONT_WEIGHTS = [300, 400, 500, 600, 700, 800, 900]

export function FontSection({ state, update, addUploadedFont, showToast }) {
  const fileInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const allFonts = [
    ...BUILTIN_FONTS,
    ...state.uploadedFonts.map(f => ({ label: `${f} ↑`, value: f })),
  ]

  const handleFile = async (file) => {
    try {
      const name = await loadFontFromFile(file)
      addUploadedFont(name)
      showToast(`"${name}" 추가됨`, 'success')
    } catch (e) {
      showToast(e.message)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <Section title="폰트">
      <div className="mb-3">
        <select
          value={state.fontFamily}
          onChange={e => update('fontFamily', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded focus:outline-none cursor-pointer"
          style={{
            background: 'var(--color-canvas)',
            color: 'var(--color-body)',
            border: '1px solid var(--color-hairline-strong)',
          }}
        >
          {allFonts.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* 폰트 업로드 */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="rounded px-3 py-3 text-center text-xs cursor-pointer transition-colors mb-4"
        style={{
          border: `1px dashed ${dragging ? 'var(--color-primary-active)' : 'var(--color-hairline-strong)'}`,
          background: dragging ? 'rgba(240,185,11,0.05)' : 'var(--color-surface-card)',
          color: 'var(--color-muted)',
          lineHeight: 1.8,
        }}
      >
        <span>폰트 파일 드래그 또는 클릭</span><br />
        <span>(TTF · OTF · WOFF)</span><br />
        <span className="mt-1 block" style={{ fontSize: 10, color: 'var(--color-muted)' }}>
          첨부한 폰트 저작권은 책임지지 않습니다.
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          className="hidden"
          onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }}
        />
      </div>

      {/* 굵기 */}
      <div className="mb-3">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs" style={{ color: 'var(--color-muted-strong)' }}>굵기</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--color-primary-active)' }}>
            {state.fontWeight}
          </span>
        </div>
        <div className="flex gap-1">
          {FONT_WEIGHTS.map(w => (
            <button
              key={w}
              onClick={() => update('fontWeight', w)}
              className="flex-1 py-1 text-xs rounded transition-colors"
              style={{
                background: state.fontWeight === w ? 'var(--color-primary)' : 'var(--color-canvas)',
                color: state.fontWeight === w ? 'var(--color-ink)' : 'var(--color-muted-strong)',
                fontWeight: w,
                border: `1px solid ${state.fontWeight === w ? 'var(--color-primary-active)' : 'var(--color-hairline-strong)'}`,
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <SliderRow label="크기" value={state.fontSize} min={8} max={300} unit="px"
        onChange={v => update('fontSize', v)} />
      <ColorRow label="색상" value={state.textColor} onChange={v => update('textColor', v)} />
    </Section>
  )
}
