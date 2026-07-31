# Ownership de diseños del catálogo

- Estado: pendiente
- Riesgo: medio

## Problema confirmado

`save_catalog_product_atomic` inserta o actualiza registros maestros de
`designs` al guardar un producto. En un conflicto por `slug`, reemplaza nombre,
resumen, estado y orden, y fuerza el diseño a `active`.

Esto permite que el editor de Productos reactive o reordene un diseño que fue
archivado o administrado desde Diseños, por lo que existen dos owners para la
misma visibilidad pública.

La evidencia vigente está en
`src/supabase/migrations/20260708190000_spec005_payment_stock_hardening.sql`.

## Resultado esperado

Admin Diseños es el único owner del contenido maestro, estado y orden público de
un diseño. Guardar un producto sólo administra la asociación
`product_designs`, su extra y su orden dentro del producto.

## Alcance

- Crear una migración versionada que reemplace `save_catalog_product_atomic`.
- Resolver diseños asociados por identificador estable sin modificar sus datos
  maestros.
- Rechazar asociaciones inexistentes o no permitidas con un error explícito.
- Mantener atomicidad para producto, opciones, stock y asociaciones.
- Actualizar el command de producto si cambia el payload interno.

## Aceptación

- Guardar un producto no cambia nombre, resumen, estado ni orden global de un
  diseño.
- Un diseño archivado no puede reactivarse desde Productos.
- Asociar, desasociar y ordenar diseños dentro de un producto sigue funcionando.
- Las pruebas cubren diseño activo, archivado, inexistente y rollback atómico.
- La migración tiene rollback documentado y se valida primero fuera de
  producción.
