'use client'
import { useEffect, useRef } from 'react'
import { getRedirectResult, getAdditionalUserInfo } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { loginAction, registerAction } from '@/features/auth/actions'

export function RedirectResultHandler() {
  const handled = useRef(false)

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
          return
        }

        IDToken = await result.user.getIdToken()
        isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false
        console.log('[Redirect] isNewUser:', isNewUser)
      } catch (error) {
        console.error('リダイレクトエラー', error)
        alert('ログインに失敗しました')
        return
      }

      if (isNewUser) {
        const result = await registerAction(IDToken)
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

  return null
}
