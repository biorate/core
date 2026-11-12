# Tasks

## 1. Detection and fallback

- [ ] 1.1 In `params.ts` (or CLI entry): detect zero positional arguments; check TTY; non-TTY → existing missing-arguments error extended with a picker hint
- [ ] 1.2 Keep exit codes stable for non-interactive invocations

## 2. Picker

- [ ] 2.1 Extract/reuse generator listing from `help.ts`; implement two-level select prompts in `prompt.ts` (generator, then action)
- [ ] 2.2 Handle empty templates root ("no generators found" message with guidance)
- [ ] 2.3 Wire selected `(generator, action)` into the parsed args; verify flags (`--keep-going`, `--subaction`) pass through

## 3. Tests

- [ ] 3.1 E2E: emulated TTY flow selecting generator and action drives the expected run; flags honored; non-TTY no-args fails with the extended error; empty templates root message

## 4. Docs

- [ ] 4.1 Document the picker in `docs/generators.md` and `README.md`; update CLI help (`src/cli-help.ts`, `src/help.ts`)

## 5. Verification

- [ ] 5.1 Build clean, full vitest suite passes, `tsc --noEmit` 0 errors, prettier/eslint on changed files
- [ ] 5.2 Manual smoke: bare `hygen` in the test fixtures picks and runs; piped `hygen | cat` fails fast
