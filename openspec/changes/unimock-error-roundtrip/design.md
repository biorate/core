# Design

## Context

`serialize`/`deserialize` (`src/serializer.ts`) use a `{t, v}` tagged format. The `T_ERROR` branch (serialize ~line 179, deserialize ~line 254) captures only `n`/`m`/`s` and restores a generic `Error`; non-Buffer views fall into the plain-object branch and lose their type. `recordError` (`src/utils.ts`) is the single write path for thrown errors, so serializer-level changes cover prototype methods, `MockHandler` calls, and statics (whose `toPlain` passes `Error` through as-is). `serialize` already handles cycles (`seen` Map), functions (marker strings), and the `UNIMOCK_STRIP_REQUEST` env flag for plain objects. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- Errors survive record→replay with class identity (`instanceof`) and own fields (`response`, `config`, `code`, `cause`).
- Clean `ArrayBuffer` views round-trip byte-exact as `Uint8Array`.
- Full backward compatibility with existing snapshots; no call-key format change.

**Non-Goals:**

- Checksum/digest mode for typed arrays — replay must return real bytes; snapshot pools already deduplicate identical content (identical base64 >500 chars lands in the string pool once). Revisit only if binary snapshots bloat repos, as a separate opt-in flag.
- Registering third-party error classes (axios etc.) inside unimock — consumers register their own classes.
- Symbol-keyed error properties, non-enumerable own fields.
- Downstream CashOffice updates (snapshot re-record, AGENTS guard note) — separate repo work.

## Decisions

**D1 — Own fields as optional `p` payload in `T_ERROR`.**
Serialize branch: `Object.entries(value)` (own enumerable), filter out `name`/`message`/`stack`, respect `stripRequestEnabled()` for `request`, serialize each value recursively. Payload shape `{n, m, s?, p?: [{k, v}]}`; `SerializedError.v.p` typed optional. Alternative considered: reuse `T_OBJECT` wrapping for errors — rejected: changes the tag for existing data and breaks legacy-reader simplicity.

**D2 — Dedicated `src/error-registry.ts` module.**
Module-level `Map<string, Ctor>` pre-seeded with built-in error classes; `registerErrorClass(name, ctor)` exported from `src/index.ts`. Deserialize: `errorClasses.get(v.n) ?? Error`, then `Object.assign(new Ctor(v.m), {name, stack})`, then assign `p` fields via `deserialize`. Rationale for a separate module: keeps `serializer.ts` free of public API surface; registry is also useful standalone (consumers check/rename entries). Alternative: hardcoded lazy `require('axios')` fallback for `AxiosError` — rejected: pulls app-level knowledge into the library; registry is explicit and testable.

**D3 — Typed-array branch after `Buffer.isBuffer`.**
Insert after the Buffer check (Buffer is itself a view, its branch must win): `ArrayBuffer.isView(value)` → tag `T_TYPED_ARRAY` with base64 of `Buffer.from(value.buffer, value.byteOffset, value.byteLength)`; deserialize → `new Uint8Array(Buffer.from(v, 'base64'))`. `DataView`/`Float32Array` also become `Uint8Array` — accepted semantic narrowing (declared in spec as bytes-exact, type normalized); the driving use case (pdf-lib `save()`) is `Uint8Array`. Alternative: preserve constructor per view type via a small tag table — rejected as YAGNI until a consumer needs it.

**D4 — Compatibility.**
`value.v.p ?? []` keeps old payloads reading identically; `p` absent → no field assignment loop. Call keys hash raw args (not results), so FIFO consumption order is untouched. New tag `T_TYPED_ARRAY` is additive to the reader; old readers never see it because it is only written by the new version.

## Risks / Trade-offs

- [Snapshot size growth from error `response`/`config` payloads] → `UNIMOCK_STRIP_REQUEST` already honored for `request`; `config` is small relative to `response`; pools dedupe repeated subtrees. Documented in README; consumers can trim via re-record discipline.
- [Replayed errors now carry function-valued props serialized as marker strings (e.g. methods on `config`)] → matches existing plain-object semantics; consumers relying on callable replay props are out of scope (already impossible for plain objects).
- [Registry is global mutable state] → acceptable for a test-mocking library; seeded built-ins cannot be reasonably shadowed to non-Error constructors; document that `registerErrorClass` is intended for test setup.
- [Typed-array type narrowing (`DataView` → `Uint8Array`)] → documented in spec scenarios; revisit with a per-type tag only when a real consumer appears.

## Migration Plan

1. Land serializer + registry + tests + docs in one change (typed-array bonus included per user decision).
2. Downstream (CashOffice, separate repo): bump `@biorate/unimock`, call `registerErrorClass('AxiosError', AxiosError)` in the e2e setup, run full `test:e2e:record` to rewrite error snapshots with `response` payloads, then update the root `AGENTS.md` guard note about thrown-error round-trip.
3. Rollback: revert the package version; old snapshots remain valid in both directions (writer is backward compatible, reader is additive).

## Open Questions

None.
