'use server'
import { setIDTokenCookie, clearIDTokenCookie } from '@/lib/auth/session'
import { registerAPI, loginAPI, withdrawAPI } from '@/lib/api/auth'

export type RegisterFailure = { ok: false, reason: 'registration_failed' }
export type LoginFailure = { ok: false, reason: 'login_failed' }
export type WithdrawFailure = { ok: false, reason: 'withdraw_failed' }

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

export async function withdrawAction(): Promise<{ ok: true } | WithdrawFailure> {
  try {
    await withdrawAPI()
  } catch (error) {
    console.error('withdrawAction error', error)
    return { ok: false, reason: 'withdraw_failed' }
  }
  await clearIDTokenCookie()
  return { ok: true }
}
