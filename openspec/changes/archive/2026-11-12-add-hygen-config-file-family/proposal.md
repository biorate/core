# Proposal

## Why

Project-level configuration currently accepts only a single hardcoded file name, `.hygen.js` (`src/config-resolver.ts:6`). This is asymmetric with prompt hooks (which search a family of five file names including TypeScript and `.cjs` variants) and creates an undocumented pitfall: since the file is loaded with `await import()`, in ESM-host projects (`"type": "module"`) a `.hygen.js` written with `module.exports` fails, and there is no explicit-module-system escape hatch like `.hygen.cjs` / `.hygen.mjs`.

## What Changes

- `ConfigResolver` accepts a **candidate list** of config file names instead of a single name: `.hygen.js` → `.hygen.cjs` → `.hygen.mjs` → `.hygen.ts`, with fixed priority.
- Directory walk (from `cwd` up to filesystem root) stops at the first existing candidate by priority; if none exists, behavior is unchanged (empty config, no error).
- `.hygen.ts` is loaded via lazy `ts-node/register/transpile-only` registration, mirroring the existing prompt-hook pattern (`src/prompt.ts`).
- Loading stays via dynamic `import()`; CJS/ESM module-system semantics of the host project are documented.
- Documentation: the `.hygen.js` section in `packages/@biorate/hygen/docs/extensibility.md` becomes a config-file-family reference (name priority table, module-system notes, TS support).

No breaking changes: existing `.hygen.js` configs resolve exactly as before (highest priority candidate).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: ADDED requirement — project configuration file: the runner resolves project configuration from a prioritized family of file names (`.hygen.js`, `.hygen.cjs`, `.hygen.mjs`, `.hygen.ts`), walking up from the current directory, merging the nearest match into the runner config, with TypeScript support.

## Impact

- **Code** (`packages/@biorate/hygen`): `src/config-resolver.ts` (candidate list), `src/config.ts` (`ConfigResolver` — candidate list support; `ResolverIO` unchanged), `src/types.ts` (only if type surface needs adjusting).
- **Tests**: `tests/config-resolver.spec.ts` — extend with priority, walk-up, and TS-candidate scenarios (fake IO).
- **Dependencies**: no new dependencies; `ts-node` already used lazily for prompt hooks.
- **Docs**: `docs/extensibility.md`, README config mentions if any.
- **Compatibility**: fully backward compatible.
