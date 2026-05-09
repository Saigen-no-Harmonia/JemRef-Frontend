'use client'
import { useEffect, useState } from 'react'
import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'

export type AuthState =
  | { status: 'loading' }
  | { status: 'ready'; user: FirebaseUser }
  | { status: 'error' }

export function useAuthUser(): AuthState {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const user = firebaseAuth.currentUser
    return user ? { status: 'ready', user } : { status: 'loading' }
  })

  useEffect(() => {
    return onIdTokenChanged(firebaseAuth, (user) => {
      setAuthState(user ? { status: 'ready', user } : { status: 'error' })
    })
  }, [])

  return authState
}
