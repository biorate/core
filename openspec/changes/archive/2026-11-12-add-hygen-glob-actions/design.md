# Design

## Context

The runner pipeline is: parse args → discover templates → render each template's frontmatter/content → resolve ops per rendered action → execute ops. Template name expansion (comma lists) already multiplies actions in the engine's name-outer × action-inner loop. `ops/add.ts` writes files for `to:`-targeted actions or opt-in mirroring; `--keep-going` collects failures in `RunnerResult.failures`.

## Goals / Non-Goals

**Goals:**

- One glob-based template produces N rendered file actions.
- Destination paths computed from `base:` stripping, `stripExtensions:` removal, and EJS in file names.
- `skipIfExists` gives a soft skip instead of fail/overwrite for existing targets.
- Reuse the existing ops pipeline, `--keep-going`, and name expansion unchanged.

**Non-Goals:**

- Custom glob options beyond the basics (no `globOptions` passthrough).
- Interactive per-file conflict resolution.
- Changing `mirror:` semantics.

## Decisions

- **Glob expansion in `render.ts`, not a new op.** Expanding before op resolution means every downstream op (add, inject, keep-going accounting) works on already-concrete file actions. Alternative (a dedicated `addMany` op) would duplicate overwrite/inject logic.
- **`to:` doubles as the destination directory** for glob actions; `destination:` is accepted as a clearer alias. Rendered as a folder path, joined with the per-file relative path.
- **`base:` and `stripExtensions:` are string / string-array attributes**, mirroring plop's semantics: strip the `base` prefix from each match, remove any listed suffix extension, then render EJS in the remaining path.
- **`mirror` + `glob` is a hard configuration error** (fail fast with a `CliArgumentError`-style typed error), not a silent precedence rule — mirroring derives paths from the template's own name, which is meaningless for glob expansion.
- **`skipIfExists` lives in `ops/add.ts`**: existence check right before write; outcome object gains a `skipped` signal (path for the runner to exclude from failures). No `RunnerResult` shape change is required by this change alone (the skipped-status contract lands with add-hygen-conditional-actions; until then skips simply do not enter `failures`).

## Risks / Trade-offs

- Glob resolution relative to the generator directory needs care with nested template paths; tests cover fixture layouts.
- EJS in file names can produce path separators from user data; existing path sanitization in `add.ts` applies.
- Overwriting remains the default for plain `to:` actions (current behavior preserved); users opt into `skipIfExists` explicitly.
