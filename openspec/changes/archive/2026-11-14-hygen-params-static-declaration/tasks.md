# Tasks

## 1. Engine

- [x] 1.1 In `src/prompt.ts` `loadResolvedHooks` (class branch), read the schema from the default-exported class static member (`exported.params`) instead of the module export; keep `validateParamsSchema` and the load-time error behavior unchanged; verify with `npx tsc -p tsconfig.json --noEmit` and `npx vitest run tests/params-schema.spec.ts` (load-time validation case updated to the static form).

## 2. Fixture and tests

- [x] 2.1 Move the fixture declaration: `tests/fixtures/params-schema/_templates/widget/new/hooks.ts` declares `static params = [...]` on the hooks class and drops the module-level export; verify with `npx vitest run tests/params-schema-integration.spec.ts` (6/6 green).

## 3. Docs and spec

- [x] 3.1 Update declaration examples to `static params` in `docs/extensibility.md` (Declarative parameters section), `docs/prompts.md` (cross-ref note: remove the module-export wording), and `README.md` if it shows the form; verify by reading the sections.
- [x] 3.2 Update the main spec requirement wording: in `openspec/specs/hygen-generator/spec.md`, the "Declarative action parameter schema" requirement and its scenarios declare `static params` on the hooks class instead of a module export; verify with `openspec validate --specs`.

## 4. Integration verification

- [x] 4.1 Full verification: `pnpm --filter @biorate/hygen run test` (all green), `npx tsc -p tsconfig.json --noEmit`, `pnpm --filter @biorate/hygen run lint`, `openspec validate hygen-params-static-declaration`; grep confirms no `export const params` remains in fixtures/docs (`grep -rn "export const params" packages/@biorate/hygen` returns nothing).

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- Version bump stays with `npx lerna version` (the schema feature ships in the same minor release as this reshape).
