'use client'

import { FormEvent, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, from: searchParams.get('from') || '/' }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Invalid username or password')
        setPassword('')
        return
      }

      router.replace(data.redirect || '/')
      router.refresh()
    } catch {
      setError('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f5f5f2', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 390, background: '#fff', border: '1px solid #ddd', borderRadius: 14, padding: 32, boxShadow: '0 12px 40px rgba(0,0,0,.08)' }}>
        <div style={{ fontSize: 12, letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>ALBA VINTAGE</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>Sign in</h1>
        <p style={{ margin: '0 0 24px', color: '#666' }}>Commerce control centre</p>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" autoFocus required style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', border: '1px solid #ccc', borderRadius: 8, marginBottom: 16 }} />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', border: '1px solid #ccc', borderRadius: 8, marginBottom: 18 }} />

        {error && <div style={{ color: '#a00', fontSize: 13, marginBottom: 14 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 14px', border: 0, borderRadius: 8, background: '#111', color: '#fff', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
