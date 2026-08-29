import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function authorised() {
  const cookie = (await cookies()).get('alba_session')?.value
  const username = process.env.ALBA_AUTH_USER || 'Malky'
  const password = process.env.ALBA_AUTH_PASSWORD
  if (!cookie || !password) return false
  const expected = createHash('sha256').update(`${username}:${password}`).digest('hex')
  return cookie === expected
}

export async function GET() {
  if (!(await authorised())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const [products, balances, listings, movements, orders, sales, purchases, purchaseItems] = await Promise.all([
    supabaseAdmin.from('products').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('inventory_balances').select('*').order('title'),
    supabaseAdmin.from('listings').select('*, channels(name,slug)').order('created_at', { ascending: false }),
    supabaseAdmin.from('inventory_movements').select('*').order('created_at', { ascending: false }).limit(100),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('sales').select('*').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('purchases').select('*').order('order_date', { ascending: false }),
    supabaseAdmin.from('purchase_items').select('*').order('created_at', { ascending: false }),
  ])
  const error = products.error || balances.error || listings.error || movements.error || orders.error || sales.error || purchases.error || purchaseItems.error
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: products.data, balances: balances.data, listings: listings.data, movements: movements.data, orders: orders.data, sales: sales.data, purchases: purchases.data, purchase_items: purchaseItems.data })
}

export async function POST(request: NextRequest) {
  if (!(await authorised())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const body = await request.json()
    if (body.action === 'create_purchase') {
      const { data, error } = await supabaseAdmin.rpc('create_purchase', {
        p_source_type: body.source_type,
        p_order_number: body.order_number,
        p_description: body.description,
        p_total_cost: body.total_cost,
        p_order_date: body.order_date,
        p_expected_delivery_date: body.expected_delivery_date || null,
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ purchase_id: data })
    }
    if (body.action === 'receive_purchase') {
      const { data, error } = await supabaseAdmin.rpc('receive_purchase', {
        p_purchase_id: body.purchase_id,
        p_delivered_at: body.delivered_at,
        p_items: body.items ?? [],
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json(data)
    }
    const { data, error } = await supabaseAdmin.rpc('simulate_sale', {
      p_product_id: body.product_id,
      p_quantity: body.quantity ?? 1,
      p_channel_slug: body.channel_slug ?? 'shopify',
      p_unit_price: body.unit_price,
      p_fee: body.fee ?? 0,
      p_shipping_cost: body.shipping_cost ?? 0,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
