# Proposal

## Why

The `--name` flag duplicates the positional name (both land in the single `args.name`
slot) and is the only remaining multi-value hazard: repeated flags produce an array in
templates, an undocumented accident. With positional comma lists introduced in
`add-hygen-template-composition`, the flag has no remaining advantage and its removal
makes the CLI grammar single-path: `hygen <generator> <action[,action...]> [name[,name...]]`.

## What Changes

- **BREAKING**: the `--name` flag is no longer accepted by default. Invoking it produces
  a clear error explaining the positional syntax and pointing at the legacy escape.
- Legacy escape hatch: setting `HYGEN_LEGACY_NAME=1` (environment) or the
  `legacyNameFlag: true` option in `RunnerConfig` (embedding) restores the flag for one
  migration period.
- Positional name semantics unchanged: `hygen mailer new fancy` works exactly as before,
  including comma lists from the composition change.
- Documentation and README embedding examples rewritten from `--name` to positional
  form; README Differences section documents the removal and migration path.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: MODIFIED requirement — CLI and embeddable API: the `--name` flag is
  rejected by default with a descriptive error; accepted only under the legacy escape
  (`HYGEN_LEGACY_NAME=1` or `RunnerConfig.legacyNameFlag`). ADDED scenario coverage for
  the legacy escape and the error message.

## Impact

- **Code** (`packages/@biorate/hygen`): `src/params.ts` (detection + error + legacy
  gates), `src/types.ts` (`RunnerConfig.legacyNameFlag`), possibly `src/errors.ts`
  (dedicated error class if the standardized-error pattern warrants it).
- **Tests**: flag rejection, legacy env restore, legacy config option, positional paths
  unaffected.
- **Docs**: `docs/quick-start.md`, `docs/generators.md`, `docs/prompts.md`,
  `docs/faq.md`, package README (embedding example + Differences) — all `--name`
  examples rewritten.
- **Release**: semver **major** for `@biorate/hygen` (independent lerna versioning).
- **Compatibility**: breaking for scripts and CI using `--name`; migration = drop the
  flag or set the legacy variable.
