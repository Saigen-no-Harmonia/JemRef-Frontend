'use client'
import { firebaseAuth } from "@/lib/firebase/client"

export async function syncSession(IDToken: string): Promise<boolean> {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ IDToken }),
  })
  return response.ok
}

export async function clearSession(): Promise<boolean> {
  const response = await fetch('/api/session', {
    method: 'DELETE'
  })
  return response.ok
}

export async function refreshSession(): Promise<boolean> {
  const user = firebaseAuth.currentUser
  if (!user) return false
  try {
    const IDToken = await user.getIdToken(true)
    return await syncSession(IDToken)
  } catch {
    return false
  }
}
