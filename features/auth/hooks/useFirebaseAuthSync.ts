'use client'
import { useEffect } from 'react'
import { onIdTokenChanged } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'

export function useFirebaseAuthSync() {
  useEffect(() => {
    return onIdTokenChanged(firebaseAuth, async (user) => {
      if (user) {
        const IDToken = await user.getIdToken()
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: IDToken }),
        })
      } else {
        await fetch('/api/session', { method: 'DELETE' })
      }
    })
  }, [])
}
