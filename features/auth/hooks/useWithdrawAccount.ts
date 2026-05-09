'use client'
import { useRouter } from 'next/navigation'
import { deleteUser } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { firebaseAuth } from '@/lib/firebase/client'
import { withdrawalAction } from '@/features/auth/actions'

export function useWithdrawAccount() {
  const router = useRouter()

  return async () => {
    const user = firebaseAuth.currentUser
    if (!user) return
    try {
      await deleteUser(user)
      await withdrawalAction()
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/requires-recent-login') {
        // TODO: 再認証
        return
      }
      // TODO: エラー表示
      return
    }
    router.push('/')
  }
}
