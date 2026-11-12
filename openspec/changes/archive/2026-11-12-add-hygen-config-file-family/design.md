# Design

## Context

`ConfigResolver` (`src/config.ts`) is a small, fully unit-tested class: it takes a single
config-file name plus an injectable `ResolverIO` (`{ exists, load, none }`), builds
candidate paths by walking directories from the starting folder up to the filesystem root
(`reversePathsToWalk`), and returns the first existing file loaded via the injected `load`.
The composition root (`src/config-resolver.ts:6`) instantiates it with the hardcoded name
`.hygen.js` and `load: (f) => import(f)`.

Prompt hooks already implement the "family of names" pattern (`hooksfiles` in
`src/prompt.ts`) with lazy `ts-node/register/transpile-only` registration for `.ts` files.

## Goals / Non-Goals

**Goals:**

- Support `.hygen.js`, `.hygen.cjs`, `.hygen.mjs`, `.hygen.ts` with fixed priority.
- Keep backward compatibility: `.hygen.js` keeps the highest priority and existing
  resolution semantics (nearest directory, single file, merge into `RunnerConfig`).
- Reuse existing primitives (walk, `ResolverIO`, lazy ts-node registration).

**Non-Goals:**

- No JSON/YAML config formats, no `hygen.config.*` naming.
- No changes to prompt-hook lookup or template semantics.
- No DI redesign of `ConfigResolver` (rejected in the previous refactor as variant B).
- No auto-creation or validation of config file contents beyond the existing merge.

## Decisions

### 1. Candidate list in `ConfigResolver` (variant A)

Change the constructor signature from `(configFile: string, io)` to
`(configFiles: string[], io)` (or accept `string | string[]` internally normalized —
final call for the implementer, prefer the strict array form and update the single
call site). The resolution loop becomes: for each walked directory (nearest first),
for each candidate name in priority order, check `exists`; the first hit wins and
`load` is called once.

- Priority order is **per directory first, then candidate order**: a `.hygen.cjs` in a
  nearer directory beats a `.hygen.js` higher up. This preserves "nearest config wins"
  and matches config-resolver conventions (e.g. ESLint, prettier).
- The synthetic test above (`kitchen-sink`-style fixtures) stays as is: `.hygen.js`
  alone resolves identically.

**Alternatives considered:**

- _Per-name priority across the whole tree_ (`.hygen.js` anywhere beats `.hygen.ts`
  anywhere): rejected — surprising locality ("my subdir config is ignored").
- _Merge all found configs_: rejected — ambiguous override order, breaks the existing
  single-file contract, complicates error attribution.

### 2. `.hygen.ts` via lazy ts-node

Extract (or duplicate minimally, if cleaner) the lazy registration used by prompt hooks:
on first `.hygen.ts` resolution, require `ts-node/register/transpile-only` inside a
try/catch; on failure throw the standardized error type (`ConfigError`-family) with a
message pointing at installing `ts-node`. This mirrors `src/prompt.ts` behavior, keeping
zero startup cost for non-TS users. Because the existing `load` IO is injected and
fake-able, the ts-node registration belongs in the composition root's `load`
implementation, not inside `ConfigResolver` itself — keeping the class pure.

### 3. Loading via dynamic `import()` (unchanged)

`.hygen.cjs` and `.hygen.mjs` get correct semantics for free from Node's dynamic
`import()` (CJS interop / explicit ESM), independent of the host's `type` field.
Document (do not code around) that a plain `.hygen.js` follows the **host project's**
module system.

## Risks / Trade-offs

- Signature change of `ConfigResolver` is technically breaking for direct embedders, but
  the class is internal plumbing; the public `runner()` API is untouched. Mitigation:
  export the new array-based type, note it in the package README's Differences section
  only if it surfaces in public typings.
- ts-node registration mutates the host require hooks — same trade-off as prompt hooks
  today; transpile-only mode, lazily triggered.

## Open Questions

(none — resolved with the user during exploration)
