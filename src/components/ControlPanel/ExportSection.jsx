// 내보내기 섹션 (Binance 스타일 — 노란 CTA 버튼)
import { Section, NumberInput } from './UIAtoms'
import { PRESET_RESOLUTIONS } from '../../hooks/useStyleState'

export function ExportSection({ state, update, onExport, exporting }) {
  return (
    <Section title="내보내기">
      {/* 프리셋 */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {PRESET_RESOLUTIONS.map((p, i) => {
          const active = !state.useCustomSize && state.exportPreset === i
          return (
            <button
              key={i}
              onClick={() => { update('exportPreset', i); update('useCustomSize', false) }}
              className="px-2 py-2 text-xs rounded transition-colors text-left"
              style={{
                background: active ? 'rgba(252,213,53,0.1)' : 'var(--color-surface-elevated)',
                color: active ? 'var(--color-primary)' : 'var(--color-muted-strong)',
                border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-hairline)'}`,
                fontWeight: active ? 600 : 400,
              }}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* 커스텀 크기 */}
      <div className="mb-4">
        <label className="flex items-center gap-2 mb-2 cursor-pointer">
          <div
            className="w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors"
            style={{
              background: state.useCustomSize ? 'var(--color-primary)' : 'transparent',
              border: `1.5px solid ${state.useCustomSize ? 'var(--color-primary)' : 'var(--color-hairline)'}`,
            }}
            onClick={() => update('useCustomSize', !state.useCustomSize)}
          >
            {state.useCustomSize && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="#181a20" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>직접 입력</span>
        </label>
        {state.useCustomSize && (
          <div className="flex items-center gap-2">
            <NumberInput value={state.customWidth} onChange={v => update('customWidth', v)} className="w-full" />
            <span className="text-xs shrink-0" style={{ color: 'var(--color-muted)' }}>×</span>
            <NumberInput value={state.customHeight} onChange={v => update('customHeight', v)} className="w-full" />
          </div>
        )}
      </div>

      {/* 저장 버튼 — Binance primary CTA */}
      <button
        onClick={onExport}
        disabled={exporting}
        className="w-full py-2.5 rounded text-sm font-semibold transition-colors"
        style={{
          background: exporting ? 'var(--color-primary-disabled)' : 'var(--color-primary)',
          color: exporting ? 'var(--color-muted)' : 'var(--color-ink)',
          cursor: exporting ? 'not-allowed' : 'pointer',
        }}
      >
        {exporting ? '저장 중...' : 'PNG 저장'}
      </button>
    </Section>
  )
}
