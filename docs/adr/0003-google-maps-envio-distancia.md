# ADR-0003: Google Maps Platform para direccion y distancia de envio

- **Estado:** accepted
- **Fecha:** 2026-05-17
- **Decisores:** Chichitos, desarrollo
- **Unidad:** chichitos-web
- **Supersede:** no aplica
- **Superseded by:** no aplica

## Contexto

Chichitos necesita calcular costo de envio segun distancia desde la tienda: hasta 3 km aplica un precio fijo y, superado ese radio, el precio aumenta por cada tramo adicional de 0.5 km.

La direccion/origen de la tienda y los valores de envio deben poder configurarse desde el panel admin. Para reducir errores de direccion y calcular distancia de forma consistente, se evalua integrar Google Maps Platform.

## Alternativas evaluadas

1. **Google Maps Platform con Places/Autocomplete y calculo server-side de distancia**
   - Pros: mejor UX al cargar direcciones, normalizacion de ubicaciones, calculo de distancia mas confiable que texto libre.
   - Contras: requiere cuenta Google Cloud con billing, restricciones de API keys, control de costos y manejo de cuotas.
   - Resultado: elegida.

2. **Direccion manual + distancia declarada por el comprador o admin**
   - Pros: implementacion simple y sin proveedor externo.
   - Contras: propensa a errores, manipulable y mala UX para checkout.
   - Resultado: viable como fallback operativo, no ideal para compra online completa.

3. **Tabla manual por zonas/barrios**
   - Pros: control total de costos y simple de entender para la emprendedora.
   - Contras: menos precisa, requiere mantenimiento manual y no sigue naturalmente la regla por kilometros.
   - Resultado: descartada como regla principal, puede servir como fallback futuro.

## Decision

Usaremos Google Maps Platform para asistir carga de direcciones y calcular distancia de envio.

El admin configurara direccion/origen de tienda, precio fijo hasta 3 km e incremento por cada 0.5 km adicional. El checkout usara direccion de envio del comprador para calcular distancia server-side y obtener el costo aplicable. Las API keys se restringiran por uso y entorno; los calculos de precio finales ocurriran en backend.

Debe existir fallback operativo para cuando Google Maps no pueda resolver una direccion, no responda o el costo operativo obligue a pausar la integracion.

## Consecuencias

- **Positivas:** mejora UX, reduce errores de direccion y permite automatizar el costo de envio.
- **Positivas:** mantiene la regla comercial configurable desde admin.
- **Negativas:** introduce dependencia externa y posible costo variable.
- **Negativas:** requiere manejo cuidadoso de API keys, cuotas y errores del proveedor.
- **Deuda introducida:** definir fallback si Google Maps no responde o si el costo excede lo aceptable.
- **Seguridad:** la clave publica de mapas debe estar restringida por dominio; claves server-side deben estar solo en variables de entorno.
- **Operacion:** se necesita monitorear uso/costo y configurar alertas de billing.

## Como se revierte o migra si falla

- **Plan:** reemplazar calculo automatico por tabla de zonas o carga manual de costo de envio desde admin.
- **Plan:** mantener el calculo de envio encapsulado en un servicio interno para cambiar proveedor sin tocar checkout completo.
- **Senales:** costo excesivo, errores frecuentes de geocoding/routing, mala cobertura local o friccion operativa con Google Cloud.
- **Costo cualitativo:** moderado si se encapsula el servicio de distancia; costoso si la integracion queda acoplada a componentes de UI.

## Referencias

- Google Maps Platform - Routes API: https://developers.google.com/maps/documentation/routes
- Google Maps Platform - Places Autocomplete: https://developers.google.com/maps/documentation/javascript/place-autocomplete
- Google Maps Platform - Geocoding API: https://developers.google.com/maps/documentation/geocoding
- Google Maps Platform - API Security Best Practices: https://developers.google.com/maps/api-security-best-practices
