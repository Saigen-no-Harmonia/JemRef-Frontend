import { PENDING_AUTH_KEY } from "../constants";

const PENDING_AUTH_EVENT = 'jemref:pending-auth-change'

export function setPendingAuth() {
  sessionStorage.setItem(PENDING_AUTH_KEY, '1')
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

export function getPendingAuthSnapshot() {
  return sessionStorage.getItem(PENDING_AUTH_KEY) === '1'
}

export function getPendingAuthServerSnapshot() {
  return false
}
