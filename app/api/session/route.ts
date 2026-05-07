import { NextRequest, NextResponse } from 'next/server'
import { setIDTokenCookie, clearIDTokenCookie } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const { idToken } = await request.json()
  if (typeof idToken !== 'string' || !idToken) {
    return NextResponse.json({ error: 'IDToken required' }, { status: 400 })
  }
  await setIDTokenCookie(idToken)
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearIDTokenCookie()
  return NextResponse.json({ ok: true })
}
