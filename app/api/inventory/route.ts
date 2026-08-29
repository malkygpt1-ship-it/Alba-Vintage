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
  const [products, balances, listings, movements, orders, sales, purchases] = await Promise.all([
    supabaseAdmin.from('products').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('inventory_balances').select('*').order('title'),
    supabaseAdmin.from('listings').select('*, channels(name,slug)').order('created_at', { ascending: false }),
    supabaseAdmin.from('inventory_movements').select('*').order('created_at', { ascending: false }).limit(100),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('sales').select('*').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('purchases').select('*').order('purchased_at', { ascending: false }).limit(50),
  ])
  const error = products.error || balances.error || listings.error || movements.error || orders.error || sales.error || purchases.error
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: products.data, balances: balances.data, listings: listings.data, movements: movements.data, orders: orders.data, sales: sales.data, purchases: purchases.data })
}

export async function POST(request: NextRequest) {
  if (!(await authorised())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const body = await request.json()
    if (body.action === 'add_stock') {
      const { data, error } = await supabaseAdmin.rpc('add_stock', {
        p_source_type: body.source_type,
        p_order_number: body.order_number,
        p_description: body.description,
        p_contents: body.contents ?? [],
        p_total_cost: body.total_cost,
        p_unit_cost: body.unit_cost,
        p_listed_price: body.listed_price,
        p_projected_profit_ebay: body.projected_profit_ebay,
        p_projected_profit_depop: body.projected_profit_depop,
        p_projected_profit_shopify: body.projected_profit_shopify,
        p_stock_entered_at: body.stock_entered_at,
        p_listing_date: body.listing_date || null,
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
