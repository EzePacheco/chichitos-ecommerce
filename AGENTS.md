# Repository Instructions

## Scope and authority

This repository is the authority for Chichitos Web runtime behavior, contracts,
schema migrations, tests, accepted ADRs and operational documentation. Start at
`LLM_CONTEXT.md` and follow only the sources relevant to the task.

## Working rules

- Preserve unrelated local changes and inspect the diff before editing.
- Keep `src/app` routes thin; route composition belongs in `src/screens`.
- Keep product capabilities in `src/features`, reusable product-agnostic code in
  `src/shared`, infrastructure adapters in `src/platform`, and server use cases
  in `src/server`.
- Never import elevated Supabase clients, payment secrets or server-only adapters
  into browser-executable code.
- Treat prices, shipping, stock, authorization and payment state as server-side
  decisions. A browser redirect does not confirm payment.
- Change the database through versioned migrations under
  `src/supabase/migrations/`; do not infer schema from a dashboard.
- Add or update an ADR for architecture-significant decisions and a spec under
  `specs/active/` for material future work. Archive completed specs.
- Comments are for developers: explain a non-obvious reason, invariant,
  constraint or risk. Do not restate code or preserve prompt/spec narration.

## Verification

Run the cheapest relevant checks first, then broaden in proportion to risk:
`pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
