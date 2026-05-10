'use client'
import { reauthenticateWithRedirect, GoogleAuthProvider } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { setPendingAuth, clearPendingAuth, PendingAuthKind } from '../services/pendingAuth'
import { useToast } from '@/components/ui/Toast'

export function useWithdrawAccount() {
  const toast = useToast()

  return async () => {
    const user = firebaseAuth.currentUser
    if (!user) return
    setPendingAuth(PendingAuthKind.Withdraw)
    try {
      await reauthenticateWithRedirect(user, new GoogleAuthProvider())
    } catch (error) {
      clearPendingAuth()
      console.error('reauthenticateWithRedirect failed', error)
      toast.error('退会に失敗しました。もう一度お試しください')
    }
  }
}
