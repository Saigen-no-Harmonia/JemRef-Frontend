'use client'
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth"
import { firebaseAuth } from '@/lib/firebase/client'
import { PENDING_AUTH_KEY } from "../constants"

type Props = {
  className?: string
  children?: React.ReactNode
}

export function GoogleLoginButton({ className, children = 'Googleでログイン' }: Props) {
  const handleClick = async() => {
    try {
      sessionStorage.setItem(PENDING_AUTH_KEY, '1')
      await signInWithRedirect(firebaseAuth, new GoogleAuthProvider())
      console.log('[Login] this line should never print')
    } catch (error) {
      sessionStorage.removeItem(PENDING_AUTH_KEY)
      console.error('Googleログイン失敗', error)
      alert('ログインに失敗しました')
    }
  }

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  )
}
