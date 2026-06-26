-- Catalog assets and checkout hardening.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-assets',
  'catalog-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read catalog assets" on storage.objects;
create policy "public can read catalog assets"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'catalog-assets');

drop policy if exists "public can read active stock" on public.product_variant_stock;
grant select on public.product_variant_stock to anon, authenticated;

create policy "public can read active stock"
on public.product_variant_stock
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_variant_stock.product_id
      and p.status = 'active'
  )
);

alter table public.products
add column if not exists image_url text,
add column if not exists image_alt text not null default '';

alter table public.designs
add column if not exists image_url text,
add column if not exists image_alt text not null default '';

alter table public.payments
add column if not exists provider_preference_init_point text;

create unique index if not exists uq_payments_provider_preference_id
on public.payments (provider, provider_preference_id)
where provider_preference_id is not null;

create or replace function public.reserve_order_stock(items jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  item jsonb;
  target_product_id uuid;
  target_design_id uuid;
  target_size_code text;
  target_color_code text;
  target_quantity integer;
  tracked boolean;
begin
  if jsonb_typeof(items) <> 'array' then
    raise exception 'items must be an array';
  end if;

  for item in select * from jsonb_array_elements(items)
  loop
    target_product_id := (item->>'product_id')::uuid;
    target_design_id := nullif(item->>'design_id', '')::uuid;
    target_size_code := item->>'size_code';
    target_color_code := item->>'color_code';
    target_quantity := (item->>'quantity')::integer;

    if target_quantity <= 0 then
      raise exception 'quantity must be positive';
    end if;

    select coalesce(bool_or(stock.track_stock), false)
    into tracked
    from public.product_variant_stock stock
    where stock.product_id = target_product_id
      and stock.size_code = target_size_code
      and stock.color_code = target_color_code
      and (
        stock.design_id = target_design_id
        or (stock.design_id is null and target_design_id is null)
      );

    if tracked then
      update public.product_variant_stock stock
      set quantity_available = quantity_available - target_quantity
      where stock.product_id = target_product_id
        and stock.size_code = target_size_code
        and stock.color_code = target_color_code
        and (
          stock.design_id = target_design_id
          or (stock.design_id is null and target_design_id is null)
        )
        and stock.track_stock = true
        and stock.quantity_available >= target_quantity;

      if not found then
        raise exception 'insufficient stock';
      end if;
    end if;
  end loop;
end;
$$;

revoke all on function public.reserve_order_stock(jsonb) from public, anon, authenticated;
grant execute on function public.reserve_order_stock(jsonb) to service_role;
