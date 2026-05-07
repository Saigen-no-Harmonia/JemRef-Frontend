import 'server-only'
import { getIDToken } from '@/lib/auth/session'

export async function fetchAPI(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getIDToken()
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  
  return fetch(`${process.env.API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  })
}
