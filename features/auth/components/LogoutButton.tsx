'use client'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { logoutAction } from '@/features/auth/actions'

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()

  const handleClick = async() => {
    try {
      await logoutAction()
    } finally {
      try {
        await signOut(firebaseAuth)
      } catch {}
      router.push('/')
    }
  }

  return (
    <button onClick={handleClick} className={className} type="button"> 
      ログアウト
    </button>
  )
}
