-- SPEC-005 hardening: Data API least privilege, retryable webhook inbox,
-- idempotent Mercado Pago preference creation, and active reservation safety.

alter table public.payment_webhook_events
add column if not exists processing_status text not null default 'pending'
  check (processing_status in ('pending', 'processing', 'processed', 'ignored', 'failed')),
add column if not exists attempt_count integer not null default 0 check (attempt_count >= 0),
add column if not exists last_error text,
add column if not exists processing_started_at timestamptz;

alter table public.payments
add column if not exists provider_preference_creation_started_at timestamptz;

alter table public.orders
add column if not exists idempotency_fingerprint text;

create index if not exists idx_payment_webhook_events_retry
on public.payment_webhook_events (processing_status, processing_started_at)
where processed_at is null;

revoke insert, update, delete on
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
  public.stock_reservations,
  public.product_variant_stock
from anon, authenticated;

drop policy if exists "admins can manage orders" on public.orders;
drop policy if exists "admins can manage admin users" on public.admin_users;
drop policy if exists "admins can manage store settings" on public.store_settings;
drop policy if exists "admins can manage products" on public.products;
drop policy if exists "admins can manage product sizes" on public.product_sizes;
drop policy if exists "admins can manage product colors" on public.product_colors;
drop policy if exists "admins can manage designs" on public.designs;
drop policy if exists "admins can manage product designs" on public.product_designs;
drop policy if exists "admins can manage product personalization" on public.product_personalization_options;
drop policy if exists "admins can manage order items" on public.order_items;
drop policy if exists "admins can manage deliveries" on public.deliveries;
drop policy if exists "admins can manage payments" on public.payments;
drop policy if exists "admins can manage stock reservations" on public.stock_reservations;
drop policy if exists "admins can manage stock" on public.product_variant_stock;

create policy "admins can read orders"
on public.orders
for select
to authenticated
using ((select private.is_admin()));

create policy "admins can read order items"
on public.order_items
for select
to authenticated
using ((select private.is_admin()));

create policy "admins can read deliveries"
on public.deliveries
for select
to authenticated
using ((select private.is_admin()));

create policy "admins can read payments"
on public.payments
for select
to authenticated
using ((select private.is_admin()));

create policy "admins can read stock reservations"
on public.stock_reservations
for select
to authenticated
using ((select private.is_admin()));

create policy "admins can read stock"
on public.product_variant_stock
for select
to authenticated
using ((select private.is_admin()));

create or replace function public.release_order_stock(target_order_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  released_count integer := 0;
begin
  with released as (
    update public.stock_reservations
    set status = 'released'
    where order_id = target_order_id
      and status = 'reserved'
    returning product_id, design_id, size_code, color_code, quantity
  ),
  released_totals as (
    select product_id, design_id, size_code, color_code, sum(quantity)::integer as quantity
    from released
    group by product_id, design_id, size_code, color_code
  ),
  returned as (
    update public.product_variant_stock stock
    set quantity_available = stock.quantity_available + released_totals.quantity
    from released_totals
    where stock.product_id = released_totals.product_id
      and stock.size_code = released_totals.size_code
      and stock.color_code = released_totals.color_code
      and (
        stock.design_id = released_totals.design_id
        or (stock.design_id is null and released_totals.design_id is null)
      )
    returning released_totals.quantity
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
declare
  reservation_count integer := 0;
  captured_count integer := 0;
begin
  perform 1
  from public.stock_reservations
  where order_id = target_order_id
  for update;

  select count(*)::integer
  into reservation_count
  from public.stock_reservations
  where order_id = target_order_id;

  if exists (
    select 1
    from public.stock_reservations
    where order_id = target_order_id
      and status = 'reserved'
      and expires_at <= now()
  ) then
    raise exception 'stock reservation expired';
  end if;

  update public.stock_reservations
  set status = 'captured'
  where order_id = target_order_id
    and status = 'reserved'
    and expires_at > now();

  get diagnostics captured_count = row_count;

  if reservation_count > 0 and captured_count = 0 then
    if not exists (
      select 1
      from public.stock_reservations
      where order_id = target_order_id
        and status <> 'captured'
    ) then
      return;
    end if;

    raise exception 'no active stock reservation to capture';
  end if;
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

  select
    o.id,
    o.public_code,
    o.idempotency_fingerprint,
    p.id as payment_id,
    p.provider_preference_id,
    p.provider_preference_init_point
  into existing_order
  from public.orders o
  left join public.payments p on p.order_id = o.id and p.provider = 'mercado_pago'
  where o.idempotency_key = checkout_idempotency_key
  limit 1;

  if found then
    if coalesce(existing_order.idempotency_fingerprint, '') <> coalesce(order_data->>'idempotency_fingerprint', '') then
      raise exception 'idempotency conflict';
    end if;

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
    idempotency_fingerprint,
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
    order_data->>'idempotency_fingerprint',
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

create or replace function public.claim_mercado_pago_preference_creation(target_payment_id uuid)
returns table (
  claimed boolean,
  in_progress boolean,
  provider_preference_init_point text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  payment_record record;
begin
  select id, provider_preference_init_point, provider_preference_creation_started_at
  into payment_record
  from public.payments
  where id = target_payment_id
    and provider = 'mercado_pago'
  for update;

  if not found then
    raise exception 'payment not found';
  end if;

  if payment_record.provider_preference_init_point is not null then
    return query select false, false, payment_record.provider_preference_init_point;
    return;
  end if;

  if payment_record.provider_preference_creation_started_at is not null
    and payment_record.provider_preference_creation_started_at > now() - interval '2 minutes'
  then
    return query select false, true, null::text;
    return;
  end if;

  update public.payments
  set provider_preference_creation_started_at = now()
  where id = target_payment_id;

  return query select true, false, null::text;
end;
$$;

create or replace function public.complete_mercado_pago_preference_creation(
  target_payment_id uuid,
  preference_id text,
  preference_init_point text
)
returns table (
  provider_preference_id text,
  provider_preference_init_point text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  payment_record record;
begin
  select id, public.payments.provider_preference_id, public.payments.provider_preference_init_point
  into payment_record
  from public.payments
  where id = target_payment_id
    and provider = 'mercado_pago'
  for update;

  if not found then
    raise exception 'payment not found';
  end if;

  if payment_record.provider_preference_init_point is null then
    update public.payments
    set
      provider_preference_id = preference_id,
      provider_preference_init_point = preference_init_point,
      provider_preference_creation_started_at = null
    where id = target_payment_id
    returning public.payments.provider_preference_id,
      public.payments.provider_preference_init_point
    into payment_record.provider_preference_id,
      payment_record.provider_preference_init_point;
  end if;

  return query select
    payment_record.provider_preference_id,
    payment_record.provider_preference_init_point;
end;
$$;

create or replace function public.claim_payment_webhook_event(
  webhook_external_event_id text,
  webhook_event_type text,
  webhook_payload jsonb
)
returns table (
  should_process boolean,
  duplicate_processed boolean,
  processing_in_progress boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_record record;
  inserted_count integer := 0;
begin
  insert into public.payment_webhook_events (
    external_event_id,
    event_type,
    payload,
    processing_status,
    attempt_count,
    processing_started_at
  )
  values (
    webhook_external_event_id,
    webhook_event_type,
    webhook_payload,
    'processing',
    1,
    now()
  )
  on conflict (provider, external_event_id) do nothing;

  get diagnostics inserted_count = row_count;

  select id, processed_at, processing_status, processing_started_at
  into event_record
  from public.payment_webhook_events
  where provider = 'mercado_pago'
    and external_event_id = webhook_external_event_id
  for update;

  if event_record.processed_at is not null then
    return query select false, true, false;
    return;
  end if;

  if inserted_count = 0
    and event_record.processing_status = 'processing'
    and event_record.processing_started_at > now() - interval '2 minutes'
  then
    return query select false, false, true;
    return;
  end if;

  update public.payment_webhook_events
  set
    event_type = webhook_event_type,
    payload = webhook_payload,
    processing_status = 'processing',
    attempt_count = case when inserted_count = 1 then attempt_count else attempt_count + 1 end,
    processing_started_at = now(),
    last_error = null
  where provider = 'mercado_pago'
    and external_event_id = webhook_external_event_id;

  return query select true, false, false;
end;
$$;

create or replace function public.mark_payment_webhook_event_failed(
  webhook_external_event_id text,
  error_message text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.payment_webhook_events
  set
    processing_status = 'failed',
    last_error = left(coalesce(error_message, 'unknown error'), 500),
    processing_started_at = null
  where provider = 'mercado_pago'
    and external_event_id = webhook_external_event_id
    and processed_at is null;
end;
$$;

create or replace function public.mark_payment_webhook_event_ignored(
  webhook_external_event_id text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.payment_webhook_events
  set
    processing_status = 'ignored',
    processed_at = now(),
    processing_started_at = null,
    last_error = null
  where provider = 'mercado_pago'
    and external_event_id = webhook_external_event_id;
end;
$$;

create or replace function public.apply_mercado_pago_payment_webhook(
  webhook_external_event_id text,
  target_order_id uuid,
  mp_provider_payment_id text,
  mp_provider_payment_status text,
  mp_local_payment_status public.payment_status,
  mp_provider_payload jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  locked_order record;
begin
  select id
  into locked_order
  from public.orders
  where id = target_order_id
  for update;

  if not found then
    raise exception 'order not found';
  end if;

  update public.payments
  set
    provider_payment_id = mp_provider_payment_id,
    provider_status = mp_provider_payment_status,
    status = mp_local_payment_status,
    raw_payload = mp_provider_payload
  where order_id = target_order_id
    and provider = 'mercado_pago';

  if not found then
    raise exception 'payment not found';
  end if;

  update public.orders
  set payment_status = mp_local_payment_status
  where id = target_order_id;

  if mp_local_payment_status = 'approved' then
    perform public.capture_order_stock(target_order_id);
  elsif mp_local_payment_status in ('rejected', 'cancelled', 'refunded') then
    perform public.release_order_stock(target_order_id);
  end if;

  update public.payment_webhook_events
  set
    processing_status = 'processed',
    processed_at = now(),
    processing_started_at = null,
    last_error = null
  where provider = 'mercado_pago'
    and external_event_id = webhook_external_event_id;
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

  perform 1
  from public.product_variant_stock
  where product_id = saved_product.id
  for update;

  if exists (
    select 1
    from public.stock_reservations
    where product_id = saved_product.id
      and status = 'reserved'
      and expires_at > now()
  ) then
    raise exception 'active stock reservations prevent catalog stock changes';
  end if;

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

revoke all on function public.claim_mercado_pago_preference_creation(uuid) from public, anon, authenticated;
revoke all on function public.complete_mercado_pago_preference_creation(uuid, text, text) from public, anon, authenticated;
revoke all on function public.release_order_stock(uuid) from public, anon, authenticated;
revoke all on function public.capture_order_stock(uuid) from public, anon, authenticated;
revoke all on function public.create_checkout_local(text, jsonb, jsonb, jsonb, jsonb, integer) from public, anon, authenticated;
revoke all on function public.claim_payment_webhook_event(text, text, jsonb) from public, anon, authenticated;
revoke all on function public.mark_payment_webhook_event_failed(text, text) from public, anon, authenticated;
revoke all on function public.mark_payment_webhook_event_ignored(text) from public, anon, authenticated;
revoke all on function public.apply_mercado_pago_payment_webhook(text, uuid, text, text, public.payment_status, jsonb) from public, anon, authenticated;
revoke all on function public.save_catalog_product_atomic(jsonb) from public, anon, authenticated;

grant execute on function public.claim_mercado_pago_preference_creation(uuid) to service_role;
grant execute on function public.complete_mercado_pago_preference_creation(uuid, text, text) to service_role;
grant execute on function public.release_order_stock(uuid) to service_role;
grant execute on function public.capture_order_stock(uuid) to service_role;
grant execute on function public.create_checkout_local(text, jsonb, jsonb, jsonb, jsonb, integer) to service_role;
grant execute on function public.claim_payment_webhook_event(text, text, jsonb) to service_role;
grant execute on function public.mark_payment_webhook_event_failed(text, text) to service_role;
grant execute on function public.mark_payment_webhook_event_ignored(text) to service_role;
grant execute on function public.apply_mercado_pago_payment_webhook(text, uuid, text, text, public.payment_status, jsonb) to service_role;
grant execute on function public.save_catalog_product_atomic(jsonb) to service_role;

comment on function public.claim_mercado_pago_preference_creation(uuid)
  is 'Claims a local payment row before creating one Mercado Pago preference for checkout idempotency.';
comment on function public.claim_payment_webhook_event(text, text, jsonb)
  is 'Claims a Mercado Pago webhook inbox event and allows retry when previous processing did not complete.';
comment on function public.apply_mercado_pago_payment_webhook(text, uuid, text, text, public.payment_status, jsonb)
  is 'Applies validated Mercado Pago payment state, order state, stock capture and webhook completion atomically.';
