'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  getRedirectResult,
  getAdditionalUserInfo,
  onIdTokenChanged,
  deleteUser,
  signOut,
} from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { loginAction, logoutAction, registerAction, withdrawAction } from '@/features/auth/actions'
import {
  PendingAuthKind,
  clearPendingAuth,
  getPendingAuthSnapshot,
} from '../services/pendingAuth'
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
  const router = useRouter()
  const pathname = usePathname()
  const toast = useToast()
  const [processingKind, setProcessingKind] = useState<PendingAuthKind | null>(null)
  const initialPathnameRef = useRef<string | null>(null)

  const finishProcessing = useCallback(() => {
    clearPendingAuth()
  }, [])

  // ナビゲーション完了（pathname 変化）を検知してオーバーレイをクリア
  useEffect(() => {
    if (initialPathnameRef.current === null) {
      initialPathnameRef.current = pathname
      return
    }
    setProcessingKind(null)
  }, [pathname])

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const run = async () => {
      const intent = getPendingAuthSnapshot()

      // intent があるなら、getRedirectResult を待つ前にオーバーレイを出す
      if (intent) {
        flushSync(() => setProcessingKind(intent))
      }

      let redirectResult
      try {
        redirectResult = await getRedirectResult(firebaseAuth)
      } catch (error) {
        finishProcessing()
        setProcessingKind(null)
        console.error('リダイレクトエラー', error)
        toast.error(
          intent === PendingAuthKind.Withdraw
            ? '退会に失敗しました'
            : 'ログインに失敗しました'
        )
        return
      }

      if (!redirectResult) {
        finishProcessing()
        setProcessingKind(null)
        return
      }

      // intent が null でリダイレクト結果だけある場合のフォールバック
      if (!intent) {
        flushSync(() => setProcessingKind(PendingAuthKind.Login))
      }

      // navigated になったら、オーバーレイのクリアは pathname 変化検知に任せる
      let navigated = false
      try {
        if (intent === PendingAuthKind.Withdraw) {
          const result = await withdrawAction()
          if (!result.ok) {
            finishProcessing()
            console.error('withdrawAction failed')
            toast.error('退会に失敗しました。もう一度お試しください')
            return
          }
          try {
            await deleteUser(redirectResult.user)
          } catch (error) {
            finishProcessing()
            await logoutAction()
            await signOut(firebaseAuth).catch(() => {})
            console.error('deleteUser failed', error)
            navigated = true
            router.push('/')
            toast.error('退会に失敗しました。サポートまでご連絡ください')
            return
          }
          finishProcessing()
          navigated = true
          router.push('/')
          toast.success('退会が完了しました')
          return
        }

        const IDToken = await redirectResult.user.getIdToken()
        const isNewUser = getAdditionalUserInfo(redirectResult)?.isNewUser ?? false

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
        navigated = true
        router.push('/records')
        toast.success(isNewUser ? 'アカウントを登録しました' : 'ログインしました')
      } finally {
        if (!navigated) {
          setProcessingKind(null)
        }
      }
    }
    run()
  }, [finishProcessing, router, toast])

  if (!processingKind) return null

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
        <p className="mt-3 text-sm text-slate-500">
          {processingKind === PendingAuthKind.Withdraw ? '退会処理中...' : 'ログイン処理中...'}
        </p>
        <span className="sr-only">読み込み中</span>
      </div>
    </div>
  )
}
