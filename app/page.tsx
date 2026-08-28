'use client'

import { useState } from 'react'

const products = [
  { sku: 'ALBA-0001', name: 'Vintage Nike Windbreaker', price: '£64.99', cost: '£18.00', channels: '3/3', status: 'Live' },
  { sku: 'ALBA-0002', name: 'Levi’s 501 Stonewash', price: '£49.99', cost: '£14.00', channels: '3/3', status: 'Live' },
  { sku: 'ALBA-0003', name: 'Adidas Equipment Hoodie', price: '£54.99', cost: '£16.00', channels: '2/3', status: 'Live' },
]

export default function Home() {
  const [tab, setTab] = useState('Overview')
  const [saved, setSaved] = useState(false)
  const nav = ['Overview', 'Inventory', 'Orders', 'Bookkeeping', 'Automation', 'Settings']

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">ALBA VINTAGE</div><div className="sub">commerce control centre</div>
      <nav className="nav">{nav.map(n => <button key={n} className={tab === n ? 'active' : ''} onClick={() => setTab(n)}>{n}</button>)}</nav>
      <div className="note" style={{marginTop:30}}>Database: <strong>master</strong><br/>Automation: <strong>n8n</strong></div>
    </aside>
    <main className="main">
      <div className="top"><div><div className="eyebrow">Alba Vintage</div><div className="title">{tab}</div><div className="muted">One inventory. Multiple channels. Your data.</div></div><div className="status"><span className="dot"/> System healthy</div></div>
      {tab === 'Overview' && <>
        <div className="grid">
          <div className="card"><div className="label">Active stock</div><div className="metric">42</div></div>
          <div className="card"><div className="label">Stock cost</div><div className="metric">£713</div></div>
          <div className="card"><div className="label">30d revenue</div><div className="metric">£1,846</div></div>
          <div className="card"><div className="label">30d profit</div><div className="metric">£923</div></div>
        </div>
        <div className="section"><h2>Channels</h2><div className="channels">
          {['Shopify','eBay','Depop'].map(c => <div className="card channel" key={c}><div><strong>{c}</strong><div className="label">API connection</div></div><span className="pill">Connected</span></div>)}
        </div></div>
        <div className="section"><h2>Recent inventory</h2><div className="card"><table className="table"><thead><tr><th>SKU</th><th>Item</th><th>Price</th><th>Channels</th><th>Status</th></tr></thead><tbody>{products.map(p => <tr key={p.sku}><td className="sku">{p.sku}</td><td>{p.name}</td><td>{p.price}</td><td>{p.channels}</td><td><span className="pill">{p.status}</span></td></tr>)}</tbody></table></div></div>
      </>}
      {tab === 'Inventory' && <div className="card"><h2>Master inventory</h2><p className="muted">This view will read from PostgreSQL. Each one-of-one item has a unique SKU and channel listing IDs.</p><table className="table"><thead><tr><th>SKU</th><th>Item</th><th>Cost</th><th>Price</th><th>Status</th></tr></thead><tbody>{products.map(p=><tr key={p.sku}><td className="sku">{p.sku}</td><td>{p.name}</td><td>{p.cost}</td><td>{p.price}</td><td>{p.status}</td></tr>)}</tbody></table></div>}
      {tab === 'Orders' && <div className="card"><h2>Orders</h2><p className="muted">Incoming Shopify/eBay/Depop webhooks will appear here once credentials and webhooks are configured.</p></div>}
      {tab === 'Bookkeeping' && <div className="card"><h2>Bookkeeping</h2><p className="muted">n8n will append completed sales to Google Sheets with revenue, fees, postage, cost and profit.</p></div>}
      {tab === 'Automation' && <div className="card"><h2>n8n automation</h2><p className="muted">Sale → idempotency check → mark SKU sold → delist other channels → retry failures → reconcile. Import the templates from <span className="sku">n8n/</span>.</p></div>}
      {tab === 'Settings' && <div className="settings">
        <div className="card wide"><h2>Integration settings</h2><div className="note">Credentials should never be stored in browser code. The intended production flow is UI → authenticated server endpoint → secret store / n8n credentials. This starter deliberately leaves credentials blank.</div></div>
        {['n8n base URL','Shopify store','eBay account','Depop account','Google Sheets spreadsheet ID'].map((x,i)=><div className="card field" key={x}><label>{x}</label><input type={i===0?'url':'text'} placeholder={i===0?'https://n8n.example.com': 'Not configured'} /></div>)}
        <div className="wide"><button className="btn" onClick={()=>setSaved(true)}>{saved?'Settings staged':'Save settings'}</button></div>
      </div>}
    </main>
  </div>
}