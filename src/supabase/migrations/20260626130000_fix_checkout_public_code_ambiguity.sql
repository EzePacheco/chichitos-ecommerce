-- Fix PL/pgSQL ambiguity between the output column `public_code` and orders.public_code.

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
  returning public.orders.id, public.orders.public_code into new_order;

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

revoke all on function public.create_checkout_local(text, jsonb, jsonb, jsonb, jsonb, integer) from public, anon, authenticated;
grant execute on function public.create_checkout_local(text, jsonb, jsonb, jsonb, jsonb, integer) to service_role;
