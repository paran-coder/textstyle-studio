// 폰트 선택(내장 + 업로드) 및 텍스트 기본 스타일 섹션
import { useRef, useState } from 'react'
import { Section, SliderRow, ColorRow } from './UIAtoms'
import { BUILTIN_FONTS } from '../../hooks/useStyleState'
import { loadFontFromFile } from '../../utils/fontLoader'

const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

export function FontSection({ state, update, addUploadedFont, showToast }) {
  const fileInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const allFonts = [
    ...BUILTIN_FONTS,
    ...state.uploadedFonts.map(f => ({ label: `${f} (업로드)`, value: f })),
  ]

  const handleFile = async (file) => {
    try {
      const name = await loadFontFromFile(file)
      addUploadedFont(name)
      showToast(`"${name}" 폰트가 추가되었습니다.`, 'success')
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
      {/* 폰트 선택 */}
      <div className="mb-3">
        <select
          value={state.fontFamily}
          onChange={e => update('fontFamily', e.target.value)}
          className="w-full bg-white/10 rounded-xl px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:border-indigo-500 cursor-pointer"
          style={{ fontFamily: state.fontFamily }}
        >
          {allFonts.map(f => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* 폰트 업로드 */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl px-4 py-3 text-center text-xs cursor-pointer transition-colors mb-4 ${
          dragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/20 hover:border-indigo-400/60'
        }`}
      >
        <span className="text-white/40">폰트 파일 드래그 또는 클릭 (TTF·OTF·WOFF)</span>
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
        <p className="text-xs text-white/50 mb-2">굵기</p>
        <div className="flex flex-wrap gap-1">
          {FONT_WEIGHTS.map(w => (
            <button
              key={w}
              onClick={() => update('fontWeight', w)}
              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                state.fontWeight === w
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
              style={{ fontWeight: w }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <SliderRow
        label="크기"
        value={state.fontSize}
        min={8}
        max={300}
        unit="px"
        onChange={v => update('fontSize', v)}
      />

      <ColorRow
        label="색상"
        value={state.textColor}
        onChange={v => update('textColor', v)}
      />
    </Section>
  )
}
