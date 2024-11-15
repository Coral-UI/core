import { cx } from 'cva'
import { useEffect } from 'react'
import { create } from 'zustand'

interface ToastsState {
  toasts: Array<{ id: string; message: string; type: 'error' | 'success' | 'info' }>
  addToast: (message: string, type: 'error' | 'success' | 'info') => void
  removeToast: (id: string) => void
}

export const useToasts = create<ToastsState>((set) => ({
  toasts: [],
  addToast: (message, type) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))

export const Toasts = () => {
  const { toasts, removeToast } = useToasts()

  useEffect(() => {
    toasts.forEach((toast) => {
      setTimeout(() => {
        removeToast(toast.id)
      }, 3000) // Remove after 3 seconds
    })
  }, [toasts, removeToast])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 shadow-lg">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cx(
            `rounded-lg py-3.5 px-6 text-primary-dark font-mono text-sm border border-primary-dark/10`,
            toast.type === 'error' && 'bg-error',
            toast.type === 'success' && 'bg-success',
            toast.type === 'info' && 'bg-info',
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
