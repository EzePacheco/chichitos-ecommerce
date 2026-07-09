# Supabase

Contrato operativo inicial para la base de datos de Chichitos Web.

## Fuente de verdad

Las migraciones versionadas bajo `src/supabase/migrations/` son la fuente de verdad del schema. Evitar cambios manuales en el dashboard que no queden reflejados en una migracion.

Migraciones actuales:

- Aplicar todos los archivos de `src/supabase/migrations/` en orden lexicografico.
- No editar migraciones ya aplicadas; crear una migracion forward.

## Setup del proyecto remoto

1. Crear un proyecto Supabase para Chichitos.
2. Copiar al `.env` local:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` para backend server-side, o `SUPABASE_SERVICE_ROLE_KEY` como fallback legacy.
3. Mantener la clave elevada de Supabase solo server-side. Nunca usarla en componentes cliente ni exponerla con prefijo `NEXT_PUBLIC_`.
4. Configurar Google como provider de Auth en Supabase cuando se implemente login admin.
5. Agregar URLs de redirect cuando exista la ruta de callback de auth:
   - Local: `http://localhost:3000/auth/callback`
   - Vercel preview/production: dominios correspondientes cuando existan.

## Aplicar migraciones

Opcion recomendada con Supabase CLI:

```powershell
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

Estado actual: la CLI `supabase` no esta instalada en esta maquina.

Opcion temporal sin CLI:

1. Abrir Supabase Dashboard.
2. Ir a SQL Editor.
3. Ejecutar los archivos de `src/supabase/migrations/` en orden.
4. No editar el schema luego desde el dashboard sin crear una migracion equivalente en el repo.

## Modelo de seguridad

- RLS esta habilitado en todas las tablas publicas del dominio.
- Catalogo activo es publico de solo lectura.
- Pedidos, pagos, direcciones, reservas y webhook events no tienen acceso publico.
- Admin autenticado no tiene escritura directa por Data API sobre catalogo,
  settings, pedidos, pagos, webhooks, stock ni reservas; esas mutaciones pasan
  por backend server-side con autorizacion previa.
- Admin se define por `public.admin_users` y la funcion privada `private.is_admin()`.
- El bootstrap inicial debe hacerse desde backend con `ADMIN_BOOTSTRAP_EMAILS` y clave elevada server-side.

## Estado tecnico

- Los clientes Supabase viven bajo `src/platform/supabase/`.
- El cliente elevado server-side esta en `src/platform/supabase/admin.ts`.
- El catalogo publico lee Supabase cuando hay configuracion real y usa fallback
  local solo fuera de produccion.
- Auth callback, bootstrap admin y autorizacion admin estan implementados.
- Checkout productivo usa RPCs server-side para idempotencia, reserva/captura de
  stock y procesamiento transaccional de webhooks Mercado Pago.
