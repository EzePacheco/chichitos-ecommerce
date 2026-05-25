# Chichitos — Design System

> Boutique de ropa infantil estampada con DTF, con diseños propios, hecha en Argentina.
> _"Hecha para jugar, lista para soñar."_

---

## Contexto de marca

**Chichitos** es un ecommerce de indumentaria infantil estampada con tecnología DTF (Direct-To-Film). Lo que la distingue:

- **Diseños propios** — la dueña ilustra y estampa todo. Cada prenda es autoría suya.
- **Configurable** — los clientes eligen prenda, talle, color, diseño y opcionalmente personalización (un nombre, una fecha).
- **Canal mixto** — checkout online completo con Mercado Pago + WhatsApp como vía de consulta humana.
- **Tono argentino, cálido, sin infantilizar de más** — habla a madres, padres, abuelas, tíos que regalan. No le habla a los chicos directamente.

### Productos representados

1. **Chichitos Store** — ecommerce responsive público (home, catálogo, producto, carrito, checkout).
2. **Chichitos Admin** — panel simple para la emprendedora (productos, diseños, pedidos, configuración).

### Fuentes consultadas

- Logos de marca subidos por la usuaria (3 archivos JPEG, guardados en `assets/`).
- Brief escrito por la dueña describiendo objetivos, pantallas y estilo visual deseado.
- No se proporcionó codebase ni Figma — el sistema visual se construyó desde el logo, el tagline y la dirección estilística pedida ("boutique infantil creativa, no SaaS corporate").

---

## Content fundamentals — cómo escribimos

**Idioma**: Español rioplatense neutro. Sin voseo agresivo pero permitido en CTAs ("Llevátelo", "Conocé"). Sin "tú".

**Tono**:
- Cálido, cercano, hecho a mano. No es marketing-speak ni corporate.
- Habla _de_ los chicos, no _a_ los chicos. El comprador es adulto.
- Pequeñas notas afectivas, no diminutivos cursis. Decimos _"prendas que duran"_ no _"prenditas hermosositas"_.
- Honesta sobre lo artesanal: producción a pedido, tiempos de entrega, autoría propia.

**Casing**:
- Títulos en _sentence case_ ("Diseños que se imprimen para vos"), no Title Case.
- _Eyebrows_ y micro-categorías en MAYÚSCULAS con tracking amplio ("HECHA PARA JUGAR").
- CTAs primarios en sentence case ("Comprar online", "Sumar al carrito").

**Persona**:
- "Vos" para hablarle al cliente: _"Elegí el talle, color y diseño que más te guste."_
- "Nosotros" para la marca: _"Lo imprimimos a pedido en nuestro taller."_
- Nunca "tú" ni "usted".

**Emoji**: muy puntuales, casi nunca. Si aparecen, son ✨ 🌤️ ☁️ ★ — vinculados al universo del logo. Nada de 🛒 🔥 💯.

**Ejemplos de copy real**

| Contexto | ✅ Sí | ❌ No |
|---|---|---|
| Hero | "Ropa infantil con alma de taller" | "¡Las mejores remeras para niños!" |
| Producto | "Estampa hecha a pedido en nuestro taller" | "Producto premium de alta calidad" |
| Empty cart | "Tu carrito todavía no tiene nada. Vamos a empezar." | "Carrito vacío" |
| WhatsApp CTA | "Consultar por WhatsApp" | "¡Click acá!" |
| Error | "Algo no salió. ¿Probamos de nuevo?" | "Error 500" |
| Loading | "Buscando diseños…" | "Cargando…" |

**Frases ancla de la marca**:
- "Hecha para jugar, lista para soñar." _(tagline)_
- "Diseños propios, estampados a pedido."
- "Hecha en Argentina, a mano, con tiempo."

---

## Visual foundations

### Paleta

Inspirada en un atelier infantil: **crema algodón** como base (heredado del fondo del logo), tinta cálida, y acentos boutique. **No usamos blanco puro ni violeta SaaS.**

- **Base cálida**: `--cream-50` `#FCF7EC` · `--cream-100` `#F7EFE0` · `--cream-200` `#EFE3CE`
- **Tinta**: `--ink-900` `#1F1A14` (el negro cálido del logo), `--ink-500` `#6B5E52` secundario
- **Acentos**:
  - 🍑 **Durazno** `#F5C9A8` — superficies cariñosas, badges suaves
  - 🌿 **Salvia** `#B4C9A4` — frescura, naturaleza, "nuevo"
  - ☁️ **Celeste lavado** `#B7D2E6` — heredado de la nubecita del logo
  - 🌅 **Coral** `#E08868` — CTA principal, llamados a la acción cálidos
  - 🌻 **Mostaza** `#E4B254` — destacar diseños, etiquetas amarillas
- **Semánticos**: éxito = salvia oscuro, peligro = `#B84A35` (rojo terracota, no rojo señalético).

> Regla: en una pantalla normal, **70% crema · 20% tinta · 10% acentos**. Si aparece más de un acento brillante a la vez (coral + mostaza), tiene que ser intencional.

### Tipografía

- **Display (titulares editoriales)** — `DM Serif Display`. Serif suave, alto contraste, juguetón sin ser cómico. Para H1/H2 grandes de hero y secciones.
- **Sans (cuerpo + UI)** — `Outfit`. Geométrica, redondeada, legible. 300-800 disponible. Reemplaza a Inter/Roboto.
- **Script (acento)** — `Caveat`. Para guiños hand-lettered ("¡nuevo!", "hola"), no para texto largo.

> ⚠️ **Nota al cliente**: estas 3 familias son **Google Fonts** elegidas como mejor aproximación a la dirección visual pedida. Si tenés fuentes propias compradas (Recoleta, Larken, Sniglet, etc), pasámelas para reemplazarlas. La fuente del logo en sí es hand-lettering — se queda como ilustración (JPEG), no como tipografía.

### Backgrounds

- **Fondo principal**: crema `--cream-100`, plano. **Nunca blanco puro.**
- **Superficies elevadas (cards)**: `--surface` `#FFFDF7` (un poco más claro que la base).
- **Bloques de sección**: alternamos `cream-100`, `cream-200`, y un acento muy lavado (durazno o salvia al 30%) para dar ritmo editorial.
- **Sin gradientes lineales bluish-purple**. Si hay gradiente, es radial suave de un acento al crema.
- **Texturas**: pueden aparecer sutiles "speckles" o grano de papel reciclado en heros grandes. Nunca patrones repetitivos vectoriales pesados.

### Bordes, radios y formas

- **Radios**: orgánicos pero contenidos. `--r-md 14px` para inputs, `--r-xl 28px` para cards, `--r-pill` para botones y chips.
- **Borde**: 1px sólido `--line` (`#E6D9C2`, crema oscurecido) — invisible pero presente. Para garment-tags, 1px **dashed** `--sand-400`.
- **Forma blob**: `border-radius: 62% 38% 55% 45% / 50% 60% 40% 50%` para spots ilustrativos detrás de imágenes destacadas.

### Sombras

Cálidas, nunca azules. Base en `rgba(63, 47, 28, x)` (tinta tostada).

- `--sh-xs` invisible casi, divisor sutil
- `--sh-sm` cards en reposo
- `--sh-md` cards en hover
- `--sh-lg` overlays, modales
- `--sh-focus` halo coral al 35% — accesible y on-brand

### Movimiento

- **Duración base** 220ms. Hover rápido (140ms), modal lento (380ms).
- **Easing**: `--ease-out` para la mayoría. `--ease-bounce` _solo_ en micro-confirmaciones (added-to-cart, like).
- Fades + ligero `translateY(4px)` en entrada. Nunca rotación dramática ni parallax exagerado.
- **No autoplay carousels** salvo en hero (con pause on hover).

### Estados interactivos

- **Hover sobre botón oscuro**: aclarar mezclando con blanco (`color-mix(in oklab, ink 86%, white)`).
- **Hover sobre botón coral**: pasar a `--coral-d`.
- **Press**: `transform: scale(0.97)`, sin cambio de color.
- **Focus**: halo coral 3px (`--sh-focus`), siempre visible (no removemos outline).
- **Hover sobre card de producto**: `translateY(-4px)` + sombra crece de `sm` a `md`.

### Layout

- Mobile-first. Container max `1200px`, padding lateral `24px` mobile / `32px` desktop.
- Grid de catálogo: 2 col mobile, 3 col tablet, 4 col desktop.
- Header **sticky** sólo en mobile (se compacta al scrollear). En desktop es estático.
- WhatsApp flotante: bottom-right, `24px` del borde, **no invasivo** (se desvanece al 60% mientras se hace scroll hacia abajo, vuelve al 100% al detenerse o scrollear hacia arriba).

### Imagen

- **Foto de producto**: fondo crema o textil de cerca. Nunca fondo gris estudio frío. Composiciones tipo flatlay editorial.
- **Tono cálido**, ligero grano, contraste suave. NO blanco y negro, NO saturación extrema.
- **No fotos de chicos reales** — usar maniquíes, flatlays, mockups textiles, ilustraciones.
- Placeholders: silueta de prenda + manchita de color del diseño, sobre crema.

### Transparencia y blur

- Backdrop blur _muy puntual_: solo en header sticky de mobile cuando está sobre imagen (`backdrop-filter: blur(8px)` + `bg: rgba(247,239,224,0.85)`).
- Sin glass-morphism general.

---

## Iconografía

**Approach**: línea fina, redondeada, hand-drawn-feel pero geométrica. Stroke 1.75-2px, line-cap round, line-join round.

- **Set elegido**: **Lucide** (vía CDN: `https://unpkg.com/lucide@latest`). Mejor match al estilo "marker amable" del logo. Stroke uniforme, esquinas suaves.
  - ⚠️ Sustitución frente a "iconos propios": Chichitos no tiene un sistema de iconos propio aún. Lucide se eligió como reemplazo seguro y consistente con la línea del logo. Si después la dueña quiere ilustrarse los suyos, los cambiamos uno a uno.
- **Iconos clave en uso**: `shopping-bag`, `heart`, `search`, `menu`, `x`, `plus`, `minus`, `chevron-right`, `star`, `cloud`, `sparkles`, `truck`, `package`, `credit-card`, `whatsapp` (este último custom — ver `assets/icon-whatsapp.svg`).
- **Tamaños estándar**: 16, 20, 24 px. Stroke siempre 1.75.
- **Color por defecto**: `currentColor`. En estados normales heredan `--ink-700`.

**Emoji**: prácticamente no se usan en UI. Sólo aparecen en marketing/social ocasional, y limitados a `✨ ☁️ ★ 🌤️`. Nunca 🛒/🔥/💯 que rompen el tono.

**Unicode chars como iconos**: el `★` aparece como referencia al logo (estrella sobre la "i") en separadores decorativos. El `•` se usa entre metadatos.

**Logos** (PNG con transparencia real, procesados desde los JPEGs originales):
- `assets/logo-chichitos-dark.png` — versión oscura. Default web sobre cualquier fondo claro.
- `assets/logo-chichitos-white.png` — versión clara para fondos oscuros (footer, admin, hero ink).
- `assets/logo-chichitos-full.png` — versión completa con tagline + nubecita + estrellita celeste. Para hero y materiales hero/marketing.
- Los JPEGs originales se conservan en `assets/` por si los necesitás como referencia.

---

## Índice de archivos

```
/
├── README.md                     ← este archivo
├── SKILL.md                      ← cómo usar este sistema (Claude Code / agentes)
├── colors_and_type.css           ← tokens CSS, fuentes, semánticos
├── assets/
│   ├── logo-chichitos-dark.png    (+ .jpeg original)
│   ├── logo-chichitos-white.png   (+ .jpeg original)
│   └── logo-chichitos-full.png    (+ .jpeg original)
├── preview/                      ← cards del Design System tab
│   ├── colors-base.html
│   ├── colors-accents.html
│   ├── typography-display.html
│   ├── typography-body.html
│   └── ...
└── ui_kits/
    └── chichitos-store/
        ├── README.md
        ├── index.html            ← prototipo click-thru
        ├── Home.jsx
        ├── Catalog.jsx
        ├── Product.jsx
        ├── Cart.jsx
        ├── Checkout.jsx
        ├── Admin.jsx
        └── components.jsx        ← Header, Footer, ProductCard, Button, etc.
```

---

## Caveats actuales

- **Fuentes**: las 3 elegidas son Google Fonts (mejor aproximación al brief). Si tenés Recoleta / Larken / similar compradas, mandalas.
- **Iconos**: usamos Lucide como sistema base. No hay sistema propio aún.
- **Fotografía**: el UI kit usa placeholders ilustrados (silueta de prenda + blob de color del diseño). Cuando tengas flatlays reales, los swappeamos.
- **Sin pasarela real**: el flow de Mercado Pago es un mock visual. Para integración real, contemplá `mercadopago-sdk-react`.
- **Sin medición de distancia real para envío**: el cálculo "hasta 3km fijo, después +$X cada 0.5km" se simula con un slider en checkout. Para producción, integrar Google Maps Distance Matrix o similar.
