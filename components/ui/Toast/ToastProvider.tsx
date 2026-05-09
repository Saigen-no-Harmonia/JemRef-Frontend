'use client'
import { createContext, useCallback, useMemo, useState } from 'react'
import type { Toast, ToastApi, ToastType } from './types'

export const ToastContext = createContext<ToastApi | null>(null)

const TOAST_LIMIT = 5
const AUTO_DISMISS_DURATION = 5000
const EXIT_ANIMATION_DURATION = 250

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.map((toast) =>
      toast.id === id ? { ...toast, exiting: true } : toast
    ))
    setTimeout(() => remove(id), EXIT_ANIMATION_DURATION)
  }, [remove])

  const add = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts((current) => {
      const next = [...current, { id, type, message }]
      return next.length > TOAST_LIMIT ? next.slice(-TOAST_LIMIT) : next
    })
    if (type === 'success' || type === 'info') {
      setTimeout(() => dismiss(id), AUTO_DISMISS_DURATION)
    }
  }, [dismiss])

  const api = useMemo<ToastApi>(() => ({
    success: (message) => add('success', message),
    error: (message) => add('error', message),
    warning: (message) => add('warning', message),
    info: (message) => add('info', message),
    dismiss,
  }), [add, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onDismiss }: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null
  return (
    <div
      aria-label="通知"
      className="fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  )
}

const VARIANT_CLASS: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const isAssertive = toast.type === 'error' || toast.type === 'warning'
  return (
    <div
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      className={`${toast.exiting ? 'toast-exit' : 'toast-enter'} flex items-start gap-3 rounded-lg border p-4 shadow-sm ${VARIANT_CLASS[toast.type]}`}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="閉じる"
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-current opacity-60 transition-opacity hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function ToastIcon({ type }: { type: ToastType }) {
  switch (type) {
    case 'success':
      return (
        <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'error':
      return (
        <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'warning':
      return (
        <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    case 'info':
      return (
        <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}
