# Tasks

## 1. Macro resolution core

- [x] 1.1 Add `PathMacroResolutionError` to `packages/@biorate/hygen/src/errors.ts` (message: template file, segment, identifier, hint about config helpers / prompt answers). Verify: `pnpm --filter @biorate/hygen build` passes and the class is exported.
- [x] 1.2 Add a macro-resolution helper (regex `/\$([A-Za-z_][A-Za-z0-9_]*)\$/g`, locals lookup, `String()` coercion, throw `PathMacroResolutionError` on unresolvable) and wire it into the mirroring branch of `targetPath` in `src/ops/add.ts`: strip template suffix first, then substitute. Verify: unit tests cover plain mirror (unchanged), macro segment, embedded macro, file-name segment, unknown identifier.

## 2. Tests

- [x] 2.1 Unit tests for the resolution helper in `packages/@biorate/hygen/tests/add.spec.ts` (package test convention) covering: no-macro path identical to previous behavior; `$VAR$` from helpers; `$name$` scalar per pass; embedded `v$VERSION$-build`; unknown identifier error text. Verify: `pnpm --filter @biorate/hygen test` green.
- [x] 2.2 Integration test through `runner()` (`tests/path-macros.spec.ts`): generator with `apps/$CLIENT_NAME$/src/index.ts.t` (`mirror: true`), run with `-n a,b` — scalar `name` per pass; plus a failing case with an unresolvable identifier asserting the standardized error and no file written. Verify: `pnpm --filter @biorate/hygen test` green.

## 3. Documentation

- [x] 3.1 Document path macros in `docs/templates.md` (new subsection under Mirroring: syntax, locals/precedence chain, scalar-per-pass under name expansion, fail-fast error) and `docs/faq.md`; add a bullet to the README feature list noting cross-platform `$` syntax and that `to:`/glob remain EJS-rendered. Verify: docs mention `$IDENTIFIER$`, Windows safety, and the error class.
- [x] 3.2 Run prettier on edited files and verify `npx prettier --check` passes for them. Verify: clean check.
- [x] 3.3 (found during apply) Fix type errors surfaced by the new tests: widen `Helpers` in `src/types.ts` to `Record<string, unknown>` — scalar helper values are legitimate (path macros resolve them; real consumers export scalars from `.hygen.js`), `Helper` stays callable-only for built-ins. Verify: `npx tsc -p tsconfig.json --noEmit` clean, build/tests/lint/prettier green.

## Workflow follow-up

- The author commits and pushes (the assistant does not run `git add` / `commit` / `push`).
- Migration of `biorate/application-template` is a separate change in that repository.
