'use server'
import { redirect } from 'next/navigation'
import { setIDTokenCookie, clearIDTokenCookie } from '@/lib/auth/session'
import { registerAPI } from '@/lib/api/auth'

export type RegisterFailure = { ok: false, reason: 'registration_failed' }

export async function loginAction(IDToken: string) {
  await setIDTokenCookie(IDToken)
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
