'use client'
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth"
import { firebaseAuth } from '@/lib/firebase/client'
import { setPendingAuth, clearPendingAuth } from "../services/pendingAuth"
import { useToast } from '@/components/ui/Toast'

type Props = {
  className?: string
  children?: React.ReactNode
}

export function GoogleLoginButton({ className, children = 'Googleでログイン' }: Props) {
  const toast = useToast()
  const handleClick = async() => {
    try {
      setPendingAuth()
      await signInWithRedirect(firebaseAuth, new GoogleAuthProvider())
      console.log('[Login] this line should never print')
    } catch (error) {
      clearPendingAuth()
      console.error('Googleログイン失敗', error)
      toast.error('ログインに失敗しました')
    }
  }

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  )
}
