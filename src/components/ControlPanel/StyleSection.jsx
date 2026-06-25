// Skew, Shadow, 테두리, 불투명도 스타일 설정 섹션
import { Section, SliderRow, ColorRow, Toggle } from './UIAtoms'

export function StyleSection({ state, update }) {
  return (
    <>
      {/* Skew */}
      <Section title="기울기 (Skew)">
        <SliderRow
          label="X축"
          value={state.skewX}
          min={-45}
          max={45}
          unit="°"
          onChange={v => update('skewX', v)}
        />
        <SliderRow
          label="Y축"
          value={state.skewY}
          min={-45}
          max={45}
          unit="°"
          onChange={v => update('skewY', v)}
        />
      </Section>

      {/* Shadow */}
      <Section title="그림자 (Shadow)">
        <Toggle
          label="그림자 사용"
          checked={state.shadowEnabled}
          onChange={v => update('shadowEnabled', v)}
        />
        {state.shadowEnabled && (
          <>
            <SliderRow
              label="X 오프셋"
              value={state.shadowOffsetX}
              min={-50}
              max={50}
              unit="px"
              onChange={v => update('shadowOffsetX', v)}
            />
            <SliderRow
              label="Y 오프셋"
              value={state.shadowOffsetY}
              min={-50}
              max={50}
              unit="px"
              onChange={v => update('shadowOffsetY', v)}
            />
            <SliderRow
              label="흐림"
              value={state.shadowBlur}
              min={0}
              max={50}
              unit="px"
              onChange={v => update('shadowBlur', v)}
            />
            <ColorRow
              label="색상"
              value={state.shadowColor}
              onChange={v => update('shadowColor', v)}
            />
          </>
        )}
      </Section>

      {/* 텍스트 외곽선 */}
      <Section title="텍스트 외곽선">
        <SliderRow
          label="두께"
          value={state.strokeWidth}
          min={0}
          max={20}
          unit="px"
          onChange={v => update('strokeWidth', v)}
        />
        {state.strokeWidth > 0 && (
          <ColorRow
            label="색상"
            value={state.strokeColor}
            onChange={v => update('strokeColor', v)}
          />
        )}
      </Section>

      {/* 불투명도 */}
      <Section title="불투명도">
        <SliderRow
          label="투명도"
          value={state.opacity}
          min={0}
          max={100}
          unit="%"
          onChange={v => update('opacity', v)}
        />
      </Section>
    </>
  )
}
