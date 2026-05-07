import 'server-only'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'idToken'
const ONE_HOUR = 60 * 60

export async function getIDToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAME)?.value
}

export async function setIDTokenCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_HOUR,
  })
}

export async function clearIDTokenCookie() {
  (await cookies()).delete(COOKIE_NAME)
}
