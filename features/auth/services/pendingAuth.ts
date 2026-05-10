import { z } from 'zod'
import { PENDING_AUTH_KEY } from "../constants";

const PENDING_AUTH_EVENT = 'jemref:pending-auth-change'

export enum PendingAuthKind {
  Login = 'login',
  Withdraw = 'withdraw',
}
const PendingAuthKindSchema = z.enum(PendingAuthKind)

export function setPendingAuth(kind: PendingAuthKind) {
  sessionStorage.setItem(PENDING_AUTH_KEY, kind)
  window.dispatchEvent(new Event(PENDING_AUTH_EVENT))
}

export function clearPendingAuth() {
  sessionStorage.removeItem(PENDING_AUTH_KEY)
  window.dispatchEvent(new Event(PENDING_AUTH_EVENT))
}

export function subscribePendingAuth(callback: () => void) {
  window.addEventListener(PENDING_AUTH_EVENT, callback)
  return () => window.removeEventListener(PENDING_AUTH_EVENT, callback)
}

export function getPendingAuthSnapshot(): PendingAuthKind | null {
  const pendingValue = sessionStorage.getItem(PENDING_AUTH_KEY)
  if (pendingValue === null) return null
  const result = PendingAuthKindSchema.safeParse(pendingValue)
  return result.success ? result.data : null
}

export function getPendingAuthServerSnapshot(): PendingAuthKind | null {
  return null
}
