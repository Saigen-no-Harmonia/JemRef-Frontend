'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getRedirectResult, getAdditionalUserInfo } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { loginAction, registerAction } from '@/features/auth/actions'
import { PENDING_AUTH_KEY } from '../constants'
import { usePathname } from 'next/navigation'

export function RedirectResultHandler() {
  const handled = useRef(false)
  const pathname = usePathname()
  const [isProcessing, setIsProcessing] = useState(false)

  const finishProcessing = useCallback(() => {
    sessionStorage.removeItem(PENDING_AUTH_KEY)
    setIsProcessing(false)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem(PENDING_AUTH_KEY) === '1') {
      setIsProcessing(true)
    }
  }, [])

  useEffect(() => {
    if (pathname !== '/') {
      finishProcessing()
    }
  }, [pathname])

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const run = async () => {
      let IDToken: string | null = null
      let isNewUser = false

      try {
        const result = await getRedirectResult(firebaseAuth)
        console.log('[Redirect] result:', result)
        if (!result) {
          console.log('[Redirect] result is null — returning')
          finishProcessing()
          return
        }
        IDToken = await result.user.getIdToken()
        isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false
        console.log('[Redirect] isNewUser:', isNewUser)
      } catch (error) {
        finishProcessing()
        console.error('リダイレクトエラー', error)
        alert('ログインに失敗しました')
        return
      }

      if (isNewUser) {
        const result = await registerAction(IDToken)
        finishProcessing()
        // 成功時はredirectが走るのでここに来ない
        alert('ユーザー登録に失敗しました。もう一度お試しください。')
        console.error('register failed:', result.reason)
        return
      } else {
        await loginAction(IDToken)
      }
    }
    run()
  }, [])

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
