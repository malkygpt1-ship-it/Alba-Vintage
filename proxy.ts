import { NextRequest, NextResponse } from 'next/server'

const USERNAME = process.env.ALBA_AUTH_USER || 'Malky'
const PASSWORD = process.env.ALBA_AUTH_PASSWORD || 'js845209b'
const COOKIE_NAME = 'alba_session'

async function sessionToken() {
  const data = new TextEncoder().encode(`${USERNAME}:${PASSWORD}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the login page and login endpoint through without authentication.
  if (pathname === '/login' || pathname === '/api/login') {
    return NextResponse.next()
  }

  const expectedToken = await sessionToken()
  const suppliedToken = request.cookies.get(COOKIE_NAME)?.value

  if (suppliedToken === expectedToken) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/:path*'],
}
