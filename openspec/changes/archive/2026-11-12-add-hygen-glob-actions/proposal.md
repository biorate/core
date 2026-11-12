# Proposal: add-hygen-glob-actions

## Why

Ported from plop (`addMany`). Today every generated file in `@biorate/hygen` requires its own template and its own `add`-style action; scaffolding a multi-file module (controller + service + spec + index) means duplicating per-file actions. Plop solves this with a single glob-based action that renders a whole template directory. This is the largest capability gap identified in the plop feature review (2026-11-12 explore session).

## What Changes

- New frontmatter attributes on a template: `glob:` (pattern relative to the template's generator directory), `base:` (path prefix stripped from matched files when computing destinations), `stripExtensions:` (extensions removed from matched file names), and a destination folder for matched files (`to:` reused as directory, or `destination:` alias).
- A glob action expands at render time into N file actions; each matched file is rendered with EJS in both its file name and its content, then flows through the existing add/inject operation pipeline.
- `skipIfExists: true` attribute for file-creating actions: when the target file already exists, the action is skipped instead of failing (per-file granularity, integrates with `--keep-going`).
- Template name expansion (comma lists) multiplies with glob matches via the existing name-outer × action-inner loop.
- `glob:` is mutually exclusive with `mirror:`; a template combining both fails with a clear configuration error.
- Documentation and CLI help updated.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: ADD a requirement for glob-based batch file actions (addMany); ADD a requirement for skipIfExists behavior on file actions.

## Impact

- `packages/@biorate/hygen/src/render.ts` — glob expansion into rendered actions
- `packages/@biorate/hygen/src/ops/add.ts` — `skipIfExists` handling
- `packages/@biorate/hygen/src/ops/index.ts` — skip outcome pass-through
- `packages/@biorate/hygen/src/types.ts` — new attribute types
- `packages/@biorate/hygen/src/cli-help.ts`, `src/help.ts` — help text
- `packages/@biorate/hygen/docs/*.md`, `README.md` — documentation
- New e2e tests in `packages/@biorate/hygen/tests/`
