// 상단에 잠깐 표시되는 토스트 알림 컴포넌트
import { useEffect, useState } from 'react'

export function Toast({ message, type = 'error', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const bg = type === 'error' ? 'bg-red-500' : 'bg-emerald-500'

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${bg} text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium`}>
      {message}
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'error') => {
    setToast({ message, type, key: Date.now() })
  }

  const ToastRenderer = () =>
    toast ? (
      <Toast
        key={toast.key}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    ) : null

  return { showToast, ToastRenderer }
}
