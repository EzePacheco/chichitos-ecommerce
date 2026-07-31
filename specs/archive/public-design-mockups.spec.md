# Diseños públicos y mockup de producto

## Resultado

Los diseños activos cargados desde Admin aparecen con su imagen real en Home y
en el selector del producto. La selección actualiza un mockup frontal de la
categoría y del color elegidos.

## Alcance

- Consulta pública de hasta ocho diseños activos con imagen.
- Miniaturas reales con fallback para diseños históricos sin imagen.
- Mockup 2D por categoría sobre las prendas ilustradas existentes.
- Foto cargada del producto conservada como referencia real, sin simular
  perspectiva sobre una imagen arbitraria.
- Logo público con tamaño visual consistente.

## Fuera de alcance

- Fotomontaje sobre fotos arbitrarias.
- Posición, escala o rotación administrable por producto.
- Migraciones y dependencias nuevas.

## Aceptación

- Home no usa íconos fijos cuando existen diseños activos con imagen.
- Cambiar diseño o color actualiza el mockup.
- La foto real no genera miniaturas inventadas.
- Diseños sin imagen y errores de carga conservan un fallback honesto.
- El flujo funciona con teclado y no desborda a 360 px.

## Cierre

Implementado y verificado el 2026-07-30.
