'use server'
import { redirect } from 'next/navigation'
import { setIDTokenCookie, clearIDTokenCookie } from '@/lib/auth/session'
import { registerAPI, loginAPI } from '@/lib/api/auth'

export type RegisterFailure = { ok: false, reason: 'registration_failed' }
export type LoginFailure = { ok: false, reason: 'login_failed' }

export async function loginAction(IDToken: string): Promise<LoginFailure> {
  await setIDTokenCookie(IDToken)
  try {
    await loginAPI()
  } catch (error) {
    await clearIDTokenCookie()
    return { ok: false, reason: 'login_failed' }
  }
  redirect('/records')
}

export async function registerAction(IDToken: string): Promise<RegisterFailure> {
  await setIDTokenCookie(IDToken)
  try {
    await registerAPI()
  } catch (error) {
    await clearIDTokenCookie()
    return { ok: false, reason: 'registration_failed' }
  }
  redirect('/records')
}

export async function logoutAction() {
  await clearIDTokenCookie()
}
