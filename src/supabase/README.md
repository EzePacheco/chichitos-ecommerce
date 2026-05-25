# Supabase

Contrato operativo inicial para la base de datos de Chichitos Web.

## Fuente de verdad

Las migraciones versionadas bajo `supabase/migrations/` son la fuente de verdad del schema. Evitar cambios manuales en el dashboard que no queden reflejados en una migracion.

Migracion inicial:

- `supabase/migrations/20260517143000_initial_schema.sql`

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
3. Ejecutar el contenido de `supabase/migrations/20260517143000_initial_schema.sql`.
4. No editar el schema luego desde el dashboard sin crear una migracion equivalente en el repo.

## Modelo de seguridad

- RLS esta habilitado en todas las tablas publicas del dominio.
- Catalogo activo es publico de solo lectura.
- Pedidos, pagos, direcciones y webhook events no tienen acceso publico.
- Admin se define por `public.admin_users` y la funcion privada `private.is_admin()`.
- El bootstrap inicial debe hacerse desde backend con `ADMIN_BOOTSTRAP_EMAILS` y clave elevada server-side.

## Proximo corte tecnico

1. Crear los clientes de Supabase usando `@supabase/supabase-js` y `@supabase/ssr`, ya instalados en el proyecto.
2. Crear clientes separados:
   - browser/client con publishable key para lectura publica y auth.
   - server/admin con secret key o service role solo en server runtime.
3. Implementar callback de auth y bootstrap admin.
4. Reemplazar mock de catalogo por repositorio Supabase con fallback controlado durante desarrollo.
