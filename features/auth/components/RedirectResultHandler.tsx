'use client'
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { getRedirectResult, getAdditionalUserInfo, onIdTokenChanged } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { loginAction, registerAction } from '@/features/auth/actions'
import {
  clearPendingAuth,
  getPendingAuthServerSnapshot,
  getPendingAuthSnapshot,
  subscribePendingAuth }
from '../services/pendingAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

function waitForFirebaseUser(timeoutMs = 5000): Promise<void> {
  if (firebaseAuth.currentUser) return Promise.resolve()
  return new Promise((resolve) => {
    let resolved = false
    const finish = () => {
      if (resolved) return
      resolved = true
      clearTimeout(timeout)
      unsubscribe()
      resolve()
    }
    const timeout = setTimeout(finish, timeoutMs)
    const unsubscribe = onIdTokenChanged(firebaseAuth, (user) => {
      if (user) finish()
    })
  })
}

export function RedirectResultHandler() {
  const handled = useRef(false)
  const pathname = usePathname()
  const router = useRouter()
  const toast = useToast()
  const isProcessing = useSyncExternalStore(
    subscribePendingAuth,
    getPendingAuthSnapshot,
    getPendingAuthServerSnapshot,
  )

  const finishProcessing = useCallback(() => {
    clearPendingAuth()
  }, [])

  useEffect(() => {
    if (pathname !== '/') {
      finishProcessing()
    }
  }, [pathname, finishProcessing])

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const run = async () => {
      let IDToken: string | null = null
      let isNewUser = false

      try {
        const result = await getRedirectResult(firebaseAuth)
        if (!result) {
          finishProcessing()
          return
        }
        IDToken = await result.user.getIdToken()
        isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false
      } catch (error) {
        finishProcessing()
        console.error('リダイレクトエラー', error)
        toast.error('ログインに失敗しました')
        return
      }

      if (isNewUser) {
        const result = await registerAction(IDToken)
        if (!result.ok) {
          finishProcessing()
          toast.error('ユーザー登録に失敗しました。もう一度お試しください。')
          console.error('register failed:', result.reason)
          return
        }
      } else {
        const result = await loginAction(IDToken)
        if (!result.ok) {
          finishProcessing()
          toast.error('ログインに失敗しました')
          console.error('login failed:', result.reason)
          return
        }
      }

      await waitForFirebaseUser()
      router.push('/records')
      toast.success(isNewUser ? 'アカウントを登録しました' : 'ログインしました')
    }
    run()
  }, [finishProcessing, router, toast])

  if (!isProcessing) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center">
        <div className="dot-loader" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="mt-3 text-sm text-slate-500">ログイン処理中...</p>
        <span className="sr-only">読み込み中</span>
      </div>
    </div>
  )
}
