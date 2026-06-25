// 컨트롤 패널에서 공통으로 사용하는 UI 원자 컴포넌트들

export function Section({ title, children }) {
  return (
    <div className="border-b border-white/10 pb-4 mb-4 last:border-0 last:mb-0">
      {title && (
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

export function Row({ label, children }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs text-white/50 w-16 shrink-0 text-right">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export function SliderRow({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs text-white/70 tabular-nums">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

export function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs text-white/50 w-16 shrink-0 text-right">{label}</span>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="color"
          value={value.slice(0, 7)} // #rrggbb만 color input에 전달
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-white/10 rounded-lg px-2 py-1 text-xs text-white/80 font-mono border border-white/10 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-white/50">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-white/20'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
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
      className={`bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white border border-white/10 focus:outline-none focus:border-indigo-500 ${className}`}
    />
  )
}
