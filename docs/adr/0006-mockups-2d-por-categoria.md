# ADR-0006: Mockups 2D por categoría

- Estado: accepted
- Fecha: 2026-07-30

## Contexto

El catálogo ya guarda imágenes de diseños y categorías de producto, pero la
tienda pública mostraba ilustraciones fijas sin relación con esos datos. Una
foto de producto puede tener encuadre, perspectiva y pliegues desconocidos, y
el modelo actual no guarda un área de impresión por producto.

## Alternativas

1. Superponer el diseño en cualquier foto de producto con una posición fija.
   Es simple, pero produce resultados incorrectos fuera de fotos frontales
   preparadas específicamente.
2. Crear un mockup 2D frontal por categoría y aplicar la imagen del diseño en un
   área de impresión determinista.
3. Agregar edición de posición, escala, máscara y perspectiva por producto.
   Da mayor fidelidad, pero requiere persistencia, UI y validaciones nuevas.

## Decisión

Usar mockups 2D frontales por categoría con color y diseño seleccionados. La
foto real del producto se conserva como referencia independiente. Las imágenes
de diseño se ajustan dentro de un área de impresión fija sin deformar su
proporción.

## Consecuencias

- La selección responde en el navegador sin canvas, servicios ni dependencias.
- PNG o WebP con transparencia producen el mejor resultado; imágenes con fondo
  conservan ese fondo.
- Sets y accesorios usan el template genérico existente hasta contar con una
  necesidad concreta de templates propios.
- La composición fotográfica y el placement administrable quedan fuera de este
  contrato.

## Reversibilidad

La decisión afecta sólo el render público. Puede reemplazarse por placements
persistidos sin migrar los datos actuales de diseños o productos.
