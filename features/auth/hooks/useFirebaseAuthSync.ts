'use client'
import { useEffect } from 'react'
import { onIdTokenChanged } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { clearSession, syncSession } from '../services/sessionSync'

export function useFirebaseAuthSync() {
  useEffect(() => {
    return onIdTokenChanged(firebaseAuth, async (user) => {
      if (user) {
        const IDToken = await user.getIdToken()
        await syncSession(IDToken)
      } else {
        await clearSession()
      }
    })
  }, [])
}
