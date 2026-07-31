# Brief visual - Chichitos Web

## Objetivo

Generar propuestas visuales para un ecommerce de ropa infantil estampada con DTF, con disenos propios, compra online completa y una identidad calida, creativa y confiable.

## Prompt base para v0 / herramientas de diseno

```text
Disena una web ecommerce responsive para "Chichitos", una marca argentina de ropa infantil estampada con DTF y disenos propios.

Objetivo del sitio:
- Vender online ropa infantil configurable por talle, color y diseno.
- Transmitir ternura, creatividad artesanal, confianza y calidad.
- Mostrar que los disenos son de autoria propia.
- Incluir WhatsApp como canal de consulta, pero mantener checkout online completo.

Estilo visual:
- Calido, jugueton y cuidado, sin parecer generico ni infantilizado en exceso.
- Evitar estetica corporate SaaS.
- Evitar paleta violeta generica y fondos blancos planos.
- Usar una direccion visual tipo boutique infantil creativa: texturas suaves, formas organicas, detalles de estampa, ilustraciones sutiles, etiquetas tipo prenda y composiciones editoriales.
- Paleta sugerida: crema algodon, durazno suave, verde salvia, celeste lavado, acentos coral o mostaza.
- Tipografia con personalidad: una serif suave o display amable para titulos y una sans legible para textos. Evitar Inter/Roboto/Arial como primera opcion.

Pantallas requeridas:
1. Home:
   - Hero con propuesta de valor clara.
   - CTA principal "Comprar online".
   - CTA secundario "Consultar por WhatsApp".
   - Bloque de productos destacados.
   - Bloque "Disenos propios estampados en DTF".
   - Bloque de como comprar: elegir prenda, elegir talle/color/diseno, pagar, recibir o retirar.

2. Catalogo:
   - Grid de productos.
   - Filtros por prenda, talle, color y tipo de diseno.
   - Cards con imagen, precio base y etiqueta si admite personalizacion.

3. Producto:
   - Galeria de imagenes.
   - Selector de talle.
   - Selector de color.
   - Selector de diseno.
   - Opcion de personalizacion con costo extra.
   - Guia de talles visible.
   - CTA agregar al carrito.
   - CTA consultar por WhatsApp con producto prellenado.

4. Carrito:
   - Items con snapshot de producto, talle, color, diseno, personalizacion y cantidad.
   - Subtotal, costo de envio/retiro y total.
   - CTA checkout.

5. Checkout:
   - Datos del comprador.
   - Metodo de entrega: retiro o envio.
   - Envio calculado por distancia: hasta 3 km precio fijo, luego incremento por cada 0.5 km.
   - Pago con Mercado Pago.

6. Admin simple:
   - Dashboard limpio para la emprendedora.
   - Productos, disenos, pedidos y configuracion comercial.
   - Editor simple de politicas de cambios/devoluciones.
   - Estados de pedido: nuevo, en produccion, listo, enviado, completado, cancelado.

Componentes clave:
- Header con logo, catalogo, como comprar, WhatsApp y carrito.
- Floating WhatsApp button no invasivo.
- Product cards con imagen grande y etiquetas suaves.
- Empty states cuidados.
- Estados de loading/error accesibles.
- Footer con politicas, contacto, medios de pago y entrega.

Requisitos UX:
- Mobile-first.
- Accesible, con buen contraste y foco visible.
- Checkout simple, de pocos pasos.
- No usar imagenes reales de menores; usar placeholders de prendas, estampas o mockups textiles.
- El resultado debe sentirse como una marca real, no como template generico.

Entregable:
- Propuesta visual completa con home, catalogo, producto, carrito, checkout y admin simple.
- Componentes reutilizables.
- Tokens de color, tipografia, radios, sombras y espaciado.
```

## Pendientes de marca

- Logo.
- Paleta final.
- Fotografias o mockups de prendas.
- Guia de talles.
- Tono de voz.
- Numero de WhatsApp Business.

## Criterios vigentes para el panel admin

- Desktop es la superficie operativa principal; mobile debe conservar todos los
  flujos desde 360 px sin desborde horizontal.
- Mantener la identidad cálida de Chichitos y aumentar la densidad sólo en
  navegación, tablas y controles operativos.
- Formularios largos viven en páginas dedicadas, organizados por tarea y con
  preview contextual cuando la edición modifica una pieza visual.
- Cada campo indica si es obligatorio u opcional. Los errores quedan visibles
  junto al campo y en un resumen accesible; las advertencias no desaparecen.
- Los toasts se reservan para confirmaciones breves. Acciones con consecuencias
  requieren una confirmación explícita y contextual.
