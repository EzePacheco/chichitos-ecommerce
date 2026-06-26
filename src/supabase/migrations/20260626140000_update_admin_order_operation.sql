create or replace function public.update_admin_order_operation(
  target_order_id uuid,
  order_data jsonb,
  delivery_data jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.orders
  set
    operational_status = (order_data->>'operational_status')::public.order_operational_status,
    buyer_name = order_data->>'buyer_name',
    buyer_email = nullif(order_data->>'buyer_email', ''),
    buyer_phone = order_data->>'buyer_phone',
    admin_notes = nullif(order_data->>'admin_notes', '')
  where id = target_order_id;

  if not found then
    raise exception 'order not found';
  end if;

  update public.deliveries
  set
    recipient_name = nullif(delivery_data->>'recipient_name', ''),
    address_line = nullif(delivery_data->>'address_line', ''),
    city = nullif(delivery_data->>'city', ''),
    province = nullif(delivery_data->>'province', ''),
    postal_code = nullif(delivery_data->>'postal_code', ''),
    instructions = nullif(delivery_data->>'instructions', '')
  where order_id = target_order_id;
end;
$$;

comment on function public.update_admin_order_operation(uuid, jsonb, jsonb)
  is 'Updates admin-owned order operation fields without changing payment state.';

revoke all on function public.update_admin_order_operation(uuid, jsonb, jsonb)
  from public, anon, authenticated;
grant execute on function public.update_admin_order_operation(uuid, jsonb, jsonb)
  to service_role;
