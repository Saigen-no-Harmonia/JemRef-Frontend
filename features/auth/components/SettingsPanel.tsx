'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { logoutAction } from '@/features/auth/actions'
import { useAuthUser } from '../hooks/useAuthUser'
import { useWithdrawAccount } from '../hooks/useWithdrawAccount'
import { DeleteAccountDialog } from './DeleteAccountDialog'

export function SettingsPanel() {
  const router = useRouter()
  const authState = useAuthUser()
  const withdrawAccount = useWithdrawAccount()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    if (authState.status !== 'error') return
    void (async () => {
      try { await logoutAction() } finally {
        try { await signOut(firebaseAuth) } catch {}
        router.push('/')
      }
    })()
  }, [authState.status, router])

  if (authState.status !== 'ready') {
    return <SettingsPanelSkeleton />
  }

  const { user } = authState

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
        <div className="flex items-center gap-4 px-6 py-5">
          {user.photoURL && !imageFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt=""
              width={48}
              height={48}
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="h-12 w-12 flex-shrink-0 rounded-full"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-slate-900">
              {user.displayName ?? 'ユーザー'}
            </p>
            {user.email && (
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-slate-900">退会</p>
            <p className="mt-0.5 text-xs text-slate-500">アカウントを削除し、登録した書誌情報も削除されます</p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            aria-haspopup="dialog"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-600 cursor-pointer"
          >
            退会する
          </button>
        </div>
      </div>
      
      {deleteDialogOpen && (
        <DeleteAccountDialog
        onClose={() => setDeleteDialogOpen(false)}
        email={user.email}
        onConfirm={withdrawAccount}
      />
      )}
    </>
  )
}

function SettingsPanelSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100"
    >
      <div className="flex items-center gap-4 px-6 py-5">
        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-slate-200 skeleton-pulse" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-32 rounded-md bg-slate-200 skeleton-pulse" />
          <div className="h-3 w-48 rounded-md bg-slate-200 skeleton-pulse" />
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="h-4 w-32 rounded-md bg-slate-200 skeleton-pulse" />
        <div className="h-9 w-24 rounded-lg bg-slate-200 skeleton-pulse" />
      </div>
      <span className="sr-only">読み込み中</span>
    </div>
  )
}
