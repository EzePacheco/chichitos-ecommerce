# SPEC-007 - Límites EOS y reutilización en editores Admin

## Estado

- **Estado:** IMPLEMENTADA
- **Fecha de archivo:** 2026-07-30
- **Objetivo:** corregir límites de módulos y consolidar comportamiento repetido
  en los editores de productos, diseños y configuración sin cambiar contratos
  productivos.

## Alcance

- Superficie pública pura de Catalog para contratos consumidos por Admin y
  servidor.
- Modelos de borrador de productos y diseños bajo `features/admin/model`.
- Política y carga compartidas para una única imagen de catálogo.
- Campo de imagen, layout de preview y secciones de configuración reutilizados
  dentro de Admin.

## No alcance

- Nuevas rutas, dependencias, APIs, tablas, migraciones o eliminación de imágenes
  persistidas.
- Cambios a autenticación, checkout, pagos, stock o navegación pública.
- Promover componentes dependientes del feedback Admin a `shared/ui`.

## Criterios de aceptación

- Catalog no depende de Admin y los consumidores externos usan
  `@/features/catalog/public`.
- Productos y diseños validan y suben imágenes con una política y un adaptador
  únicos, conservando mensajes actuales.
- Cancelar una selección nueva restaura la imagen persistida y no filtra URLs
  `blob:`.
- Las variantes desktop/mobile de preview tienen IDs únicos.
- Todos los importes editables del Admin muestran `$` antes del valor sin
  alterar el dato enviado.
- Los modelos de borrador y resolución por hash tienen pruebas unitarias.
- Configuración conserva navegación, validaciones, confirmación y guardado.
- Los editores no desbordan horizontalmente a 360 px y conservan el layout
  desktop sin scroll de página en los viewports acordados.

## Verificación

- Tests unitarios focales.
- ESLint focal y completo.
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Browser E2E de los tres flujos Admin.
- `git diff --check`

## Cierre

El resultado quedó promovido a código, tests y `docs/architecture.md`. La
restauración visual de una imagen persistida está implementada, pero el entorno
local no ofreció registros editables con imagen para repetir ese caso contra
datos reales.
