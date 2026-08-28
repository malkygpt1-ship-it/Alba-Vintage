import { NextRequest, NextResponse } from 'next/server'

const USERNAME = process.env.ALBA_AUTH_USER || 'Malky'
const PASSWORD = process.env.ALBA_AUTH_PASSWORD || 'js845209b'
const COOKIE_NAME = 'alba_session'

async function sessionToken() {
  const data = new TextEncoder().encode(`${USERNAME}:${PASSWORD}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, from } = await request.json()

    if (username !== USERNAME || password !== PASSWORD) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true, redirect: from || '/' })
    response.cookies.set({
      name: COOKIE_NAME,
      value: await sessionToken(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set({ name: COOKIE_NAME, value: '', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
