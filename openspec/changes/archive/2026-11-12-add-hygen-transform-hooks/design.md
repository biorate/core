# Design

## Context

`config.helpers` already demonstrates the pattern: a plain-object namespace from `.hygen.*` merged into the run context (`src/context.ts`). Rendering happens in `src/render.ts` before op resolution, so a post-render hook there covers add, mirror, and inject uniformly. Typed configuration errors exist as a precedent (`ConfigTsNodeError`).

## Goals / Non-Goals

**Goals:**

- Whole-content post-processing hook reusing the established config-namespace pattern.
- Chainable, async-capable transforms.
- Explicit, loud behavior on misconfiguration (unknown name → error; `sh:` usage → warning).

**Non-Goals:**

- plop's inline `transform` function on each action object — functions cannot live in frontmatter; named registry is the file-model equivalent.
- Transforms over file paths/destinations (names only shape content).
- Built-in transforms shipped with the package (users bring prettier etc.).

## Decisions

- **Named registry under `config.transforms`** in `.hygen.*`, same merge path as `helpers` (plain object). Signature `(content, locals) => string | Promise<string>`; async is free since the pipeline is Promise-based.
- **Application point: `render.ts`, immediately after content rendering**, before op resolution — one hook site covers add/mirror/inject; glob-expanded files (add-hygen-glob-actions) inherit it per file.
- **`|`-chaining** with left-to-right order; whitespace trimmed around names.
- **Unknown name → typed error** (`UnknownTransformError` in `src/errors.ts`) naming the transform and the config key — fail fast, by analogy with `ConfigTsNodeError`.
- **`transform:` on `sh:` → warning, no application** (user decision, 2026-11-12): warn keeps intent visible without failing the command.
- Resolution errors and warnings are emitted through `logger.ts`.

## Risks / Trade-offs

- Transforms run on every matched file for glob actions — cost is user-owned (they opted in).
- A throwing transform fails the affected action (enters failures under `--keep-going`), consistent with other action failures.
