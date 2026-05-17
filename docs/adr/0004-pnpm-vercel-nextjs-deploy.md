# ADR-0004: pnpm y Vercel para build y despliegue

- **Estado:** accepted
- **Fecha:** 2026-05-17
- **Decisores:** Chichitos, desarrollo
- **Unidad:** chichitos-web
- **Supersede:** no aplica
- **Superseded by:** no aplica

## Contexto

Chichitos Web necesita un flujo reproducible para instalar dependencias, construir la app Next.js y desplegar previews/produccion con bajo costo operativo.

El proyecto sera un single-app Next.js full-stack. No hay monorepo ni necesidad actual de infraestructura propia.

## Alternativas evaluadas

1. **pnpm + Vercel**
   - Pros: lockfile reproducible, installs rapidos, buen encaje con Next.js, Vercel detecta Next.js y pnpm por `pnpm-lock.yaml`.
   - Contras: dependencia de Vercel para hosting y funciones serverless.
   - Resultado: elegida.

2. **npm + Vercel**
   - Pros: menor friccion universal.
   - Contras: installs mas lentos y menor control de workspace/dependencias que pnpm.
   - Resultado: descartada por preferencia tecnica del proyecto.

3. **pnpm + VPS/Docker**
   - Pros: mas control de infraestructura.
   - Contras: mayor operacion, backups, runtime, TLS, despliegue y monitoreo a cargo del equipo.
   - Resultado: descartada para el MVP.

4. **Plataforma ecommerce SaaS**
   - Pros: hosting y operacion simplificados.
   - Contras: contradice la decision de web propia y modelo extensible.
   - Resultado: descartada por ADR-0001.

## Decision

Usaremos pnpm como package manager del repo y Vercel como plataforma inicial de hosting/deploy.

El repositorio debe versionar `pnpm-lock.yaml` y declarar el package manager en `package.json`. Los comandos base seran `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`.

Vercel debe usar el preset de Next.js y detectar pnpm desde el lockfile. Las variables de entorno y secretos se configuraran por ambiente en Vercel, Supabase, Mercado Pago y Google Cloud, no en el repositorio.

## Consecuencias

- **Positivas:** setup simple, previews por branch, buen soporte para Next.js full-stack y bajo costo operativo inicial.
- **Positivas:** `pnpm-lock.yaml` mejora reproducibilidad local/CI/deploy.
- **Negativas:** dependencia operativa de Vercel y sus limites de funciones, builds y pricing.
- **Negativas:** si el backend crece hacia jobs largos o procesos persistentes, puede requerir una plataforma adicional.
- **Operacion:** Vercel debe tener variables separadas para preview y produccion.
- **Seguridad:** `.env` no se versiona; `.env.example` documenta solo nombres y placeholders.

## Como se revierte o migra si falla

- **Plan:** mantener la app Next.js portable para poder moverla a otro host compatible con Node.js.
- **Plan:** evitar dependencias especificas de Vercel salvo que se justifiquen por ADR.
- **Plan:** si el backend requiere procesos largos, evaluar worker externo o backend separado.
- **Costo cualitativo:** bajo para cambiar de package manager al inicio; moderado para migrar hosting si se usan capacidades especificas de Vercel.

## Referencias

- Next.js create-next-app: https://nextjs.org/docs/app/api-reference/cli/create-next-app
- Next.js App Router: https://nextjs.org/docs/app
- Vercel builds y deteccion de package manager: https://vercel.com/docs/fundamentals/builds
- Vercel project settings: https://vercel.com/docs/project-configuration/project-settings
