# Design: add-hygen-path-macros

## Context

Mirroring resolves the write target in `src/ops/add.ts` (`targetPath`): explicit
`to:` wins; otherwise `mirror: true` (and no `sh`) derives the target from
`path.relative(actionfolder, action.file)` with the template suffix stripped.
Template discovery is a plain filesystem walk, so a macro segment must exist as a
literal directory name on disk — only the _destination_ computation interprets it.
The application-template consumer demonstrates the pain: every template repeats
`${h.ROOT}/apps/${h.CLIENT_NAME}` inside `to:`.

## Goals / Non-Goals

- **Goals:** zero per-file destination boilerplate for mirrored generators;
  cross-platform-safe syntax; scalar-per-pass semantics consistent with name
  expansion; fully additive change.
- **Non-Goals:** macros in `to:` (already EJS-rendered); multi-destination
  fan-out; macro evaluation at template-discovery time; changes to the glob batch
  pipeline (its `destination`/`base` are already EJS-rendered).

## Decisions

### D1. Syntax: `$IDENTIFIER$` substitution, not folder-name EJS

Segments are substituted with a plain identifier scan (`/\$([A-Za-z_][A-Za-z0-9_]*)\$/g`),
not rendered through EJS.

- EJS in directory names (`<%= h.X %>`) is illegal on Windows (`<`, `>` are
  reserved filename characters); `$` is legal on Linux, macOS and Windows.
- The substitution surface stays tiny and predictable: one regex, one lookup, no
  whitespace-trim / delimiter edge cases of EJS inside paths.
- Helper _composition_ still works: the config factory computes composed values
  (e.g. `CLIENT_NAME = \`${app-name}-client\``) and templates reference the
composed variable. Embedded literals around a macro (`v$VERSION$-build`) are
  supported by plain string replacement.

Alternatives considered: EJS in segments (rejected — Windows-illegal), bracket
`[name]` syntax (rejected — `$id$` reads as a variable, brackets do not, and
`[...]` collides with glob character-class intuition).

### D2. Resolution source: run locals, same precedence chain as templates

The lookup dictionary is the same locals object available to templates:
prompt-hook answers > positional name > `--name` flag, plus CLI args and values
exported by the config helpers factory. Non-string values are coerced with
`String(value)`; `undefined`/missing means "unresolvable". A macro never receives
an array — name expansion runs N passes, each with a scalar `name` (existing
"Name expansion" requirement), so `$name$` in a segment resolves per pass.

### D3. Where substitution happens: mirror target computation only

Substitution lives inside the mirroring branch of target-path resolution
(`src/ops/add.ts`), applied to the relative mirrored path before it is joined to
`cwd`. Rationale:

- `to:` is already fully EJS-rendered — macros there would be a second,
  redundant mechanism in the same frontmatter.
- Glob batch actions already render destination paths via EJS.
- Keeping substitution in one branch keeps the blast radius minimal and the
  spec testable (every non-macro template resolves bit-for-bit as before).

### D4. Failure mode: standardized fail-fast error

A new `PathMacroResolutionError extends BaseError` in `src/errors.ts`, following
the `GlobMirrorConflictError` pattern: message names the template file, the
offending segment and the identifier, and suggests checking the config helpers
factory / prompt answers. The action fails (per the existing per-action error
handling: stops the run unless `--keep-going`).

### D5. Segment is the unit, suffix rules unchanged

The trailing-`.t` / `.ejs.t` suffix stripping happens exactly as today; macros
may appear in any segment _including the file-name segment_ (e.g.
`$name$.entity.ts.t` → `<resolved>.entity.ts`). Suffix stripping is applied
before or after substitution? — **After**: strip the template suffix first (it is
a property of the template file), then substitute macros in the remaining path.
This avoids a `$` macro ever being able to inject a `.t` suffix that gets
stripped.

### D6. `Helpers` widened to scalar values

The macro feature legitimizes scalar helper values (`$CLIENT_NAME$` resolves a
string, and real consumers export scalars from `.hygen.js`), but `Helpers` was
typed `Record<string, Helper>` with `Helper` callable-only — a latent mismatch
surfaced by the first typed usage. `Helpers` is widened to
`Record<string, unknown>` (values may be callables for `h.name(args)` or scalars
for data and path macros); the `Helper` callable type is kept for the built-in
helper surface. Templates are EJS strings, so TS never checked template-side
calls — no type safety is lost.

## Risks / Trade-offs

- **Invisible coupling:** a template's validity now depends on locals content;
  typos surface only at run time. Mitigated by the fail-fast error (D4) and a
  `--dry` preview that exercises the same resolution path.
- **`$` in legitimate names:** a directory genuinely named `$foo$` becomes
  unresolvable unless `foo` exists in locals. Accepted: improbable, and the error
  message makes the cause obvious.
- **Two path mechanisms** (`to:` EJS vs mirror macros) — documented as
  complementary: mirror = structure-from-tree, `to:` = free-form. The docs
  section (README, templates.md, faq.md) states this explicitly.

## Migration Plan

Additive; no migration needed for existing templates. The
`biorate/application-template` consumer migrates in its own repository change:
rename `apps/client` → `apps/$CLIENT_NAME$` (and server analog), replace `to:`
lines with `mirror: true`, re-run its integration tests via `runner()`.

## Open Questions

- None blocking. (D5 order — suffix strip before substitution — is fixed here;
  revisit only if a real use case needs suffix-generating macros.)
