# Tasks

## Group 1 — Removal and legacy gate

- [x] 1.1 `src/errors.ts`: add `NameFlagRemovedError` (BaseError family) with a message
      showing the positional equivalent and the legacy escape names.
- [x] 1.2 `src/params.ts`: detect `--name` in parsed argv; no legacy gate → throw
      `NameFlagRemovedError`; gate = `process.env.HYGEN_LEGACY_NAME === '1'` or
      `RunnerConfig.legacyNameFlag === true` → consume `cleanArgv.name` as a
      single-element name list (pre-composition behavior preserved, including the
      repeated-flag array under legacy).
- [x] 1.3 `src/types.ts`: add `legacyNameFlag?: boolean` to `RunnerConfig` with TSDoc.
- [x] 1.4 Tests: rejection error (message content), env gate, config gate, positional
      paths unaffected, legacy repeated-flag array preserved.

## Group 2 — Docs and release surface

- [x] 2.1 Rewrite every `--name` example to positional form (verified sweep found 11
      files): package README (embedding example + Differences entry describing the
      removal and migration), and docs/: `quick-start.md`, `generators.md`,
      `prompts.md`, `faq.md`, `create.md`, `express.md`, `extensibility.md`,
      `packages.md`, `react-native.md`, `redux.md`, `standalone.md`; document
      `HYGEN_LEGACY_NAME` and `legacyNameFlag` in README Differences.
- [x] 2.2 Mark package as semver-major in change notes: bump instruction for the user
      (`npx lerna version major --scope @biorate/hygen` path at release time — recorded,
      not executed in this change).
- [x] 2.3 Full verification: build, all tests green, `tsc --noEmit`, prettier/eslint
      clean on touched files, `openspec validate remove-hygen-name-flag`.

## Group 3 — Finalize

- [x] 3.1 Check `openspec status` all done; present summary (commit/archive on explicit
      user command only).
