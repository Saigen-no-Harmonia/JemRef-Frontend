'use client'
import { useEffect, useId, useState } from 'react'

type Props = {
  onClose: () => void
  email: string | null
  onConfirm: () => void | Promise<void>
}

export function DeleteAccountDialog({ onClose, email, onConfirm }: Props) {
  const titleId = useId()
  const inputId = useId()
  const [confirmInput, setConfirmInput] = useState('')

  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [])

  if (!open) return null

  const canConfirm = !!email && confirmInput === email

  const handleConfirm = async () => {
    if (!canConfirm) return
    await onConfirm()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
        <h2 id={titleId} className="text-lg font-semibold text-slate-900">
          退会しますか？
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-body">
          この操作は取り消せません。アカウントと、登録したすべての書誌情報が削除されます。
        </p>

        <div className="mt-5">
          <label htmlFor={inputId} className="block text-sm text-body">
            確認のため、登録メールアドレス <span className="font-medium text-slate-900">{email ?? '(取得中)'}</span> を入力してください。
          </label>
          <input
            id={inputId}
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-body transition-colors hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-500"
          >
            退会する
          </button>
        </div>
      </div>
    </div>
  )
}
