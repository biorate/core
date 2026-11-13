# Tasks

## 1. Detection and fallback

- [x] 1.1 In `params.ts` (or CLI entry): detect zero positional arguments; check TTY; non-TTY → existing missing-arguments error extended with a picker hint
- [x] 1.2 Keep exit codes stable for non-interactive invocations

## 2. Picker

- [x] 2.1 Extract/reuse generator listing from `help.ts`; implement two-level select prompts in `prompt.ts` (generator, then action)
- [x] 2.2 Handle empty templates root ("no generators found" message with guidance)
- [x] 2.3 Wire selected `(generator, action)` into the parsed args; verify flags (`--keep-going`, `--subaction`) pass through

## 3. Tests

- [x] 3.1 E2E: emulated TTY flow selecting generator and action drives the expected run; flags honored; non-TTY no-args fails with the extended error; empty templates root message

## 4. Docs

- [x] 4.1 Document the picker in `docs/generators.md` and `README.md`; `src/cli-help.ts` stays untouched (USAGE 1:1 with the original engine — decision A); `src/help.ts` gained the shared listing helpers as part of the implementation

## 5. Verification

- [x] 5.1 Build clean, full vitest suite passes, `tsc --noEmit` 0 errors, prettier/eslint on changed files
- [x] 5.2 Manual smoke: bare `hygen` in the test fixtures picks and runs; piped `hygen | cat` fails fast (TTY-pick flow covered by e2e with an injected prompter; CLI smoke done for the piped/CI path)
