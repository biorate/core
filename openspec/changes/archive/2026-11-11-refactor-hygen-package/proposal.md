# Proposal

## Why

The `@biorate/hygen` fork (v0.0.1, hardened in change `harden-hygen-package`) works correctly — 60/60 tests green, all spec scenarios covered — but its code and documentation lag the monorepo standard:

- **No TSDoc.** Neighboring packages (`@biorate/config`, `@biorate/errors`) document every class, method, and field with `/** @description ... */` blocks; `@biorate/hygen` has none. The root typedoc pipeline (`pnpm run doc` → `packages/@biorate/*/index.ts`) already picks the package up, but renders bare signatures without any descriptions.
- **`any` in public types** (`RunnerConfig.helpers`, `RenderedAction.attributes`) violates the monorepo rule of no arbitrary `any`.
- **`engine.ts` mixes concerns**: help handling with `process.exit(0)`, validation, logging, and pipeline launch in one function; the error handling (the `ShowHelpError` special case) leaks into `index.ts`'s `runner`.
- **`ops/injector.ts` is dense**: anchor locations (`before`/`after`/`prepend`/`append`/`at_line`), `replace`, and `skip_if`/`skip_if_not` logic in one file after the hardening change.
- **Documentation gaps**: the package README never mentions the embeddable `runner()` API or the local `docs/` pages; the 11 docs pages are an upstream (hygen.io) copy whose semantics contradict the fork's deliberate behavior changes (identity escaping, anchor-not-found errors, new inject options); the root `README.md` modules list has no `hygen` entry.

## What Changes

- **Code refactor (behavior 1:1, public API frozen):**
  - named exports everywhere (drop `default` exports of `engine`/`execute`/`render`);
  - split `engine.ts` into a help/CLI concern (`cli-help.ts`) and the validation+pipeline engine;
  - extract anchor-location strategy (`anchors.ts`) from `ops/injector.ts` — a single `locate(lines)` interface per anchor kind; `replace`/`skip` logic stays functional but sits on top;
  - move the `runner` try/catch error handling into a dedicated module;
  - eliminate `any` from `types.ts` (`unknown`/generics), adjusting the few call sites it affects.
- **TSDoc pass:** `/** @description ... */` blocks (plus `@param`/`@returns`/`@example` where useful) on all exports of `index.ts`, public types in `types.ts`, `runner`, `engine`, and all error classes — following the `@biorate/config` style.
- **README restructure** (per the `@biorate/config` template): Features, Installation, Quick start (CLI), a new **Embedding API** section with a `runner()` example, a **Documentation** section linking the local `docs/` pages, Differences from upstream, License with fork attribution.
- **Full docs/ rewrite:** the 11 user-guide pages are rewritten for the fork's semantics (identity escaping, anchor-not-found errors, `create_if_missing`, `replace`, `skip_if_not`, `--version`), with explicit fork attribution and links to the upstream source (https://github.com/jondot/hygen) preserved on every page's header/footer and in the License section.
- **Root README:** add `[hygen](https://biorate.github.io/core/modules/hygen.html)` to the Modules list.
- **Docs role separation declared in the package README:** README = what/install/30-second start/embedding; `docs/` = full user guide (templates, inject, prompts); typedoc = API reference (generated, not hand-written).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `hygen-generator`: ADDED requirement — the public API (`runner`, config types, errors) SHALL be documented with TSDoc so typedoc generates meaningful API reference; the package and root READMEs SHALL document/-link the package (embedding guide, user guide, API).

## Impact

- `packages/@biorate/hygen/src/` — `index.ts`, `engine.ts` (split), new `cli-help.ts`, `runner.ts`, `ops/injector.ts` (+ new `ops/anchors.ts`), `types.ts` (typing), TSDoc pass over all files; no behavioral changes
- `packages/@biorate/hygen/tests/` — only adjustments forced by removing `any` from types (fixtures/specs may need explicit types); all 60 tests must stay green and behavior unchanged
- `packages/@biorate/hygen/README.md` — full restructure
- `packages/@biorate/hygen/docs/*.md` — full rewrite (11 pages)
- `README.md` (repo root) — one Modules-list entry
- Compatibility: no public API or behavior changes; no dependency changes; no version bump in this change
