// 내보내기 해상도 설정 및 PNG 저장 버튼 섹션
import { useState } from 'react'
import { Section, NumberInput } from './UIAtoms'
import { PRESET_RESOLUTIONS } from '../../hooks/useStyleState'

export function ExportSection({ state, update, onExport, exporting }) {
  return (
    <Section title="내보내기">
      {/* 프리셋 */}
      <div className="mb-3">
        <p className="text-xs text-white/50 mb-2">해상도 프리셋</p>
        <div className="flex flex-col gap-1">
          {PRESET_RESOLUTIONS.map((p, i) => (
            <button
              key={i}
              onClick={() => { update('exportPreset', i); update('useCustomSize', false) }}
              className={`px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                !state.useCustomSize && state.exportPreset === i
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 커스텀 */}
      <div className="mb-4">
        <button
          onClick={() => update('useCustomSize', !state.useCustomSize)}
          className={`text-xs mb-2 transition-colors ${
            state.useCustomSize ? 'text-indigo-400' : 'text-white/40 hover:text-white/60'
          }`}
        >
          {state.useCustomSize ? '✓' : '○'} 직접 입력
        </button>
        {state.useCustomSize && (
          <div className="flex items-center gap-2">
            <NumberInput
              value={state.customWidth}
              onChange={v => update('customWidth', v)}
              className="w-full"
            />
            <span className="text-white/40 text-sm">×</span>
            <NumberInput
              value={state.customHeight}
              onChange={v => update('customHeight', v)}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={onExport}
        disabled={exporting}
        className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-500/50 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        {exporting ? '저장 중...' : 'PNG 저장'}
      </button>
    </Section>
  )
}
