-- Alba Vintage canonical Supabase schema
-- Inventory is movement-driven: stock is derived from inventory_movements.
-- Apply this file to a fresh Postgres database, or use the already-applied
-- Supabase migration in project `nqyoglcoiayinoglkvfs`.

create extension if not exists pgcrypto;

create table if not exists public.channels (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique, active boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.suppliers (id uuid primary key default gen_random_uuid(), name text not null, website text, notes text, active boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.products (id uuid primary key default gen_random_uuid(), sku text not null unique, title text not null, description text, category text, brand text, size text, condition text, image_url text, purchase_cost numeric(12,2) not null default 0, target_price numeric(12,2), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.listings (id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, channel_id uuid not null references public.channels(id), external_id text, title text, price numeric(12,2), status text not null default 'draft' check (status in ('draft','active','reserved','sold','delisted','ended')), listed_at timestamptz, delisted_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(product_id,channel_id));
create table if not exists public.customers (id uuid primary key default gen_random_uuid(), name text, email text, phone text, address jsonb, created_at timestamptz not null default now());
create table if not exists public.orders (id uuid primary key default gen_random_uuid(), order_number text not null unique, channel_id uuid references public.channels(id), customer_id uuid references public.customers(id), status text not null default 'pending' check (status in ('pending','paid','processing','shipped','completed','cancelled','refunded')), currency text not null default 'GBP', subtotal numeric(12,2) not null default 0, shipping_amount numeric(12,2) not null default 0, fee_amount numeric(12,2) not null default 0, total numeric(12,2) not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, product_id uuid not null references public.products(id), listing_id uuid references public.listings(id), quantity integer not null default 1 check (quantity > 0), unit_price numeric(12,2) not null, created_at timestamptz not null default now());
create table if not exists public.sales (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), order_item_id uuid not null references public.order_items(id), product_id uuid not null references public.products(id), channel_id uuid references public.channels(id), quantity integer not null check (quantity > 0), gross_amount numeric(12,2) not null, fees numeric(12,2) not null default 0, shipping_cost numeric(12,2) not null default 0, cost_of_goods numeric(12,2) not null default 0, net_amount numeric(12,2) generated always as (gross_amount-fees-shipping_cost) stored, profit numeric(12,2) generated always as (gross_amount-fees-shipping_cost-cost_of_goods) stored, settled_at timestamptz, created_at timestamptz not null default now());
create table if not exists public.purchases (id uuid primary key default gen_random_uuid(), supplier_id uuid references public.suppliers(id), reference text, purchased_at timestamptz not null default now(), total_cost numeric(12,2) not null default 0, status text not null default 'received' check (status in ('draft','ordered','received','cancelled')), notes text, created_at timestamptz not null default now());
create table if not exists public.purchase_items (id uuid primary key default gen_random_uuid(), purchase_id uuid not null references public.purchases(id) on delete cascade, product_id uuid not null references public.products(id), quantity integer not null check (quantity > 0), unit_cost numeric(12,2) not null, created_at timestamptz not null default now());
create table if not exists public.inventory_movements (id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id), movement_type text not null check (movement_type in ('purchase','adjustment','reservation','sale','return','release','damage')), quantity integer not null check (quantity > 0), direction text not null check (direction in ('in','out')), order_id uuid references public.orders(id), order_item_id uuid references public.order_items(id), purchase_id uuid references public.purchases(id), channel_id uuid references public.channels(id), reference text, notes text, created_at timestamptz not null default now());
create table if not exists public.expenses (id uuid primary key default gen_random_uuid(), category text not null, description text, amount numeric(12,2) not null check (amount >= 0), channel_id uuid references public.channels(id), incurred_at timestamptz not null default now(), created_at timestamptz not null default now());

create index if not exists idx_listings_product on public.listings(product_id);
create index if not exists idx_listings_channel_status on public.listings(channel_id,status);
create index if not exists idx_orders_channel_status on public.orders(channel_id,status);
create index if not exists idx_order_items_product on public.order_items(product_id);
create index if not exists idx_sales_product on public.sales(product_id);
create index if not exists idx_inventory_product_created on public.inventory_movements(product_id,created_at);
create index if not exists idx_inventory_order on public.inventory_movements(order_id);
create index if not exists idx_purchase_items_product on public.purchase_items(product_id);

create or replace view public.inventory_balances as
select p.id product_id,p.sku,p.title,coalesce(sum(case when im.direction='in' then im.quantity else -im.quantity end),0)::integer available_quantity
from public.products p left join public.inventory_movements im on im.product_id=p.id group by p.id,p.sku,p.title;

create or replace function public.record_inventory_movement(p_product_id uuid,p_movement_type text,p_quantity integer,p_direction text,p_order_id uuid default null,p_order_item_id uuid default null,p_purchase_id uuid default null,p_channel_id uuid default null,p_reference text default null,p_notes text default null) returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid;
begin
 if p_quantity<=0 then raise exception 'Quantity must be greater than zero'; end if;
 if p_direction not in ('in','out') then raise exception 'Invalid direction'; end if;
 if p_direction='out' and (select available_quantity from public.inventory_balances where product_id=p_product_id)<p_quantity then raise exception 'Insufficient inventory'; end if;
 insert into public.inventory_movements(product_id,movement_type,quantity,direction,order_id,order_item_id,purchase_id,channel_id,reference,notes) values(p_product_id,p_movement_type,p_quantity,p_direction,p_order_id,p_order_item_id,p_purchase_id,p_channel_id,p_reference,p_notes) returning id into v_id;
 return v_id;
end; $$;

create or replace function public.simulate_sale(p_product_id uuid,p_quantity integer,p_channel_slug text,p_unit_price numeric,p_fee numeric default 0,p_shipping_cost numeric default 0) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_channel_id uuid; v_product public.products%rowtype; v_order public.orders%rowtype; v_item public.order_items%rowtype; v_sale public.sales%rowtype; v_order_number text;
begin
 select * into v_product from public.products where id=p_product_id for update;
 if not found then raise exception 'Product not found'; end if;
 select id into v_channel_id from public.channels where slug=p_channel_slug and active=true;
 if not found then raise exception 'Channel not found: %',p_channel_slug; end if;
 if (select available_quantity from public.inventory_balances where product_id=p_product_id)<p_quantity then raise exception 'Insufficient inventory'; end if;
 v_order_number:='SIM-'||to_char(clock_timestamp(),'YYYYMMDDHH24MISSMS');
 insert into public.orders(order_number,channel_id,status,subtotal,total,fee_amount) values(v_order_number,v_channel_id,'completed',p_unit_price*p_quantity,p_unit_price*p_quantity,p_fee) returning * into v_order;
 insert into public.order_items(order_id,product_id,quantity,unit_price) values(v_order.id,p_product_id,p_quantity,p_unit_price) returning * into v_item;
 perform public.record_inventory_movement(p_product_id,'sale',p_quantity,'out',v_order.id,v_item.id,null,v_channel_id,v_order_number,'Simulated sale');
 insert into public.sales(order_id,order_item_id,product_id,channel_id,quantity,gross_amount,fees,shipping_cost,cost_of_goods,settled_at) values(v_order.id,v_item.id,p_product_id,v_channel_id,p_quantity,p_unit_price*p_quantity,p_fee,p_shipping_cost,v_product.purchase_cost*p_quantity,now()) returning * into v_sale;
 update public.listings set status='sold',delisted_at=now(),updated_at=now() where product_id=p_product_id and channel_id=v_channel_id and status in ('active','reserved');
 return jsonb_build_object('order',to_jsonb(v_order),'order_item',to_jsonb(v_item),'sale',to_jsonb(v_sale));
end; $$;

insert into public.channels(name,slug) values ('Shopify','shopify'),('eBay','ebay'),('Depop','depop') on conflict (slug) do nothing;

-- RLS is enabled in the hosted Supabase project. The app uses its server-only
-- secret key for the existing Alba session, so the secret never reaches the browser.
alter table public.channels enable row level security;
alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.listings enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.sales enable row level security;
alter table public.purchases enable row level security;
alter table public.purchase_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.expenses enable row level security;
