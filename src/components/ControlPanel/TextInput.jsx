// 텍스트 입력 섹션 컴포넌트
import { Section } from './UIAtoms'

export function TextInput({ value, onChange }) {
  return (
    <Section title="텍스트">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        placeholder="텍스트를 입력하세요"
        className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
      />
    </Section>
  )
}
