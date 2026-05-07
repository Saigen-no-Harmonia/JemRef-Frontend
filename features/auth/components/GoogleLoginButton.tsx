'use client'
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth"
import { firebaseAuth } from '@/lib/firebase/client'

type Props = {
  className?: string
  children?: React.ReactNode
}

export function GoogleLoginButton({ className, children = 'Googleでログイン' }: Props) {
  const handleClick = async() => {
    try {
      await signInWithRedirect(firebaseAuth, new GoogleAuthProvider())
      console.log('[Login] this line should never print')
    } catch (error) {
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
