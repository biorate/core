# Proposal

## Why

Connecting utility libraries (lodash, dayjs, sibling `@biorate/*` packages) to templates is
already fully supported via `config.helpers` (merged into the `h` namespace in
`src/context.ts`), including function-form helpers computed per run — but the docs only
show a trivial custom-function example. Users (and embedders) reasonably assume library
injection needs a new feature; it does not. The gap is discoverability, not capability.

## What Changes

- **Docs only, no code**: new section in `docs/extensibility.md` — "External libraries as
  helpers": lodash example, sibling-package (`@biorate/*`) example, function-form helpers
  for per-run lazy resolution with a friendly error when the library is missing, and the
  requirement that the library be an installed dependency of the project where hygen runs.
- FAQ entry: "Can I use lodash/other libraries in templates?" — yes, via `helpers` in the
  project config file.
- README Differences: no change needed (already-supported behavior); README Documentation
  table row description for `extensibility.md` already covers helpers.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: ADDED requirement — documented helper library usage: the package
  documentation SHALL show how to expose external utility libraries and sibling packages
  to templates through the project config file's `helpers` option.

## Impact

- **Docs** (`packages/@biorate/hygen`): `docs/extensibility.md`, `docs/faq.md`.
- **Code/tests**: none — behavior already exists and is tested via config helpers.
- **Compatibility**: no runtime surface changes.
