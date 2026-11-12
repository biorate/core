# Proposal: add-hygen-transform-hooks

## Why

Ported from plop (`transform` on actions). Hygen helpers operate inside EJS, but there is no way to post-process the whole rendered result — e.g. run prettier over a generated file, or normalize line endings on an injected snippet. Generated code that is not formatted is one of the most common complaints about template-based generation.

## What Changes

- `.hygen.*` configuration gains a `transforms` namespace: named functions `(content, locals) => string | Promise<string>`, registered exactly like `helpers` (plain object; function-form registration unnecessary here).
- New `transform:` frontmatter attribute on file actions: a name (or `|`-chained names) resolved from `config.transforms`; applied after rendering and before any operation (add, mirror write, inject).
- `transform:` on a `sh:` action is **not applied**; the runner emits a warning instead of silently ignoring or accumulating dead config.
- An unknown transform name fails the action with a clear typed error (by analogy with `ConfigTsNodeError`).
- Documentation and CLI help updated.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: ADD a requirement for named content transforms applied to rendered file content; ADD a requirement for transform behavior on non-file actions (warn + no-op on `sh:`).

## Impact

- `src/context.ts` / `src/types.ts` — `config.transforms` namespace
- `src/render.ts` — post-render transform application
- `src/errors.ts` — unknown-transform error
- `src/logger.ts` — warn for `transform` on `sh:`
- Docs: `docs/extensibility.md`, `README.md`; CLI help
- Tests: unit/e2e transform scenarios
