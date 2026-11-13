# Proposal: add-hygen-path-macros

## Why

Mirroring (`mirror: true`) currently derives the write target from the template's
own directory path — a literal one. Real generators need dynamic path parts (a
target root, an application name derived from flags), which forces every template
to declare an explicit `to:` that re-builds the whole destination path by hand.
In a real consumer (`biorate/application-template`), 179 of 184 templates carry a
`to:` line duplicating the same `${ROOT}/apps/${CLIENT_NAME}` prefix knowledge.
The boilerplate defeats the purpose of mirroring: the directory tree of templates
can no longer serve as the source of truth for the generated layout.

## What Changes

- Path segments of template files may contain **cross-platform macros** of the
  form `$IDENTIFIER$` (e.g. `apps/$CLIENT_NAME$/src/`). `$` is a legal filename
  character on Linux, macOS and Windows, so a template repository with macro
  segments checks out and works on all three platforms.
- When mirroring computes a write target, each `$IDENTIFIER$` macro in a segment
  is substituted with the string value of the corresponding variable in the run
  locals (prompt-hook answers, positional/flag `name`, CLI args, and values
  exported by the config helpers factory). Substitution happens once per render
  pass, so name expansion (`-n a,b`) yields one pass per name and one resolved
  folder per pass — a macro is always a scalar, never an array.
- An unresolvable macro (the identifier is not present in locals) fails the run
  with a standardized error naming the segment, the identifier and the template
  file.
- Explicit `to:` continues to win over `mirror`; `sh`-only templates continue to
  never mirror; the `glob`/`mirror` mutual exclusion is unchanged.
- Documentation (README feature list, `docs/templates.md`, `docs/faq.md`) gains a
  "path macros in mirrored targets" section with a working example.

## Capabilities

### Modified: `hygen-generator`

- The "Template mirroring" requirement is extended: mirrored target paths support
  `$IDENTIFIER$` macros in path segments, resolved from run locals per pass, with
  fail-fast behavior on unresolvable identifiers.

## Impact

- **Code:** `packages/@biorate/hygen` — `src/ops/add.ts` (target-path resolution),
  a new error class in `src/errors.ts`, a small macro-resolution helper; no
  changes to template discovery, EJS rendering, or the glob pipeline.
- **Docs:** `README.md`, `docs/templates.md`, `docs/faq.md` in the same package.
- **Tests:** unit tests for macro resolution (happy path, unknown identifier,
  embedded-in-segment, precedence with `to:`), integration test through `runner()`
  with name expansion (`-n a,b` → two resolved folders).
- **Compatibility:** fully additive — templates without `$...$` segments behave
  exactly as before.
- **Out of scope:** migrating `biorate/application-template` templates to macros
  (separate change in that repository); macro support in `to:` (it is already
  EJS-rendered); multi-destination fan-out from a single pass.
