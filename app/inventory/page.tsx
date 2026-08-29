'use client'

import { useEffect, useState } from 'react'

type Balance = { product_id: string; sku: string; title: string; available_quantity: number }
type Product = { id: string; sku: string; title: string; purchase_cost: number; target_price: number | null }
type Movement = { id: string; product_id: string; movement_type: string; quantity: number; direction: string; reference: string | null; created_at: string }
type Listing = { id: string; product_id: string; channel_id: string; price: number | null; status: string; channels: { name: string } | null }

type InventoryResponse = { products: Product[]; balances: Balance[]; movements: Movement[]; listings: Listing[]; orders: unknown[]; sales: unknown[] }

export default function InventoryPage() {
  const [data, setData] = useState<InventoryResponse | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const res = await fetch('/api/inventory', { cache: 'no-store' })
    const json = await res.json()
    if (!res.ok) return setError(json.error || 'Unable to load inventory')
    setData(json)
  }

  async function simulateSale(product: Product) {
    setBusy(true)
    setError('')
    const res = await fetch('/api/inventory', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: product.id, quantity: 1, channel_slug: 'shopify', unit_price: product.target_price ?? 0, fee: 0, shipping_cost: 0 })
    })
    const json = await res.json()
    if (!res.ok) setError(json.error || 'Sale simulation failed')
    await load()
    setBusy(false)
  }

  useEffect(() => { load() }, [])

  if (error && !data) return <main className="main"><div className="card"><h1>Inventory database</h1><p className="muted">{error}</p><button className="btn" onClick={load}>Retry</button></div></main>
  if (!data) return <main className="main"><div className="card"><p>Loading inventory…</p></div></main>

  return <main className="main">
    <div className="top"><div><div className="eyebrow">Alba Vintage</div><div className="title">Inventory database</div><div className="muted">Inventory movement-driven stock control</div></div><div className="status"><span className="dot"/> Supabase connected</div></div>
    {error && <div className="note" style={{marginBottom:16}}>{error}</div>}
    <div className="grid">
      <div className="card"><div className="label">SKUs</div><div className="metric">{data.products.length}</div></div>
      <div className="card"><div className="label">Available units</div><div className="metric">{data.balances.reduce((n,b)=>n+b.available_quantity,0)}</div></div>
      <div className="card"><div className="label">Listings</div><div className="metric">{data.listings.filter(l=>l.status==='active').length}</div></div>
      <div className="card"><div className="label">Movements</div><div className="metric">{data.movements.length}</div></div>
    </div>
    <div className="section"><h2>Master stock</h2><div className="card"><table className="table"><thead><tr><th>SKU</th><th>Item</th><th>Available</th><th>Cost</th><th>Target</th><th>Action</th></tr></thead><tbody>{data.products.map(p=>{const b=data.balances.find(x=>x.product_id===p.id);return <tr key={p.id}><td className="sku">{p.sku}</td><td>{p.title}</td><td>{b?.available_quantity ?? 0}</td><td>£{Number(p.purchase_cost).toFixed(2)}</td><td>£{Number(p.target_price ?? 0).toFixed(2)}</td><td><button className="btn" disabled={busy || (b?.available_quantity ?? 0)<1} onClick={()=>simulateSale(p)}>Simulate Shopify sale</button></td></tr>})}</tbody></table></div></div>
    <div className="section"><h2>Inventory movements</h2><div className="card"><table className="table"><thead><tr><th>Time</th><th>SKU</th><th>Movement</th><th>Qty</th><th>Direction</th><th>Reference</th></tr></thead><tbody>{data.movements.map(m=><tr key={m.id}><td>{new Date(m.created_at).toLocaleString('en-GB')}</td><td className="sku">{data.products.find(p=>p.id===m.product_id)?.sku ?? '—'}</td><td>{m.movement_type}</td><td>{m.quantity}</td><td>{m.direction}</td><td>{m.reference ?? '—'}</td></tr>)}</tbody></table></div></div>
    <div className="note" style={{marginTop:16}}><strong>Flow:</strong> purchase movement adds stock → listings expose the SKU across channels → reservation/sale movements reduce available stock → a completed sale marks the listing sold and records financials.</div>
  </main>
}
