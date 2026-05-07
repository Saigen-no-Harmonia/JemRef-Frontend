import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const IDToken = request.cookies.get('idToken')?.value
  if (!IDToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/records/:path*']
}
