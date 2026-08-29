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
  const [products, balances, listings, movements, orders, sales] = await Promise.all([
    supabaseAdmin.from('products').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('inventory_balances').select('*').order('title'),
    supabaseAdmin.from('listings').select('*, channels(name,slug)').order('created_at', { ascending: false }),
    supabaseAdmin.from('inventory_movements').select('*').order('created_at', { ascending: false }).limit(100),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('sales').select('*').order('created_at', { ascending: false }).limit(50),
  ])
  const error = products.error || balances.error || listings.error || movements.error || orders.error || sales.error
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: products.data, balances: balances.data, listings: listings.data, movements: movements.data, orders: orders.data, sales: sales.data })
}

export async function POST(request: NextRequest) {
  if (!(await authorised())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const body = await request.json()
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
