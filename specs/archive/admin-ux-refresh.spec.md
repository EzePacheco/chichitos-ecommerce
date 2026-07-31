# SPEC-006 - UX integral del panel admin

## Estado

- **Estado:** IMPLEMENTADA
- **Objetivo:** hacer que todas las rutas `/admin` sean consistentes, claras y
  eficientes para la operación diaria, preservando marca, rutas y seguridad.

## Alcance

- Login, shell, dashboard, pedidos, productos, diseños y configuración.
- Desktop como superficie principal; mobile funcional desde 360 px.
- Errores por campo y resumen accesible, estados de carga/vacío/error/éxito,
  feedback persistente y toasts de confirmación.
- Editor de producto en una página con secciones guiadas y preview contextual.
- Búsqueda y filtros de recursos; pedidos paginados.
- Diálogos sólo para acciones con consecuencias.

## No alcance

- Cambios de esquema, permisos, pagos, precios, stock o rutas públicas.
- Una aplicación admin separada, store global o framework UI/formularios nuevo.
- Preview idéntico a la tienda pública.
- Deploy, migración, publicación o cambios de infraestructura.

## Decisiones

- Evolucionar `AdminActionForm` y los componentes actuales sin dependencias nuevas.
- Mantener validación y autorización server-side.
- Usar feedback inline para errores y advertencias; reservar toast para éxitos
  breves después de una navegación.
- Mantener formularios largos en páginas dedicadas.
- Preservar el sistema visual vigente y aumentar densidad sólo en superficies
  operativas.

## Criterios de aceptación

- Cada campo comunica claramente si es obligatorio u opcional y muestra ayuda
  persistente cuando requiere formato.
- Un submit inválido conserva valores, enfoca el resumen y enlaza al campo o
  sección correspondiente.
- Fallas inesperadas muestran un mensaje seguro y un identificador de soporte.
- Éxitos de productos, diseños, pedidos y configuración usan el mismo toast y no
  se repiten al recargar.
- Listados distinguen loading, vacío inicial, sin coincidencias y error.
- Pedidos permite buscar, filtrar y paginar sin perder el estado en la URL.
- Productos y diseños tienen preview contextual derivado del borrador.
- Pago continúa read-only y cancelar pedidos requiere confirmación.
- Ninguna ruta admin tiene overflow horizontal de página a 360 px.
- Navegación, formularios, diálogos y feedback funcionan con teclado y lector de
  pantalla.

## Verificación

- Unit tests de parsers, contrato de errores, filtros, paginación y preview.
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Browser E2E en 1440x900, 768x1024 y 360x800 con auth staging cuando esté
  disponible.

## Cierre

El comportamiento quedó promovido a código y tests. La verificación local cubrió
login, redirección de acceso, desktop y mobile; las rutas autenticadas requieren
una sesión admin válida para su E2E visual.
