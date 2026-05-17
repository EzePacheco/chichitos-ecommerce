# ADR-0002: Supabase Postgres y Auth admin con Google

- **Estado:** accepted
- **Fecha:** 2026-05-17
- **Decisores:** Chichitos, desarrollo
- **Unidad:** chichitos-web
- **Supersede:** no aplica
- **Superseded by:** no aplica

## Contexto

Chichitos Web necesita persistencia para catalogo, disenos, pedidos, pagos, configuracion comercial y datos del admin. Tambien necesita autenticacion para un panel administrativo simple.

El MVP debe mantener bajo costo operativo y velocidad de implementacion, pero sin perder una base solida para evolucionar a stock por variante, roles mas finos, auditoria y consultas operativas.

La emprendedora quiere administrar con una cuenta Gmail/Google. El sitio no requiere cuentas de cliente en el MVP.

## Alternativas evaluadas

1. **Supabase Postgres + Supabase Auth con Google**
   - Pros: Postgres administrado, Auth integrada, soporte para login con Google, Row Level Security, buen encaje con Next.js server-side.
   - Contras: dependencia de plataforma y necesidad de configurar politicas correctamente.
   - Resultado: elegida.

2. **Postgres administrado separado + Auth propia**
   - Pros: mayor control y menor acoplamiento a una plataforma.
   - Contras: mas implementacion, mas seguridad propia, mas superficie operativa para un MVP.
   - Resultado: descartada por costo inicial.

3. **SQLite/local DB o archivo JSON inicial**
   - Pros: muy simple para prototipo.
   - Contras: no sirve bien para compra online real, webhooks, concurrencia, admin y despliegue productivo.
   - Resultado: descartada por no ser suficiente para ecommerce.

4. **Auth propia con email/password**
   - Pros: control total.
   - Contras: implica gestionar passwords, recovery, hardening y riesgo de seguridad innecesario para admin simple.
   - Resultado: descartada para el MVP.

## Decision

Usaremos Supabase como proveedor inicial de base de datos Postgres y autenticacion.

El admin usara login con Google/Gmail mediante Supabase Auth. El acceso administrativo no se concedera a cualquier cuenta Google autenticada: debe existir una allowlist o un rol admin persistido server-side. Las operaciones administrativas se validaran en backend y no dependeran solo del estado del cliente.

## Consecuencias

- **Positivas:** acelera el MVP con Postgres administrado, Auth integrada y una ruta clara para Next.js server-side.
- **Positivas:** permite evolucionar el modelo hacia stock por variante, historial de pedidos y configuracion comercial sin cambiar de motor.
- **Positivas:** reduce el riesgo de implementar passwords propios.
- **Negativas:** introduce dependencia de Supabase como plataforma.
- **Negativas:** exige configurar correctamente variables de entorno, redirect URLs, dominio y politicas de acceso.
- **Deuda introducida:** el MVP puede empezar con un modelo admin simple; roles avanzados, auditoria detallada y permisos granulares quedan para una etapa posterior.
- **Seguridad:** Row Level Security debe estar habilitada en tablas expuestas; las rutas server-side deben validar rol admin antes de mutar datos.
- **Operacion:** se debe configurar Google OAuth, Site URL, Redirect URLs y cuentas autorizadas antes de produccion.

## Como se revierte o migra si falla

- **Plan:** mantener acceso a datos a traves de repositorios internos; si Supabase deja de convenir, migrar Postgres a otro proveedor y reemplazar Auth por otro proveedor compatible con OAuth.
- **Plan:** evitar dependencias directas a Supabase en componentes visuales; centralizar clientes y queries.
- **Senales:** costos no aceptables, limites de plataforma, necesidad de auth/roles no soportados por el modelo elegido o requerimientos operativos incompatibles.
- **Costo cualitativo:** moderado si el acceso a datos y auth quedan encapsulados; costoso si Supabase queda acoplado en toda la UI.

## Referencias

- Supabase Database: https://supabase.com/docs/guides/database/overview
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Server-Side Auth: https://supabase.com/docs/guides/auth/server-side
- Supabase Auth con Google: https://supabase.com/docs/guides/auth/social-login/auth-google

