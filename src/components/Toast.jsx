// Binance Light 테마 토스트 알림 컴포넌트
import { useEffect, useState } from 'react'

export function Toast({ message, type = 'error', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); onClose?.() }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const borderColor = type === 'error' ? 'var(--color-trading-down)' : 'var(--color-trading-up)'
  const iconColor   = type === 'error' ? 'var(--color-trading-down)' : 'var(--color-trading-up)'

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded text-sm shadow-lg"
      style={{
        background: 'var(--color-canvas)',
        border: `1px solid ${borderColor}`,
        color: 'var(--color-body)',
        minWidth: 240,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      <span style={{ color: iconColor, fontSize: 16 }}>
        {type === 'error' ? '✕' : '✓'}
      </span>
      {message}
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'error') =>
    setToast({ message, type, key: Date.now() })

  const ToastRenderer = () =>
    toast ? (
      <Toast key={toast.key} message={toast.message} type={toast.type}
        onClose={() => setToast(null)} />
    ) : null

  return { showToast, ToastRenderer }
}
