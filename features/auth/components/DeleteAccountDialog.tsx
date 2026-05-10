'use client'
import { useEffect, useId, useState } from 'react'
import { flushSync } from 'react-dom'

type Props = {
  onClose: () => void
  email: string | null
  onConfirm: () => void | Promise<void>
}

export function DeleteAccountDialog({ onClose, email, onConfirm }: Props) {
  const titleId = useId()
  const inputId = useId()
  const [confirmInput, setConfirmInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (submitting) return
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, submitting])

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [])

  const canConfirm = !!email && confirmInput === email

  const handleConfirm = async () => {
    if (!canConfirm || submitting) return
    flushSync(() => {
      setSubmitting(true)
    })
    // ペイント完了を待ってから redirect に入る。
    // double rAF: 1つ目で「次フレーム前」、2つ目で「ペイント済み」を保証。
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    )
    try {
      await onConfirm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={submitting ? undefined : onClose}
        aria-hidden="true"
      />

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

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 text-[1rem] font-medium text-body rounded-lg hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || submitting}
            className={`inline-flex items-center justify-center gap-2 h-10 px-4 text-[1rem] font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors ${submitting ? 'opacity-75 cursor-not-allowed' : 'disabled:cursor-not-allowed disabled:opacity-50'}`}
          >
            {submitting && <div aria-hidden="true" className="inline-spinner" />}
            退会する
          </button>
        </div>
      </div>
    </div>
  )
}
