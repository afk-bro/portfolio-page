'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'success', duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, message, type, duration }

    setToasts((prev) => [...prev, newToast])

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, duration)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  removeToast: (id: string) => void
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const styles = {
    success: 'bg-success-50 dark:bg-green-900/30 border-success-500 dark:border-green-700 text-success-600 dark:text-green-200',
    error: 'bg-error-50 dark:bg-red-900/30 border-error-500 dark:border-red-700 text-error-600 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-700 text-blue-600 dark:text-blue-200',
    warning: 'bg-warning-50 dark:bg-amber-900/30 border-warning-500 dark:border-amber-700 text-warning-600 dark:text-amber-200',
  }

  const iconStyles = {
    success: 'text-success-500 dark:text-green-400',
    error: 'text-error-500 dark:text-red-400',
    info: 'text-blue-500 dark:text-blue-400',
    warning: 'text-warning-500 dark:text-amber-400',
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in-right min-w-[300px] max-w-[400px] ${styles[toast.type]}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconStyles[toast.type]}`} aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
