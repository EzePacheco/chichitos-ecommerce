-- Checkout production hardening: idempotency, stock reservations and atomic catalog save.

alter table public.orders
add column if not exists idempotency_key text;

create unique index if not exists uq_orders_idempotency_key
on public.orders (idempotency_key)
where idempotency_key is not null;

create table if not exists public.stock_reservations (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  design_id uuid references public.designs(id) on delete cascade,
  size_code text not null,
  color_code text not null,
  quantity integer not null check (quantity > 0),
  status text not null default 'reserved' check (status in ('reserved', 'captured', 'released')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_stock_reservations_order
on public.stock_reservations (order_id);

create index if not exists idx_stock_reservations_expired
on public.stock_reservations (expires_at)
where status = 'reserved';

drop trigger if exists set_stock_reservations_updated_at on public.stock_reservations;
create trigger set_stock_reservations_updated_at
before update on public.stock_reservations
for each row execute function public.set_updated_at();

alter table public.stock_reservations enable row level security;

revoke all on public.stock_reservations from anon, authenticated;
grant select, insert, update, delete on public.stock_reservations to authenticated, service_role;

drop policy if exists "admins can manage stock reservations" on public.stock_reservations;
create policy "admins can manage stock reservations"
on public.stock_reservations
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create or replace function public.release_expired_stock_reservations()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  released_count integer := 0;
begin
  with expired as (
    update public.stock_reservations
    set status = 'released'
    where status = 'reserved'
      and expires_at <= now()
    returning product_id, design_id, size_code, color_code, quantity
  ),
  expired_totals as (
    select product_id, design_id, size_code, color_code, sum(quantity)::integer as quantity
    from expired
    group by product_id, design_id, size_code, color_code
  ),
  returned as (
    update public.product_variant_stock stock
    set quantity_available = stock.quantity_available + expired_totals.quantity
    from expired_totals
    where stock.product_id = expired_totals.product_id
      and stock.size_code = expired_totals.size_code
      and stock.color_code = expired_totals.color_code
      and (
        stock.design_id = expired_totals.design_id
        or (stock.design_id is null and expired_totals.design_id is null)
      )
    returning expired_totals.quantity
  )
  select coalesce(sum(quantity), 0)::integer into released_count from returned;

  return released_count;
end;
$$;

create or replace function public.capture_order_stock(target_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.stock_reservations
  set status = 'captured'
  where order_id = target_order_id
    and status = 'reserved';
end;
$$;

create or replace function public.create_checkout_local(
  checkout_idempotency_key text,
  order_data jsonb,
  items_data jsonb,
  delivery_data jsonb,
  stock_data jsonb,
  reservation_minutes integer default 20
)
returns table (
  order_id uuid,
  public_code text,
  payment_id uuid,
  provider_preference_id text,
  provider_preference_init_point text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_order record;
  new_order record;
  new_payment record;
  item jsonb;
  stock_item jsonb;
  target_design_id uuid;
  tracked boolean;
  target_quantity integer;
begin
  if checkout_idempotency_key is null or length(trim(checkout_idempotency_key)) < 8 then
    raise exception 'invalid idempotency key';
  end if;

  perform public.release_expired_stock_reservations();

  select o.id, o.public_code, p.id as payment_id, p.provider_preference_id, p.provider_preference_init_point
  into existing_order
  from public.orders o
  left join public.payments p on p.order_id = o.id and p.provider = 'mercado_pago'
  where o.idempotency_key = checkout_idempotency_key
  limit 1;

  if found then
    return query select
      existing_order.id,
      existing_order.public_code,
      existing_order.payment_id,
      existing_order.provider_preference_id,
      existing_order.provider_preference_init_point;
    return;
  end if;

  insert into public.orders (
    idempotency_key,
    public_code,
    buyer_name,
    buyer_email,
    buyer_phone,
    subtotal_cents,
    personalization_total_cents,
    delivery_total_cents,
    total_cents,
    customer_notes
  )
  values (
    checkout_idempotency_key,
    order_data->>'public_code',
    order_data->>'buyer_name',
    nullif(order_data->>'buyer_email', ''),
    order_data->>'buyer_phone',
    (order_data->>'subtotal_cents')::integer,
    (order_data->>'personalization_total_cents')::integer,
    (order_data->>'delivery_total_cents')::integer,
    (order_data->>'total_cents')::integer,
    nullif(order_data->>'customer_notes', '')
  )
  returning id, public_code into new_order;

  for item in select * from jsonb_array_elements(items_data)
  loop
    insert into public.order_items (
      order_id,
      product_id,
      design_id,
      product_slug_snapshot,
      product_name_snapshot,
      size_label_snapshot,
      color_name_snapshot,
      design_name_snapshot,
      personalization_detail,
      unit_price_cents,
      personalization_price_cents,
      quantity,
      line_total_cents
    )
    values (
      new_order.id,
      (item->>'product_id')::uuid,
      (item->>'design_id')::uuid,
      item->>'product_slug_snapshot',
      item->>'product_name_snapshot',
      item->>'size_label_snapshot',
      item->>'color_name_snapshot',
      item->>'design_name_snapshot',
      nullif(item->>'personalization_detail', ''),
      (item->>'unit_price_cents')::integer,
      (item->>'personalization_price_cents')::integer,
      (item->>'quantity')::integer,
      (item->>'line_total_cents')::integer
    );
  end loop;

  insert into public.deliveries (
    order_id,
    method,
    recipient_name,
    address_line,
    city,
    postal_code,
    distance_km,
    cost_cents
  )
  values (
    new_order.id,
    (delivery_data->>'method')::public.delivery_method,
    nullif(delivery_data->>'recipient_name', ''),
    nullif(delivery_data->>'address_line', ''),
    nullif(delivery_data->>'city', ''),
    nullif(delivery_data->>'postal_code', ''),
    nullif(delivery_data->>'distance_km', '')::numeric,
    (delivery_data->>'cost_cents')::integer
  );

  for stock_item in select * from jsonb_array_elements(stock_data)
  loop
    target_design_id := nullif(stock_item->>'design_id', '')::uuid;
    target_quantity := (stock_item->>'quantity')::integer;

    select stock.track_stock
    into tracked
    from public.product_variant_stock stock
    where stock.product_id = (stock_item->>'product_id')::uuid
      and stock.size_code = stock_item->>'size_code'
      and stock.color_code = stock_item->>'color_code'
      and (
        stock.design_id = target_design_id
        or (stock.design_id is null and target_design_id is null)
      )
    for update;

    if not found then
      raise exception 'missing stock row';
    end if;

    if tracked then
      update public.product_variant_stock stock
      set quantity_available = quantity_available - target_quantity
      where stock.product_id = (stock_item->>'product_id')::uuid
        and stock.size_code = stock_item->>'size_code'
        and stock.color_code = stock_item->>'color_code'
        and (
          stock.design_id = target_design_id
          or (stock.design_id is null and target_design_id is null)
        )
        and stock.quantity_available >= target_quantity;

      if not found then
        raise exception 'insufficient stock';
      end if;

      insert into public.stock_reservations (
        order_id,
        product_id,
        design_id,
        size_code,
        color_code,
        quantity,
        expires_at
      )
      values (
        new_order.id,
        (stock_item->>'product_id')::uuid,
        target_design_id,
        stock_item->>'size_code',
        stock_item->>'color_code',
        target_quantity,
        now() + make_interval(mins => reservation_minutes)
      );
    end if;
  end loop;

  insert into public.payments (order_id, amount_cents)
  values (new_order.id, (order_data->>'total_cents')::integer)
  returning id into new_payment;

  return query select new_order.id, new_order.public_code, new_payment.id, null::text, null::text;
end;
$$;

create or replace function public.save_catalog_product_atomic(product_data jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_product record;
  size_item jsonb;
  color_item jsonb;
  design_item jsonb;
  stock_item jsonb;
  design_ids jsonb := '{}'::jsonb;
  saved_design record;
  sort_order integer;
begin
  insert into public.products (
    slug,
    name,
    summary,
    description,
    category,
    status,
    featured,
    base_price_cents,
    production_time,
    image_url,
    image_alt
  )
  values (
    product_data->>'slug',
    product_data->>'name',
    product_data->>'summary',
    product_data->>'description',
    (product_data->>'category')::public.product_category,
    (product_data->>'status')::public.catalog_status,
    coalesce((product_data->>'featured')::boolean, false),
    (product_data->>'base_price_cents')::integer,
    coalesce(product_data->>'production_time', ''),
    nullif(product_data->>'image_url', ''),
    coalesce(product_data->>'image_alt', '')
  )
  on conflict (slug) do update
  set
    name = excluded.name,
    summary = excluded.summary,
    description = excluded.description,
    category = excluded.category,
    status = excluded.status,
    featured = excluded.featured,
    base_price_cents = excluded.base_price_cents,
    production_time = excluded.production_time,
    image_url = coalesce(excluded.image_url, public.products.image_url),
    image_alt = coalesce(nullif(excluded.image_alt, ''), public.products.image_alt)
  returning id into saved_product;

  delete from public.product_sizes where product_id = saved_product.id;
  delete from public.product_colors where product_id = saved_product.id;
  delete from public.product_designs where product_id = saved_product.id;
  delete from public.product_personalization_options where product_id = saved_product.id;
  delete from public.product_variant_stock where product_id = saved_product.id;

  sort_order := 0;
  for size_item in select * from jsonb_array_elements(product_data->'sizes')
  loop
    insert into public.product_sizes (product_id, code, label, note, sort_order)
    values (saved_product.id, size_item->>'code', size_item->>'label', nullif(size_item->>'note', ''), sort_order);
    sort_order := sort_order + 1;
  end loop;

  sort_order := 0;
  for color_item in select * from jsonb_array_elements(product_data->'colors')
  loop
    insert into public.product_colors (product_id, code, name, hex, sort_order)
    values (saved_product.id, color_item->>'code', color_item->>'name', color_item->>'hex', sort_order);
    sort_order := sort_order + 1;
  end loop;

  sort_order := 0;
  for design_item in select * from jsonb_array_elements(product_data->'designs')
  loop
    insert into public.designs (slug, name, summary, status, sort_order)
    values (design_item->>'slug', design_item->>'name', design_item->>'summary', 'active', sort_order)
    on conflict (slug) do update
    set name = excluded.name, summary = excluded.summary, status = excluded.status, sort_order = excluded.sort_order
    returning id into saved_design;

    design_ids := design_ids || jsonb_build_object(design_item->>'slug', saved_design.id);

    insert into public.product_designs (product_id, design_id, extra_price_cents, sort_order)
    values (saved_product.id, saved_design.id, (design_item->>'extra_price_cents')::integer, sort_order);
    sort_order := sort_order + 1;
  end loop;

  insert into public.product_personalization_options (
    product_id,
    enabled,
    label,
    description,
    extra_price_cents
  )
  values (
    saved_product.id,
    coalesce(((product_data->'personalization')->>'enabled')::boolean, false),
    coalesce((product_data->'personalization')->>'label', ''),
    coalesce((product_data->'personalization')->>'description', ''),
    coalesce(((product_data->'personalization')->>'extra_price_cents')::integer, 0)
  );

  for stock_item in select * from jsonb_array_elements(product_data->'stock')
  loop
    insert into public.product_variant_stock (
      product_id,
      design_id,
      size_code,
      color_code,
      quantity_available,
      track_stock
    )
    values (
      saved_product.id,
      nullif(design_ids->>(stock_item->>'design_slug'), '')::uuid,
      stock_item->>'size_code',
      stock_item->>'color_code',
      (stock_item->>'quantity_available')::integer,
      coalesce((stock_item->>'track_stock')::boolean, true)
    );
  end loop;

  return saved_product.id;
end;
$$;

revoke all on function public.release_expired_stock_reservations() from public, anon, authenticated;
revoke all on function public.capture_order_stock(uuid) from public, anon, authenticated;
revoke all on function public.create_checkout_local(text, jsonb, jsonb, jsonb, jsonb, integer) from public, anon, authenticated;
revoke all on function public.save_catalog_product_atomic(jsonb) from public, anon, authenticated;

grant execute on function public.release_expired_stock_reservations() to service_role;
grant execute on function public.capture_order_stock(uuid) to service_role;
grant execute on function public.create_checkout_local(text, jsonb, jsonb, jsonb, jsonb, integer) to service_role;
grant execute on function public.save_catalog_product_atomic(jsonb) to service_role;

comment on table public.stock_reservations is 'Data classification: internal. Temporary stock holds for pending checkout payments.';
