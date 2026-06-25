// Binance 디자인 시스템 기반 컨트롤 패널 UI 원자 컴포넌트들

export function Section({ title, children }) {
  return (
    <div className="border-b pb-4 mb-4 last:border-0 last:mb-0"
      style={{ borderColor: 'var(--color-hairline)' }}>
      {title && (
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-muted)', letterSpacing: '0.08em' }}>
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

export function SliderRow({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{label}</span>
        <span className="text-xs font-medium tabular-nums"
          style={{ color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

export function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <span className="text-xs w-16 shrink-0 text-right" style={{ color: 'var(--color-muted)' }}>
        {label}
      </span>
      <div className="flex items-center gap-2 flex-1">
        <div className="relative w-7 h-7 rounded overflow-hidden shrink-0"
          style={{ border: '1px solid var(--color-hairline)' }}>
          <input
            type="color"
            value={value.slice(0, 7)}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div className="w-full h-full" style={{ background: value.slice(0, 7) }} />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-xs font-mono rounded focus:outline-none"
          style={{
            background: 'var(--color-surface-elevated)',
            color: 'var(--color-on-dark)',
            border: '1px solid var(--color-hairline)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-hairline)'}
        />
      </div>
    </div>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className="relative shrink-0 transition-colors"
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
          border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--color-hairline)'}`,
        }}
      >
        <span
          className="absolute transition-transform"
          style={{
            top: 2,
            left: 2,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: checked ? 'var(--color-ink)' : 'var(--color-muted)',
            transform: checked ? 'translateX(16px)' : 'translateX(0)',
          }}
        />
      </button>
    </div>
  )
}

export function NumberInput({ value, min = 1, max = 9999, onChange, className = '' }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={e => onChange(Number(e.target.value))}
      className={`px-3 py-1.5 text-sm rounded focus:outline-none ${className}`}
      style={{
        background: 'var(--color-surface-elevated)',
        color: 'var(--color-on-dark)',
        border: '1px solid var(--color-hairline)',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
      onBlur={e => e.target.style.borderColor = 'var(--color-hairline)'}
    />
  )
}

export function TabGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-0 rounded overflow-hidden mb-4"
      style={{ border: '1px solid var(--color-hairline)' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="flex-1 py-1.5 text-xs font-semibold transition-colors"
          style={{
            background: value === opt.value ? 'var(--color-primary)' : 'transparent',
            color: value === opt.value ? 'var(--color-ink)' : 'var(--color-muted)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function PresetButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs rounded transition-colors text-left w-full"
      style={{
        background: active ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
        color: active ? 'var(--color-ink)' : 'var(--color-muted-strong)',
        fontWeight: active ? 600 : 400,
        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-hairline)'}`,
      }}
    >
      {label}
    </button>
  )
}
