// 배경 타입 선택 및 설정 섹션 (단색 / 투명 / 그라디언트)
import { Section, ColorRow, SliderRow } from './UIAtoms'

const TABS = [
  { value: 'solid', label: '단색' },
  { value: 'transparent', label: '투명' },
  { value: 'gradient', label: '그라디언트' },
]

export function BgSection({ state, update }) {
  return (
    <Section title="배경">
      {/* 탭 */}
      <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => update('bgType', tab.value)}
            className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              state.bgType === tab.value
                ? 'bg-indigo-500 text-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {state.bgType === 'solid' && (
        <ColorRow
          label="배경색"
          value={state.bgColor}
          onChange={v => update('bgColor', v)}
        />
      )}

      {state.bgType === 'transparent' && (
        <p className="text-xs text-white/40 text-center py-2">
          배경이 투명한 PNG로 저장됩니다.
        </p>
      )}

      {state.bgType === 'gradient' && (
        <>
          <ColorRow
            label="시작색"
            value={state.gradientStart}
            onChange={v => update('gradientStart', v)}
          />
          <ColorRow
            label="끝색"
            value={state.gradientEnd}
            onChange={v => update('gradientEnd', v)}
          />
          <SliderRow
            label="각도"
            value={state.gradientAngle}
            min={0}
            max={360}
            unit="°"
            onChange={v => update('gradientAngle', v)}
          />
        </>
      )}
    </Section>
  )
}
