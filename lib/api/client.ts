import 'server-only'
import { getIDToken } from '@/lib/auth/session'
import { SessionExpiredError } from './errors'

export async function fetchAPI(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getIDToken()
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  
  const response = await fetch(`${process.env.API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  })

  if (response.status === 403) {
    throw new SessionExpiredError()
  }

  return response
}
