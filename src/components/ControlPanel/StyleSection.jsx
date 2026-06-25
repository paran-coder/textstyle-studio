// Skew, Shadow, 롱 섀도우, 3D 입체, 텍스트 외곽선, 불투명도 스타일 설정 섹션
import { Section, SliderRow, ColorRow, Toggle, ChipButton } from './UIAtoms'

const STROKE_POSITIONS = [
  { value: 'outside', label: '바깥' },
  { value: 'center',  label: '중앙' },
  { value: 'inside',  label: '안쪽' },
]

export function StyleSection({ state, update }) {
  return (
    <>
      {/* Skew */}
      <Section title="기울기 (Skew)">
        <SliderRow label="X축" value={state.skewX} min={-45} max={45} unit="°"
          onChange={v => update('skewX', v)} />
        <SliderRow label="Y축" value={state.skewY} min={-45} max={45} unit="°"
          onChange={v => update('skewY', v)} />
      </Section>

      {/* 일반 그림자 */}
      <Section title="그림자 (Shadow)">
        <Toggle label="그림자 사용" checked={state.shadowEnabled}
          onChange={v => update('shadowEnabled', v)} />
        {state.shadowEnabled && (
          <>
            <SliderRow label="X 오프셋" value={state.shadowOffsetX} min={-50} max={50} unit="px"
              onChange={v => update('shadowOffsetX', v)} />
            <SliderRow label="Y 오프셋" value={state.shadowOffsetY} min={-50} max={50} unit="px"
              onChange={v => update('shadowOffsetY', v)} />
            <SliderRow label="흐림" value={state.shadowBlur} min={0} max={50} unit="px"
              onChange={v => update('shadowBlur', v)} />
            <ColorRow label="색상" value={state.shadowColor}
              onChange={v => update('shadowColor', v)} />
          </>
        )}
      </Section>

      {/* 롱 섀도우 */}
      <Section title="긴 그림자 (Long Shadow)">
        <Toggle label="긴 그림자 사용" checked={state.longShadowEnabled}
          onChange={v => update('longShadowEnabled', v)} />
        {state.longShadowEnabled && (
          <>
            <SliderRow label="길이" value={state.longShadowLength} min={10} max={300} unit="px"
              onChange={v => update('longShadowLength', v)} />
            <SliderRow label="각도" value={state.longShadowAngle} min={0} max={359} unit="°"
              onChange={v => update('longShadowAngle', v)} />
            <ColorRow label="색상" value={state.longShadowColor}
              onChange={v => update('longShadowColor', v)} />
            <Toggle label="페이드 아웃" checked={state.longShadowFade}
              onChange={v => update('longShadowFade', v)} />
          </>
        )}
      </Section>

      {/* 3D 입체 효과 */}
      <Section title="3D 입체 효과">
        <Toggle label="3D 효과 사용" checked={state.threeDEnabled}
          onChange={v => update('threeDEnabled', v)} />
        {state.threeDEnabled && (
          <>
            <SliderRow label="두께" value={state.threeDDepth} min={1} max={40} unit="px"
              onChange={v => update('threeDDepth', v)} />
            <SliderRow label="그림자 방향" value={state.threeDAngle} min={0} max={359} unit="°"
              onChange={v => update('threeDAngle', v)} />
            <ColorRow label="측면 색" value={state.threeDColor}
              onChange={v => update('threeDColor', v)} />
            <Toggle label="하이라이트" checked={state.threeDHighlight}
              onChange={v => update('threeDHighlight', v)} />
            {/* 그림자 방향 프리셋 */}
            <div className="mt-2">
              <p className="text-xs mb-2" style={{ color: 'var(--color-muted-strong)' }}>
                그림자 방향 프리셋
              </p>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: '↖ 왼쪽위',     angle: 225 },
                  { label: '↑ 위',          angle: 270 },
                  { label: '↗ 오른쪽위',   angle: 315 },
                  { label: '↙ 왼쪽아래',   angle: 135 },
                  { label: '↓ 아래',        angle: 90  },
                  { label: '↘ 오른쪽아래', angle: 45  },
                ].map(p => (
                  <ChipButton
                    key={p.angle}
                    label={p.label}
                    active={state.threeDAngle === p.angle}
                    onClick={() => update('threeDAngle', p.angle)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </Section>

      {/* 텍스트 외곽선 */}
      <Section title="텍스트 외곽선">
        <SliderRow label="두께" value={state.strokeWidth} min={0} max={20} unit="px"
          onChange={v => update('strokeWidth', v)} />
        {state.strokeWidth > 0 && (
          <>
            <ColorRow label="색상" value={state.strokeColor}
              onChange={v => update('strokeColor', v)} />
            <div className="mt-2">
              <p className="text-xs text-white/50 mb-2">위치</p>
              <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                {STROKE_POSITIONS.map(pos => (
                  <button key={pos.value}
                    onClick={() => update('strokePosition', pos.value)}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                      state.strokePosition === pos.value
                        ? 'bg-indigo-500 text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </Section>

      {/* 불투명도 */}
      <Section title="불투명도">
        <SliderRow label="투명도" value={state.opacity} min={0} max={100} unit="%"
          onChange={v => update('opacity', v)} />
      </Section>
    </>
  )
}
