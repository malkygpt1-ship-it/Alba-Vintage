'use client'

import { useEffect, useMemo, useState } from 'react'

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
const today = () => new Date().toISOString().slice(0, 10)

export default function Home() {
  const [tab, setTab] = useState('Overview')
  const [sourceTab, setSourceTab] = useState('All')
  const [products, setProducts] = useState<any[]>([])
  const [balances, setBalances] = useState<any[]>([])
  const [showAddStock, setShowAddStock] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ source_type: 'Fleek', order_number: '', description: '', contents: '', units: '1', total_cost: '', unit_cost: '', listed_price: '', projected_profit_ebay: '', projected_profit_depop: '', projected_profit_shopify: '', stock_entered_at: today(), listing_date: '' })
  const nav = ['Overview', 'Inventory', 'Orders', 'Sourcing', 'Bookkeeping', 'Automation', 'Settings']

  async function loadInventory() {
    try { const r = await fetch('/api/inventory', { cache: 'no-store' }); if (!r.ok) return; const d = await r.json(); setProducts(d.products || []); setBalances(d.balances || []) } catch {}
  }
  useEffect(() => { loadInventory() }, [])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) }, [tab, sourceTab])

  const visibleSuppliers = useMemo(() => suppliers.filter(s => sourceTab === 'All' || s.tag.toLowerCase().includes(sourceTab.toLowerCase().replace('branded men’s', 'branded')) || s.categories.toLowerCase().includes(sourceTab.toLowerCase().replace('branded men’s', 'branded'))), [sourceTab])
  const setField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))
  const closeModal = () => { if (!saving) { setShowAddStock(false); setError('') } }

  async function addStock(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const lines = form.contents.split(/\n|,/).map(x => x.trim()).filter(Boolean).map(x => { const m = x.match(/^(\d+)\s*[x×-]?\s*(.*)$/i); return { quantity: m ? Number(m[1]) : 1, grade: m ? m[2] : x } })
    const units = Number(form.units) || lines.reduce((n, x) => n + x.quantity, 0) || 1
    try {
      const r = await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add_stock', source_type: form.source_type, order_number: form.order_number, description: form.description, contents: lines.length ? lines : [{ quantity: units, grade: 'Unspecified' }], total_cost: Number(form.total_cost), unit_cost: Number(form.unit_cost), listed_price: Number(form.listed_price), projected_profit_ebay: Number(form.projected_profit_ebay), projected_profit_depop: Number(form.projected_profit_depop), projected_profit_shopify: Number(form.projected_profit_shopify), stock_entered_at: new Date(form.stock_entered_at).toISOString(), listing_date: form.listing_date ? new Date(form.listing_date).toISOString() : null }) })
      const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Could not add stock')
      setShowAddStock(false); setSaved(true); setForm({ source_type: 'Fleek', order_number: '', description: '', contents: '', units: '1', total_cost: '', unit_cost: '', listed_price: '', projected_profit_ebay: '', projected_profit_depop: '', projected_profit_shopify: '', stock_entered_at: today(), listing_date: '' }); await loadInventory()
    } catch (err: any) { setError(err.message || 'Could not add stock') } finally { setSaving(false) }
  }

  return <div className="shell">
    <aside className="sidebar"><div className="brand">ALBA VINTAGE</div><div className="sub">commerce control centre</div><nav className="nav">{nav.map(n => <button key={n} className={tab === n ? 'active' : ''} onClick={() => setTab(n)}>{n}</button>)}</nav><div className="note" style={{marginTop:30}}>Database: <strong>Supabase</strong><br/>Automation: <strong>n8n</strong></div></aside>
    <main className="main">
      <div className="top"><div><div className="eyebrow">Alba Vintage</div><div className="title">{tab}</div><div className="muted">One inventory. Multiple channels. Your data.</div></div><div className="status"><span className="dot"/> System healthy</div></div>

      {tab === 'Overview' && <div className="grid">
        <div className="card"><div className="label">Available stock</div><div className="metric">{balances.reduce((n, x) => n + Number(x.available_quantity || 0), 0)}</div></div>
        <div className="card"><div className="label">Stock lines</div><div className="metric">{products.length}</div></div>
        <div className="card"><div className="label">Fleek / Shop orders</div><div className="metric">Live</div></div>
        <div className="card"><div className="label">Inventory model</div><div className="metric">Movement</div></div>
        <div className="section wide"><div className="card"><h2>Stock control</h2><p className="muted">Demo inventory has been removed. Stock now enters through the purchase workflow and creates the product, purchase and inventory movement records together.</p><button className="btn" onClick={() => { setTab('Inventory'); setShowAddStock(true) }}>+ Add stock</button></div></div>
      </div>}

      {tab === 'Inventory' && <div className="inventory-page">
        <div className="inventory-actions"><div><h2>Master inventory</h2><p className="muted">Real stock only. Every intake creates a purchase and an inventory movement.</p></div><button className="btn" onClick={() => setShowAddStock(true)}>+ Add stock</button></div>
        {saved && <div className="note success-note">Stock added successfully.</div>}
        <div className="card"><table className="table"><thead><tr><th>SKU</th><th>Description</th><th>Cost</th><th>Listed</th><th>Entered</th><th>Listed date</th><th>Sale date</th></tr></thead><tbody>{products.length ? products.map(p => <tr key={p.id}><td className="sku">{p.sku}</td><td>{p.title}<div className="label">{p.stock_description}</div></td><td>£{Number(p.purchase_cost || 0).toFixed(2)}</td><td>£{Number(p.listed_price || 0).toFixed(2)}</td><td>{p.stock_entered_at ? new Date(p.stock_entered_at).toLocaleDateString('en-GB') : '—'}</td><td>{p.listing_date ? new Date(p.listing_date).toLocaleDateString('en-GB') : '—'}</td><td>{p.sale_date ? new Date(p.sale_date).toLocaleDateString('en-GB') : '—'}</td></tr>) : <tr><td colSpan={7}><div className="empty">No stock entered yet. Use <strong>+ Add stock</strong> to record your first Fleek or Shop order.</div></td></tr>}</tbody></table></div>
      </div>}

      {tab === 'Orders' && <div className="card"><h2>Orders</h2><p className="muted">Incoming Shopify/eBay/Depop orders will appear here. Completed sales will update the stock record's sale date.</p></div>}
      {tab === 'Sourcing' && <div className="sourcing"><div className="sourcing-head card"><div><div className="label">FLEEK SUPPLIER INTELLIGENCE</div><h2>Wholesale sourcing desk</h2><p className="muted">Research-backed shortlist from Fleek supplier data. Use the category tabs to narrow the field, then open the supplier directly.</p></div><div className="sourcing-stats"><div><strong>{suppliers.length}</strong><span>suppliers</span></div><div><strong>{suppliers.filter(s=>s.confidence==='High' || s.confidence==='Very high').length}</strong><span>strong candidates</span></div><div><strong>PK</strong><span>source market</span></div></div></div><div className="source-tabs">{sourcingTabs.map(t=><button key={t} className={sourceTab===t?'active':''} onClick={()=>setSourceTab(t)}>{t}</button>)}</div><div className="supplier-grid">{visibleSuppliers.map(s=><article className="supplier card" key={s.name}><div className="supplier-image-wrap"><img className="supplier-image" src={s.image} alt={`${s.name} logo`} loading="lazy" /></div><div className="supplier-top"><span className="supplier-tag">{s.tag}</span><span className={`confidence ${s.confidence.toLowerCase().replace(' ','-')}`}>{s.confidence}</span></div><h3>{s.name}</h3><p className="supplier-cat">{s.categories}</p><div className="supplier-metrics"><div><strong>{s.rating}★</strong><span>rating</span></div><div><strong>{s.repeat}+</strong><span>repeat buyers</span></div><div><strong>{s.dispatch}</strong><span>dispatch</span></div></div><a className="supplier-link" href={s.url} target="_blank" rel="noreferrer">Open supplier ↗</a></article>)}</div><div className="note sourcing-note"><strong>Buying rule:</strong> ratings and repeat buyers are signals, not guarantees. Start with small test bundles, record landed cost and sell-through, then scale the suppliers that produce repeatable winners.</div></div>}
      {tab === 'Bookkeeping' && <div className="card"><h2>Bookkeeping</h2><p className="muted">Completed sales will become the source of truth for revenue, fees, postage, cost, profit and sale dates.</p></div>}
      {tab === 'Automation' && <div className="card"><h2>n8n automation</h2><p className="muted">Sale → idempotency check → mark SKU sold → delist other channels → retry failures → reconcile.</p></div>}
      {tab === 'Settings' && <div className="settings"><div className="card wide"><h2>Integration settings</h2><div className="note">Credentials should never be stored in browser code. Production flow: UI → authenticated server endpoint → secret store / n8n credentials.</div></div>{['n8n base URL','Shopify store','eBay account','Depop account','Google Sheets spreadsheet ID'].map((x,i)=><div className="card field" key={x}><label>{x}</label><input type={i===0?'url':'text'} placeholder={i===0?'https://n8n.example.com':'Not configured'} /></div>)}</div>}
    </main>

    {showAddStock && <div className="modal-backdrop" onMouseDown={closeModal}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">Inventory intake</div><h2>Add stock</h2><p className="muted">Record the order once. Alba creates the purchase, product and stock movement together.</p></div><button className="modal-close" onClick={closeModal}>×</button></div>
      <form onSubmit={addStock} className="stock-form">
        <div className="form-grid"><div className="field"><label>Source</label><select value={form.source_type} onChange={e=>setField('source_type',e.target.value)}><option>Fleek</option><option>Shop</option></select></div><div className="field"><label>Fleek / Shop order number</label><input required value={form.order_number} onChange={e=>setField('order_number',e.target.value)} placeholder="e.g. FLK-12345" /></div></div>
        <div className="field"><label>Description</label><input required value={form.description} onChange={e=>setField('description',e.target.value)} placeholder="e.g. Grade A branded tee bundle" /></div>
        <div className="field"><label>Contents with grades</label><textarea required rows={4} value={form.contents} onChange={e=>setField('contents',e.target.value)} placeholder={'Example:\n10 x Grade A tees\n5 x Grade B tees\n3 x Grade C tees'} /><span className="form-help">One line per grade/item. Quantity is read from the number at the start of each line.</span></div>
        <div className="form-grid three"><div className="field"><label>Total units</label><input type="number" min="1" value={form.units} onChange={e=>setField('units',e.target.value)} /></div><div className="field"><label>Total price (£)</label><input required type="number" step="0.01" min="0" value={form.total_cost} onChange={e=>setField('total_cost',e.target.value)} /></div><div className="field"><label>Per unit price (£)</label><input required type="number" step="0.01" min="0" value={form.unit_cost} onChange={e=>setField('unit_cost',e.target.value)} /></div></div>
        <div className="form-grid"><div className="field"><label>Listed price (£)</label><input required type="number" step="0.01" min="0" value={form.listed_price} onChange={e=>setField('listed_price',e.target.value)} /></div><div className="field"><label>Date entering stock</label><input required type="date" value={form.stock_entered_at} onChange={e=>setField('stock_entered_at',e.target.value)} /></div></div>
        <div className="profit-box"><div className="profit-title">Projected profit by channel</div><div className="form-grid three"><div className="field"><label>eBay (£)</label><input type="number" step="0.01" value={form.projected_profit_ebay} onChange={e=>setField('projected_profit_ebay',e.target.value)} placeholder="0.00" /></div><div className="field"><label>Depop (£)</label><input type="number" step="0.01" value={form.projected_profit_depop} onChange={e=>setField('projected_profit_depop',e.target.value)} placeholder="0.00" /></div><div className="field"><label>Shopify (£)</label><input type="number" step="0.01" value={form.projected_profit_shopify} onChange={e=>setField('projected_profit_shopify',e.target.value)} placeholder="0.00" /></div></div></div>
        <div className="form-grid"><div className="field"><label>Listing date</label><input type="date" value={form.listing_date} onChange={e=>setField('listing_date',e.target.value)} /></div><div className="field"><label>Sale date</label><input disabled placeholder="Updated by Sales / Bookkeeping" /></div></div>
        {error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="btn secondary" onClick={closeModal}>Cancel</button><button type="submit" className="btn" disabled={saving}>{saving ? 'Adding stock…' : 'Add stock'}</button></div>
      </form>
    </div></div>}
  </div>
}
