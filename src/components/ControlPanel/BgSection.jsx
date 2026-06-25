// 배경 설정 섹션 (Binance 스타일)
import { Section, ColorRow, SliderRow, TabGroup } from './UIAtoms'

const BG_TABS = [
  { value: 'solid',       label: '단색' },
  { value: 'transparent', label: '투명' },
  { value: 'gradient',    label: '그라디언트' },
]

export function BgSection({ state, update }) {
  return (
    <Section title="배경">
      <TabGroup options={BG_TABS} value={state.bgType} onChange={v => update('bgType', v)} />

      {state.bgType === 'solid' && (
        <ColorRow label="배경색" value={state.bgColor} onChange={v => update('bgColor', v)} />
      )}

      {state.bgType === 'transparent' && (
        <p className="text-xs text-center py-2" style={{ color: 'var(--color-muted)' }}>
          투명 PNG로 저장됩니다.
        </p>
      )}

      {state.bgType === 'gradient' && (
        <>
          <ColorRow label="시작색" value={state.gradientStart} onChange={v => update('gradientStart', v)} />
          <ColorRow label="끝색"   value={state.gradientEnd}   onChange={v => update('gradientEnd', v)} />
          <SliderRow label="각도" value={state.gradientAngle} min={0} max={360} unit="°"
            onChange={v => update('gradientAngle', v)} />
        </>
      )}
    </Section>
  )
}
