import 'server-only'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'idToken'
const SESSION_MAX_AGE = 60 * 60 * 24 * 14 // 14日

export async function getIDToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAME)?.value
}

export async function setIDTokenCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearIDTokenCookie() {
  (await cookies()).delete(COOKIE_NAME)
}
