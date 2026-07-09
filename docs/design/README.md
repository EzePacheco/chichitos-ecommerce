# Diseño - Chichitos Web

Esta carpeta guarda la fuente visual vigente y el historial de handoffs de
diseño. Antes de cambiar dirección visual, revisar este archivo y
`docs/design/chichitos-visual-brief.md`.

## Fuentes vigentes

- `docs/design/chichitos-visual-brief.md` - brief visual base.
- `public/brand/` - logos usados por la app real.
- `src/app/globals.css` y `src/shared/ui/design-system.tsx` - tokens y
  componentes visuales implementados.

## Histórico

- `docs/design/archive/2026-05-25-chichitos-system/` - bundle exportado de
  Claude Design con chats, UI kit, previews, assets y prototipos. Es referencia
  histórica, no autoridad de producción por sí sola.

## Reglas

- No guardar secretos, PII ni datos de clientes.
- Si un asset pasa a producción, moverlo a `public/brand/` u otra ruta pública
  explícita y actualizar el código.
- Archivos nuevos sin clasificar pueden entrar en `docs/design/inbox/`, pero
  deben moverse a `references/`, `archive/` o producción cuando se confirme su
  rol.
