'use client'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { firebaseAuth } from '@/lib/firebase/client'
import { refreshSession } from '@/features/auth/services/sessionSync'
import NProgress from 'nprogress'
import { SESSION_EXPIRED } from '@/lib/api/errors'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    if (error.message !== SESSION_EXPIRED) return

    NProgress.start()

    let cancelled = false
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (cancelled) return
      unsubscribe()

      if (!user) {
        router.replace('/')
        return
      }

      const ok = await refreshSession()
      if (cancelled) return
      if (ok) {
        reset()
      } else {
        router.replace('/')
      }
    })

    return () => {
      cancelled = true
      unsubscribe()
      NProgress.done
    }
  }, [error, reset, router])

  return null
}
