create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  title text not null,
  description text,
  brand text,
  category text,
  size text,
  condition text,
  cost_pence integer not null default 0,
  price_pence integer not null default 0,
  status text not null default 'AVAILABLE' check (status in ('AVAILABLE','SOLD','RESERVED','DRAFT','ARCHIVED')),
  acquired_at timestamptz,
  sold_at timestamptz,
  sold_platform text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists channel_listings (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid not null references inventory_items(id) on delete cascade,
  channel text not null check (channel in ('SHOPIFY','EBAY','DEPOP')),
  external_listing_id text,
  external_url text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','SOLD','ENDED','ERROR','PENDING')),
  last_synced_at timestamptz,
  last_error text,
  unique(inventory_id, channel)
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  source_event_id text not null,
  platform text not null,
  inventory_id uuid references inventory_items(id),
  external_order_id text,
  sale_pence integer not null,
  platform_fee_pence integer not null default 0,
  postage_pence integer not null default 0,
  cost_pence integer not null default 0,
  profit_pence integer generated always as (sale_pence - platform_fee_pence - postage_pence - cost_pence) stored,
  sold_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(platform, source_event_id)
);

create table if not exists automation_events (
  id uuid primary key default gen_random_uuid(),
  event_key text unique not null,
  event_type text not null,
  platform text,
  sku text,
  payload jsonb,
  status text not null default 'RECEIVED' check (status in ('RECEIVED','PROCESSING','SUCCESS','FAILED')),
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists idx_inventory_status on inventory_items(status);
create index if not exists idx_listing_channel_status on channel_listings(channel,status);
create index if not exists idx_sales_sold_at on sales(sold_at);

-- One-of-one stock rule: SKU is unique and a successful sale is idempotent by platform + source_event_id.
-- Add RLS/auth policies appropriate to your chosen deployment before exposing this database to a browser.
