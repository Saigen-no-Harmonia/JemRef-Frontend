'use server'
import { setIDTokenCookie, clearIDTokenCookie } from '@/lib/auth/session'
import { registerAPI, loginAPI, withdrawalAPI } from '@/lib/api/auth'

export type RegisterFailure = { ok: false, reason: 'registration_failed' }
export type LoginFailure = { ok: false, reason: 'login_failed' }

export async function loginAction(IDToken: string): Promise<{ ok: true } | LoginFailure> {
  await setIDTokenCookie(IDToken)
  try {
    await loginAPI()
  } catch (error) {
    console.error('loginAction error', error)
    await clearIDTokenCookie()
    return { ok: false, reason: 'login_failed' }
  }
  return { ok: true }
}

export async function registerAction(IDToken: string): Promise<{ ok: true } | RegisterFailure> {
  await setIDTokenCookie(IDToken)
  try {
    await registerAPI()
  } catch (error) {
    console.error('registerAction error', error)
    await clearIDTokenCookie()
    return { ok: false, reason: 'registration_failed' }
  }
  return { ok: true }
}

export async function logoutAction() {
  await clearIDTokenCookie()
}

export async function withdrawalAction() {
  try {
    await withdrawalAPI()
  } catch (error) {
    console.error('withdrawalAction error', error)
    return { ok: false, reason: 'withdrawal_failed' }
  }
  await clearIDTokenCookie()
}
