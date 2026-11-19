# Proposal

## Why

Thrown errors recorded in unimock snapshots lose their class and own fields: the serializer writes only `{name, message, stack}` and replay restores a generic `Error`. As a result `error instanceof AxiosError` in application services is always `false` in replay (real case: negative KeyCloak e2e tests in CashOffice return 503 instead of the recorded 401/500). The same gap drops clean `Uint8Array` values (e.g. `pdf.save()` from pdf-lib), which round-trip into plain objects and break downstream consumers like `PDFDocument.load`.

## What Changes

- Serialize an `Error`'s own enumerable fields (except `name`/`message`/`stack`) into a new optional `p` payload of the `T_ERROR` value, honoring `UNIMOCK_STRIP_REQUEST` for `request`-shaped fields.
- Restore own fields and the original error class on replay via a new class registry (`registerClass(name, ctor)`), exported from the package public API, in a dedicated module `src/class-registry.ts`; unknown names fall back to `Error` (legacy behavior).
- Add a universal `t: 'instance'` serialized form for instances of **registered classes** (opt-in at record time): any non-Buffer view aside, an instance whose constructor is registered round-trips with its class identity (`instanceof` works in replay) and own fields; unregistered classes keep the legacy plain-object behavior.
- Add a `T_TYPED_ARRAY` serialized form for non-Buffer `ArrayBuffer` views (`ArrayBuffer.isView`), round-tripping bytes via base64 → `Uint8Array` (full round-trip; no checksum mode — snapshot pools deduplicate identical content automatically).
- Extend the `SerializedError` interface (`v.p?`) and update README/AGENTS documentation, including the currently inaccurate claim that `cause` is serialized (it becomes true via own-field capture since `cause` is an own enumerable property).

No breaking changes: old snapshots (`v` without `p`) deserialize exactly as before; call-key format is unaffected (keys hash raw args, not results), so FIFO replay order does not shift.

## Capabilities

### New Capabilities

- `unimock-serialization`: snapshot value serialization contract of `@biorate/unimock` — error round-trip (class registry, own fields, stack/strip semantics), typed-array round-trip, and backward compatibility with legacy snapshot payloads.

### Modified Capabilities

<!-- None: no existing spec covers unimock behavior. -->

## Impact

- `packages/@biorate/unimock/src/serializer.ts` — error branch (own fields), typed-array branch, `deserialize` cases.
- New `packages/@biorate/unimock/src/class-registry.ts` + export in `src/index.ts`.
- `packages/@biorate/unimock/src/interfaces.ts` — `SerializedError.v.p`.
- Tests: new unit specs in `tests/unit/` (error round-trip with registered class, legacy snapshot, generic error, typed array, cyclic `request` with strip flag).
- Docs: `README.md`, `AGENTS.md` (package), root `AGENTS.md` guard note update is downstream (CashOffice repo, out of scope here).
- Consumers: downstream repos register their classes once (e.g. `registerClass('AxiosError', AxiosError)` in an e2e setup); a full `test:e2e:record` run rewrites error snapshots with `response` payloads.
