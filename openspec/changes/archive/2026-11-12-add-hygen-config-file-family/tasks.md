# Tasks

## Group 1 — Core resolution

- [x] 1.1 Extend `ConfigResolver` (`src/config.ts`) to accept a candidate list
      (`string[]`) in priority order; resolution loop = nearest directory first, then
      candidate order; first `exists` hit wins; update `ResolverIO` docs if needed.
- [x] 1.2 Update the composition root `src/config-resolver.ts`: pass
      `['.hygen.js', '.hygen.cjs', '.hygen.mjs', '.hygen.ts']`; add lazy
      `ts-node/register/transpile-only` registration in the `load` implementation for
      `.hygen.ts` (pattern from `src/prompt.ts`), standardized error on failure.
- [x] 1.3 Unit tests in `tests/config-resolver.spec.ts` (fake IO): priority order in one
      directory; nearest-directory-wins across candidates; no config → empty result;
      `.ts` candidate triggers ts-node registration path (mocked); backward-compat
      `.hygen.js`-only case.

## Group 2 — Integration & docs

- [x] 2.1 Integration/e2e coverage: fixture with `.hygen.cjs` (CJS export form) resolving
      config values in a runner run. Note: no real-ts-node `.hygen.ts` e2e was added —
      ts-node registration is covered by the unit mock in `tests/config-resolver.spec.ts`.
- [x] 2.2 Docs: rewrite the config section of `docs/extensibility.md` as a config-file
      family reference (priority table, nearest-directory rule, CJS/ESM/TS module-system
      notes, host-`type` caveat for `.hygen.js`); cross-linked from `docs/prompts.md`
      "See also" and the README docs table.
- [x] 2.3 Full verification: `pnpm run build` (clean), tests all green, `tsc --noEmit`
      from package dir, prettier and eslint clean on touched files;
      `openspec validate add-hygen-config-file-family`.

## Group 3 — Finalize

- [x] 3.1 Check `openspec status` all done; present summary to the user (commit/archive
      only on explicit user command).
