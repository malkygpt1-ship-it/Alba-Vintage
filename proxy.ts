import { NextRequest, NextResponse } from 'next/server'

const USERNAME = process.env.ALBA_AUTH_USER || 'Malky'
const PASSWORD = process.env.ALBA_AUTH_PASSWORD || 'js845209b'

export function proxy(request: NextRequest) {
  const authorization = request.headers.get('authorization')

  if (authorization?.startsWith('Basic ')) {
    const encoded = authorization.slice(6)

    try {
      const decoded = atob(encoded)
      const separator = decoded.indexOf(':')
      const username = separator >= 0 ? decoded.slice(0, separator) : ''
      const password = separator >= 0 ? decoded.slice(separator + 1) : ''

      if (username === USERNAME && password === PASSWORD) {
        return NextResponse.next()
      }
    } catch {
      // Fall through to the authentication challenge for malformed credentials.
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Alba Vintage", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  })
}

export const config = {
  matcher: '/:path*',
}
