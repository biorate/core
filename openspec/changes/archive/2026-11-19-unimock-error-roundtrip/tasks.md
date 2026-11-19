# Tasks

## 1. Error registry module

- [x] 1.1 Create `src/class-registry.ts` (universal): module `Map` pre-seeded with built-in error classes (`Error`, `TypeError`, `RangeError`, `EvalError`, `SyntaxError`, `URIError`), `registerClass`/`unregisterClass`/`getClass` with TSDoc,; export from `src/index.ts` — verify `pnpm --filter @biorate/unimock run build` passes and the export resolves from a smoke import

## 2. Serializer: error own-fields and typed arrays

- [x] 2.1 Extend the `T_ERROR` serialize branch in `src/serializer.ts` with own enumerable fields (`p`), excluding `name`/`message`/`stack`, honoring `stripRequestEnabled()` for `request` — verify `pnpm --filter @biorate/unimock run build` passes
- [x] 2.2 Update `deserialize` `T_ERROR` case: registry lookup (`?? Error`), assign `p` fields; update `SerializedError` in `src/interfaces.ts` (`v.p?: {k, v}[]`) — verify `pnpm --filter @biorate/unimock run build` passes
- [x] 2.3 Add `T_TYPED_ARRAY` constant and serialize branch after `Buffer.isBuffer` (`ArrayBuffer.isView` → base64 bytes), deserialize → `new Uint8Array(Buffer.from(v, 'base64'))` — verify `pnpm --filter @biorate/unimock run build` passes
- [x] 2.4 Add `T_INSTANCE` constant and serialize branch (before the plain-object branch): value whose `constructor.name` is registered → `{t:'instance', v:{c, p}}` (own enumerable fields, cycle-aware, after error branch); deserialize → `Object.create(getClass(c).prototype)` + fields, no constructor call — verify `pnpm --filter @biorate/unimock run build` passes
- [x] 2.5 Update `src/error-registry.ts` → `src/class-registry.ts`: universal registry, kept for API compatibility; update imports in `serializer.ts`/`index.ts` — verify `pnpm --filter @biorate/unimock run build` passes

## 3. Tests

- [x] 3.1 Add unit spec (e.g. `tests/unit/error-roundtrip.spec.ts`): registered AxiosError-like class round-trip with `response`/`config`/`code` (`instanceof` + field assertions); unregistered name → generic `Error`; generic `Error` without extra fields round-trips unchanged; legacy payload `{n,m,s}` without `p` deserializes as before — verify `npx vitest run tests/unit/error-roundtrip.spec.ts` passes
- [x] 3.2 Cover in the same or sibling spec: `Uint8Array` round-trip (bytes identical, result is `Uint8Array`); `Buffer` still round-trips as `Buffer`; cyclic `error.request` with `UNIMOCK_STRIP_REQUEST=1` serializes without failure and omits `request` — verify `npx vitest run tests/unit/error-roundtrip.spec.ts` passes
- [x] 3.3 Add unit spec (e.g. `tests/unit/class-registry.spec.ts`): registered domain-class instance in a result round-trips (`instanceof` + fields, constructor not invoked); unregistered class keeps plain-object behavior (no `instance` tag written); resolves the same class — verify `npx vitest run tests/unit/class-registry.spec.ts` passes

## 4. Full suite and documentation

- [x] 4.1 Run the full unit suite `pnpm --filter @biorate/unimock run test:unit` and confirm no regressions (serialization symmetry, mode-guards, record-session contract tests unaffected)
- [x] 4.2 Update `packages/@biorate/unimock/README.md` (serialization table: `error` → `{n,m,s,p}`, new `typed_array` form, `registerClass` usage example) and `packages/@biorate/unimock/AGENTS.md` (serializer section incl. `instance` tag, file table entry for `src/class-registry.ts`, fix the stale `cause` claim) — verify documented examples match the exported API
- [x] 4.3 Bump package version in `packages/@biorate/unimock/package.json` per Lerna independent conventions (minor) — verify `pnpm --filter @biorate/unimock run build` passes

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied (`/opsx-archive`).
- Downstream (CashOffice repo, out of scope here): register `AxiosError`, full `test:e2e:record`, update root `AGENTS.md` guard note — see design.md Migration Plan.
