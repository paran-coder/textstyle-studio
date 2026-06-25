// 텍스트 입력 섹션 컴포넌트 (Binance 스타일)
import { Section } from './UIAtoms'

export function TextInput({ value, onChange }) {
  return (
    <Section title="텍스트">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        placeholder="텍스트를 입력하세요"
        className="w-full px-3 py-2.5 text-sm rounded resize-none focus:outline-none leading-relaxed"
        style={{
          background: 'var(--color-surface-elevated)',
          color: 'var(--color-on-dark)',
          border: '1px solid var(--color-hairline)',
          fontFamily: 'inherit',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-hairline)'}
      />
    </Section>
  )
}
