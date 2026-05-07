'use client'
import { useFirebaseAuthSync } from "@/features/auth/hooks/useFirebaseAuthSync"

export function FirebaseAuthSync() {
  useFirebaseAuthSync()
  return null
}
