-- Chichitos Web initial Supabase schema.
-- Source of truth: versioned migrations, not dashboard-only changes.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public;

-- Enumerated domain states. Keep app transitions explicit in server-side use cases.
do $$
begin
  create type public.product_category as enum ('remeras', 'bodies', 'abrigos', 'sets', 'accesorios');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.catalog_status as enum ('draft', 'active', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.delivery_method as enum ('pickup', 'shipping');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_operational_status as enum ('new', 'in_production', 'ready', 'shipped', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum ('pending', 'approved', 'rejected', 'cancelled', 'refunded', 'unknown');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_provider as enum ('mercado_pago');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id boolean primary key default true check (id = true),
  store_name text not null default 'Chichitos',
  whatsapp_number text,
  store_address text,
  store_latitude numeric(9,6),
  store_longitude numeric(9,6),
  delivery_base_radius_km numeric(6,2) not null default 3 check (delivery_base_radius_km > 0),
  delivery_base_price_cents integer not null default 0 check (delivery_base_price_cents >= 0),
  delivery_extra_step_km numeric(6,2) not null default 0.5 check (delivery_extra_step_km > 0),
  delivery_extra_step_price_cents integer not null default 0 check (delivery_extra_step_price_cents >= 0),
  changes_returns_policy text not null default '',
  production_time_text text not null default '',
  default_personalization_extra_price_cents integer not null default 0 check (default_personalization_extra_price_cents >= 0),
  checkout_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  summary text not null,
  description text not null,
  category public.product_category not null,
  status public.catalog_status not null default 'draft',
  featured boolean not null default false,
  base_price_cents integer not null check (base_price_cents >= 0),
  production_time text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_sizes (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  code text not null,
  label text not null,
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, code)
);

create table if not exists public.product_colors (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  code text not null,
  name text not null,
  hex text not null check (hex ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, code)
);

create table if not exists public.designs (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  summary text not null,
  description text not null default '',
  status public.catalog_status not null default 'draft',
  base_extra_price_cents integer not null default 0 check (base_extra_price_cents >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_designs (
  product_id uuid not null references public.products(id) on delete cascade,
  design_id uuid not null references public.designs(id) on delete restrict,
  extra_price_cents integer not null default 0 check (extra_price_cents >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (product_id, design_id)
);

create table if not exists public.product_personalization_options (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  enabled boolean not null default false,
  label text not null default '',
  description text not null default '',
  extra_price_cents integer not null default 0 check (extra_price_cents >= 0),
  variants jsonb not null default '[]'::jsonb check (jsonb_typeof(variants) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  public_code text not null unique,
  operational_status public.order_operational_status not null default 'new',
  payment_status public.payment_status not null default 'pending',
  buyer_name text not null,
  buyer_email text,
  buyer_phone text not null,
  currency text not null default 'ARS' check (currency = 'ARS'),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  personalization_total_cents integer not null default 0 check (personalization_total_cents >= 0),
  delivery_total_cents integer not null default 0 check (delivery_total_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  customer_notes text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (total_cents = subtotal_cents + personalization_total_cents + delivery_total_cents)
);

create table if not exists public.order_items (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  design_id uuid references public.designs(id) on delete set null,
  product_slug_snapshot text not null,
  product_name_snapshot text not null,
  size_label_snapshot text not null,
  color_name_snapshot text not null,
  design_name_snapshot text not null,
  personalization_detail text,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  personalization_price_cents integer not null default 0 check (personalization_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  created_at timestamptz not null default now(),
  check (line_total_cents = (unit_price_cents + personalization_price_cents) * quantity)
);

create table if not exists public.deliveries (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  method public.delivery_method not null,
  recipient_name text,
  address_line text,
  city text,
  province text,
  postal_code text,
  distance_km numeric(8,2) check (distance_km is null or distance_km >= 0),
  cost_cents integer not null default 0 check (cost_cents >= 0),
  instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (method = 'pickup' and cost_cents = 0)
    or
    (method = 'shipping' and address_line is not null)
  )
);

create table if not exists public.payments (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider public.payment_provider not null default 'mercado_pago',
  provider_preference_id text,
  provider_payment_id text,
  provider_status text,
  status public.payment_status not null default 'pending',
  amount_cents integer not null check (amount_cents >= 0),
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

create table if not exists public.payment_webhook_events (
  id uuid primary key default extensions.gen_random_uuid(),
  provider public.payment_provider not null default 'mercado_pago',
  external_event_id text not null,
  event_type text not null,
  processed_at timestamptz,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (provider, external_event_id)
);

create table if not exists public.product_variant_stock (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  design_id uuid references public.designs(id) on delete cascade,
  size_code text not null,
  color_code text not null,
  quantity_available integer not null default 0 check (quantity_available >= 0),
  track_stock boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id)
values (true)
on conflict (id) do nothing;

create index if not exists idx_products_public_catalog on public.products (status, category, sort_order, created_at desc);
create index if not exists idx_designs_public_catalog on public.designs (status, sort_order, created_at desc);
create index if not exists idx_product_sizes_product on public.product_sizes (product_id, sort_order);
create index if not exists idx_product_colors_product on public.product_colors (product_id, sort_order);
create index if not exists idx_product_designs_product on public.product_designs (product_id, sort_order);
create index if not exists idx_orders_status_created on public.orders (operational_status, payment_status, created_at desc);
create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_payments_order on public.payments (order_id);
create index if not exists idx_payment_webhook_events_processed on public.payment_webhook_events (processed_at) where processed_at is null;
create unique index if not exists uq_stock_with_design on public.product_variant_stock (product_id, design_id, size_code, color_code) where design_id is not null;
create unique index if not exists uq_stock_without_design on public.product_variant_stock (product_id, size_code, color_code) where design_id is null;

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

drop trigger if exists set_store_settings_updated_at on public.store_settings;
create trigger set_store_settings_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_designs_updated_at on public.designs;
create trigger set_designs_updated_at
before update on public.designs
for each row execute function public.set_updated_at();

drop trigger if exists set_product_personalization_options_updated_at on public.product_personalization_options;
create trigger set_product_personalization_options_updated_at
before update on public.product_personalization_options
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_deliveries_updated_at on public.deliveries;
create trigger set_deliveries_updated_at
before update on public.deliveries
for each row execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists set_product_variant_stock_updated_at on public.product_variant_stock;
create trigger set_product_variant_stock_updated_at
before update on public.product_variant_stock
for each row execute function public.set_updated_at();

drop function if exists public.is_admin();

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and is_active = true
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated, service_role;
grant execute on function private.is_admin() to authenticated, service_role;

alter table public.admin_users enable row level security;
alter table public.store_settings enable row level security;
alter table public.products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_colors enable row level security;
alter table public.designs enable row level security;
alter table public.product_designs enable row level security;
alter table public.product_personalization_options enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.deliveries enable row level security;
alter table public.payments enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.product_variant_stock enable row level security;

revoke all on all tables in schema public from anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;

grant select on
  public.store_settings,
  public.products,
  public.product_sizes,
  public.product_colors,
  public.designs,
  public.product_designs,
  public.product_personalization_options
to anon, authenticated;

grant select, insert, update, delete on
  public.admin_users,
  public.store_settings,
  public.products,
  public.product_sizes,
  public.product_colors,
  public.designs,
  public.product_designs,
  public.product_personalization_options,
  public.orders,
  public.order_items,
  public.deliveries,
  public.payments,
  public.payment_webhook_events,
  public.product_variant_stock
to authenticated, service_role;

create policy "public can read store settings"
on public.store_settings
for select
to anon, authenticated
using (true);

create policy "admins can manage store settings"
on public.store_settings
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "public can read active products"
on public.products
for select
to anon, authenticated
using (status = 'active');

create policy "admins can manage products"
on public.products
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "public can read active product sizes"
on public.product_sizes
for select
to anon, authenticated
using (exists (select 1 from public.products p where p.id = product_sizes.product_id and p.status = 'active'));

create policy "admins can manage product sizes"
on public.product_sizes
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "public can read active product colors"
on public.product_colors
for select
to anon, authenticated
using (exists (select 1 from public.products p where p.id = product_colors.product_id and p.status = 'active'));

create policy "admins can manage product colors"
on public.product_colors
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "public can read active designs"
on public.designs
for select
to anon, authenticated
using (status = 'active');

create policy "admins can manage designs"
on public.designs
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "public can read active product designs"
on public.product_designs
for select
to anon, authenticated
using (
  exists (select 1 from public.products p where p.id = product_designs.product_id and p.status = 'active')
  and exists (select 1 from public.designs d where d.id = product_designs.design_id and d.status = 'active')
);

create policy "admins can manage product designs"
on public.product_designs
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "public can read active product personalization"
on public.product_personalization_options
for select
to anon, authenticated
using (exists (select 1 from public.products p where p.id = product_personalization_options.product_id and p.status = 'active'));

create policy "admins can manage product personalization"
on public.product_personalization_options
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins can read admin users"
on public.admin_users
for select
to authenticated
using ((select private.is_admin()));

create policy "admins can manage admin users"
on public.admin_users
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins can manage orders"
on public.orders
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins can manage order items"
on public.order_items
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins can manage deliveries"
on public.deliveries
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins can manage payments"
on public.payments
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins can read webhook events"
on public.payment_webhook_events
for select
to authenticated
using ((select private.is_admin()));

create policy "admins can manage stock"
on public.product_variant_stock
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

comment on table public.products is 'Data classification: public. Public catalog products.';
comment on table public.designs is 'Data classification: public. Chichitos-owned DTF designs.';
comment on table public.orders is 'Data classification: confidential. Buyer contact and order totals.';
comment on table public.order_items is 'Data classification: confidential. Historical purchase snapshot.';
comment on table public.deliveries is 'Data classification: confidential. Delivery address and distance data.';
comment on table public.payments is 'Data classification: confidential. Payment reconciliation metadata; no card data.';
comment on table public.payment_webhook_events is 'Data classification: internal/confidential. Raw provider webhook payloads for idempotency and audit.';
comment on table public.admin_users is 'Data classification: confidential. Admin authorization records mapped to Supabase Auth users.';
comment on table public.store_settings is 'Data classification: public/internal mixed. Public commerce settings, editable by admin.';
comment on table public.product_variant_stock is 'Data classification: internal. Future stock tracking by product/design/size/color.';
