'use client'

import { useState } from 'react'

const products = [
  { sku: 'ALBA-0001', name: 'Vintage Nike Windbreaker', price: '£64.99', cost: '£18.00', channels: '3/3', status: 'Live' },
  { sku: 'ALBA-0002', name: 'Levi’s 501 Stonewash', price: '£49.99', cost: '£14.00', channels: '3/3', status: 'Live' },
  { sku: 'ALBA-0003', name: 'Adidas Equipment Hoodie', price: '£54.99', cost: '£16.00', channels: '2/3', status: 'Live' },
]

const suppliers = [
  { name: 'Diamond Vintage', image: 'https://cdn.shopify.com/s/files/1/0610/8233/7518/files/WhatsApp_Image_2023-06-01_at_12.16.32_AM.jpg?v=1685615957', categories: 'Button-up shirts · Ralph Lauren · Tommy Hilfiger · Lacoste · Trench coats', rating: '4.5', repeat: 345, dispatch: '6 days', url: 'https://www.joinfleek.com/vendor/diamond-vintage', tag: 'Branded men’s', confidence: 'High' },
  { name: 'Vintage Central', image: 'https://cdn.shopify.com/s/files/1/0610/8233/7518/files/WhatsApp_Image_2023-03-31_at_11.00.03.jpg?v=1680267334', categories: 'Polo shirts · Lululemon', rating: '4.9', repeat: 372, dispatch: '5 days', url: 'https://www.joinfleek.com/vendor/vintage-central', tag: 'Polo / activewear', confidence: 'High' },
  { name: 'Thrift Drip', image: 'https://d345nenm7zy8g2.cloudfront.net/thrift-drip-thrift-drip.jpg', categories: 'Track pants · Nike · Adidas · Umbro', rating: '4.6', repeat: 80, dispatch: '4 days', url: 'https://www.joinfleek.com/vendor/thrift-drip', tag: 'Sportswear', confidence: 'High' },
  { name: 'Retro Fashion', image: 'https://d345nenm7zy8g2.cloudfront.net/retro-fashion-ChatGPT%20Image%20Nov%2012%2C%202025%2C%2006_12_14%20PM.png', categories: 'Puffer jackets · Retro / Y2K fashion', rating: '4.5', repeat: 56, dispatch: '3 days', url: 'https://www.joinfleek.com/vendor/retro-fashion', tag: 'Jackets', confidence: 'Medium' },
  { name: 'Thrift Kings', image: 'https://cdn.shopify.com/s/files/1/0610/8233/7518/files/WhatsApp_Image_2023-07-06_at_2.20.25_PM.jpg?v=1688637133', categories: 'Workwear · Carhartt · Dickies', rating: '4.4', repeat: 201, dispatch: '3 days', url: 'https://www.joinfleek.com/vendor/thrift-kings', tag: 'Workwear', confidence: 'High' },
  { name: 'Asian Trader', image: 'https://cdn.shopify.com/s/files/1/0610/8233/7518/files/WhatsApp_Image_2024-03-14_at_12.29.49.jpg?v=1710401705', categories: 'Hip-hop jeans · Japanese / Y2K denim · Carhartt · Dickies', rating: '4.5', repeat: 14, dispatch: '—', url: 'https://www.joinfleek.com/vendor/asian-trader', tag: 'Baggy denim', confidence: 'Test' },
  { name: 'Trade Vintage', image: 'https://d345nenm7zy8g2.cloudfront.net/trade-vintage-Trade%20Vintage%20Logo.png', categories: 'Denim shorts', rating: '4.6', repeat: 92, dispatch: '7 days', url: 'https://www.joinfleek.com/vendor/trade-vintage', tag: 'Denim shorts', confidence: 'High' },
  { name: 'Legacy Vintage', image: 'https://d345nenm7zy8g2.cloudfront.net/legacy-leagcy.jpg', categories: 'Miniskirts · Y2K denim · Hip-hop / baggy jorts', rating: '4.8', repeat: 63, dispatch: '6 days', url: 'https://www.joinfleek.com/vendor/legacy', tag: 'Y2K denim', confidence: 'High' },
  { name: 'Vintage Master', image: 'https://d345nenm7zy8g2.cloudfront.net/mohsin-fashion-bazar-7rfv5hRniRljm1NfVR22VdDi.jpeg', categories: 'Denim skirts', rating: '5.0', repeat: 77, dispatch: '3 days', url: 'https://www.joinfleek.com/vendor/mohsin-fashion-bazar', tag: 'Denim skirts', confidence: 'High' },
  { name: 'The Ethereal Wardrobe', image: 'https://d345nenm7zy8g2.cloudfront.net/ethereal-WhatsApp%20Image%202024-03-19%20at%2012.40.08.jpeg', categories: 'Cami tops · Nike · Y2K', rating: '4.8', repeat: 222, dispatch: '2 days', url: 'https://www.joinfleek.com/vendor/ethereal', tag: 'Y2K / Nike', confidence: 'High' },
  { name: 'Retro Thrift Store', image: 'https://d345nenm7zy8g2.cloudfront.net/retro-thrift-store-1-WhatsApp%20Image%202026-04-29%20at%2017.54.06.jpeg', categories: 'General Y2K · Coach bags', rating: '4.7', repeat: 478, dispatch: '3 days', url: 'https://www.joinfleek.com/vendor/retro-thrift-store-1', tag: 'Y2K / bags', confidence: 'High' },
  { name: 'MH Vintage', image: 'https://cdn.shopify.com/s/files/1/0610/8233/7518/files/WhatsApp_Image_2023-05-16_at_22.34.37_a9d51126-4cdc-4d0a-9c63-0c157b82b97a.jpg?v=1684258680', categories: 'Single-stitch T-shirts', rating: '4.7', repeat: 273, dispatch: '4 days', url: 'https://www.joinfleek.com/vendor/mh-vintage-2', tag: 'Vintage tees', confidence: 'High' },
  { name: 'Vintage Visions', image: 'https://d345nenm7zy8g2.cloudfront.net/vintage-visions-clotting%20logo-02.jpg', categories: 'Vintage band tees', rating: '4.8', repeat: 173, dispatch: '2 days', url: 'https://www.joinfleek.com/vendor/vintage-visions', tag: 'Band tees', confidence: 'High' },
  { name: 'Vintage Storm', image: 'https://d345nenm7zy8g2.cloudfront.net/vintage-storm-FA.jpeg', categories: 'Ralph Lauren · branded vintage', rating: '4.6', repeat: 514, dispatch: '7 days', url: 'https://www.joinfleek.com/vendor/vintage-storm', tag: 'Ralph Lauren', confidence: 'High' },
  { name: 'Creed Vintage', image: 'https://cdn.shopify.com/s/files/1/0610/8233/7518/files/fleekLogoBlack.png?v=1698234330', categories: 'Miss Me · True Religion · Rock Revival · Y2K denim', rating: '4.8', repeat: 1379, dispatch: '4 days', url: 'https://www.joinfleek.com/vendor/creed-vintage', tag: 'Premium Y2K denim', confidence: 'Very high' },
]

const sourcingTabs = ['All', 'Branded men’s', 'Y2K', 'Denim', 'Tees', 'Workwear', 'Sportswear']

export default function Home() {
  const [tab, setTab] = useState('Overview')
  const [sourceTab, setSourceTab] = useState('All')
  const [saved, setSaved] = useState(false)
  const nav = ['Overview', 'Inventory', 'Orders', 'Sourcing', 'Bookkeeping', 'Automation', 'Settings']
  const visibleSuppliers = suppliers.filter(s => sourceTab === 'All' || s.tag.toLowerCase().includes(sourceTab.toLowerCase().replace('branded men’s', 'branded')) || s.categories.toLowerCase().includes(sourceTab.toLowerCase().replace('branded men’s', 'branded')))

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
      {tab === 'Sourcing' && <div className="sourcing">
        <div className="sourcing-head card">
          <div><div className="label">FLEEK SUPPLIER INTELLIGENCE</div><h2>Wholesale sourcing desk</h2><p className="muted">Research-backed shortlist from Fleek supplier data. Use the category tabs to narrow the field, then open the supplier directly.</p></div>
          <div className="sourcing-stats"><div><strong>{suppliers.length}</strong><span>suppliers</span></div><div><strong>{suppliers.filter(s=>s.confidence==='High' || s.confidence==='Very high').length}</strong><span>strong candidates</span></div><div><strong>PK</strong><span>source market</span></div></div>
        </div>
        <div className="source-tabs">{sourcingTabs.map(t=><button key={t} className={sourceTab===t?'active':''} onClick={()=>setSourceTab(t)}>{t}</button>)}</div>
        <div className="supplier-grid">{visibleSuppliers.map(s=><article className="supplier card" key={s.name} style={{backgroundImage:`linear-gradient(rgba(8,10,9,.58),rgba(8,10,9,.82)),url("${s.image}")`}}>
          <div className="supplier-content">
            <div className="supplier-top"><span className="supplier-tag">{s.tag}</span><span className={`confidence ${s.confidence.toLowerCase().replace(' ','-')}`}>{s.confidence}</span></div>
            <h3>{s.name}</h3>
            <p className="supplier-cat">{s.categories}</p>
            <div className="supplier-metrics"><div><strong>{s.rating}★</strong><span>rating</span></div><div><strong>{s.repeat}+</strong><span>repeat buyers</span></div><div><strong>{s.dispatch}</strong><span>dispatch</span></div></div>
            <a className="supplier-link" href={s.url} target="_blank" rel="noreferrer">Open supplier ↗</a>
          </div>
        </article>)}</div>
        <div className="note sourcing-note"><strong>Buying rule:</strong> ratings and repeat buyers are signals, not guarantees. Start with small test bundles, record landed cost and sell-through, then scale the suppliers that produce repeatable winners. Fleek also states that delivery/customs vary by destination and that buyer protection applies to qualifying problems.</div>
      </div>}
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
