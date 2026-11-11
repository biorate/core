# Design

## Context

`@biorate/hygen` is the fork hardened in change `harden-hygen-package` (fixes #450/#387/#404, inject features #115/#84/#106/#117, kitchen-sink integration fixture). 60/60 Vitest tests, `tsc --noEmit` clean, prettier/eslint clean. This change is quality-only: structure, typing, documentation. Behavior 1:1, public API frozen.

## Goals / Non-Goals

**Goals:**

- Monorepo-standard documentation surface: TSDoc → typedoc, README restructure, user guide matching fork semantics, root README entry.
- Internal structure: single-concern modules, named exports, no `any` in exported types.
- All 60 tests stay untouched as the regression net (except typing-only adjustments).

**Non-Goals:**

- Full OOP/DI ("variant B": operation classes, `@biorate/inversion`) — deliberately rejected for a ~1.3k-line stateless CLI pipeline; revisit only if the package grows stateful.
- New features, other upstream issues (#433/#406, #302, #422), dependency upgrades, version bump, publication.

## Decisions

1. **Public API frozen.** `runner(argv, config) -> RunnerResult`, `engine`, `resolve`, `printHelp`, `availableActions`, `Logger`, `VERSION`, `errors` — same names, same signatures. The spec requires them; tests import them.
2. **Refactor shape (variant A+):**
   - `engine.ts` (51 lines) splits into `cli-help.ts` (the `-h`/`--help` handling and usage text; the `process.exit(0)` stays encapsulated there — CLI concern, not engine logic) and `engine.ts` (validation + render→execute pipeline).
   - `runner` moves from `index.ts` into `runner.ts`; its try/catch and the `ShowHelpError` → `printHelp` special case become explicit local handling instead of leaking through the barrel.
   - `ops/injector.ts` (129 lines): anchor locations become a strategy — `ops/anchors.ts` with one locator per anchor kind (`before`, `after`, `prepend`, `append`, `at_line`), each implementing a common `locate(lines: string[]): number` interface; `getPragmaticIndex` dissolves into the `before`/`after` locators. `replace` and `skip_if`/`skip_if_not` remain functions layered on top. Rationale: anchors are the one place with genuine polymorphism; operations have no state worth classifying.
   - Named exports everywhere; `export default` is dropped from `engine`/`execute`/`render` (internal modules; only `index.ts` is public surface).
3. **Typing:** `RenderedAction.attributes: Record<string, unknown>`; `RunnerConfig.helpers` loses the `Record<string, any>` union arm in favor of a typed signature. Expected ripple: small explicit-type/cast adjustments in ~3–4 call sites and a few test fixtures; `tsc --noEmit` (which typechecks tests) is the gate. No runtime behavior change — `unknown` reads in render/context get narrowed with explicit checks, not assertions where avoidable.
4. **TSDoc style:** exactly as `@biorate/config` — `/** @description ... */` on every exported member, `@param`/`@returns` on functions, `@example` on `runner`. Barrel `index.ts` exports get per-line `@description` comments (config pattern).
5. **docs/ full rewrite, not patching.** The 11 pages are re-authored for the fork: identity escaping (no more "use `<%- %>` to avoid HTML escaping" advice), injection section rewritten around anchor semantics and the anchor-not-found error, new options (`create_if_missing`, `replace`, `skip_if_not`) documented in depth, `--version` in the CLI page. Every page keeps a fork header: "Part of @biorate/hygen — a fork of jondot/hygen (v6.2.11, MIT) — upstream: https://github.com/jondot/hygen"; the License/attribution section repeats it. Original upstream page URLs are linked as "based on" references where a page directly descends from one.
6. **README restructure** per the `@biorate/config` template, adding an **Embedding API** section (a `runner()` example with a minimal `RunnerConfig`) and a **Documentation** section linking the local `docs/` pages — fixing the orphaned-pages problem. The fork role split is stated explicitly: README = overview/quick start/embedding; docs/ = user guide; typedoc = API.
7. **Root README:** one Modules-list entry `- [hygen](https://biorate.github.io/core/modules/hygen.html)`; no other root changes.
8. **Verification:** full test suite green (60/60), `tsc --noEmit` 0 errors, prettier/eslint clean, `pnpm run doc` generates `docs/modules/hygen.html` with descriptions, CLI smoke (`--version`, generation) unchanged.

## Risks / Trade-offs

- [Typing ripple into tests] → bounded by `tsc --noEmit` after each typing task; typing-only diffs, no assertion changes.
- [Splitting engine/injector may subtly alter behavior] → tests untouched and green is the acceptance criterion; kitchen-sink exercises the full pipeline end-to-end.
- [Docs rewrite diverges from upstream docs] → intentional; upstream links preserved for provenance, fork attribution on every page.
- [typedoc on newly documented exports may surface previously-hidden type errors] → `pnpm run doc` is part of verification.

## Migration Plan

No runtime migration (no behavior/API changes). Rollback: revert the commit. The docs rewrite replaces files in place; upstream content remains recoverable from git history and the linked upstream repository.

## Open Questions

- (none — scope, depth, and structure confirmed with the author)
