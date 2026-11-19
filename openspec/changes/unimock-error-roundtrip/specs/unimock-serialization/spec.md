# Spec Delta

## Purpose

Defines the snapshot value serialization contract of `@biorate/unimock` for errors and typed arrays: thrown errors round-trip with their class and own fields intact, `ArrayBuffer` views round-trip their bytes, and snapshots written by older package versions remain readable.

## ADDED Requirements

### Requirement: Error round-trip preserves own fields

When a value that is an `Error` is serialized, the snapshot entry SHALL include the error's own enumerable fields other than `name`, `message`, and `stack` (captured recursively with the standard value serializer), and deserialization SHALL restore those fields onto the reconstructed error. When `UNIMOCK_STRIP_REQUEST=1` is set, the serializer SHALL skip own fields named `request` exactly as it does for plain-object serialization.

#### Scenario: AxiosError with response survives record→replay

- **WHEN** a mockable method throws an error whose own fields include `response` (`{status: 401, data: {...}}`), `config`, and `code`, and the call is recorded and replayed
- **THEN** the replayed thrown error has `response.status === 401`, `response.data` content intact, and `code` restored

#### Scenario: Strip flag removes request field

- **WHEN** `UNIMOCK_STRIP_REQUEST=1` is set and an error with an own `request` field is serialized
- **THEN** the recorded snapshot entry contains no `request` field, and serialization does not fail on a cyclic `request` value

### Requirement: Error class restoration via registry

The package SHALL expose a public `registerErrorClass(name, ctor)` function backed by a registry pre-populated with the built-in error classes. On deserialization the recorded error name SHALL select the registered constructor; an unregistered or missing name SHALL fall back to the generic `Error` constructor while still restoring `name`, `message`, and `stack` as before.

#### Scenario: Registered class restores instanceof

- **WHEN** an error class is registered under the recorded error's `name` and the error is recorded and replayed
- **THEN** the replayed error is an `instanceof` the registered class

#### Scenario: Unregistered name falls back to generic Error

- **WHEN** an error whose `name` has no registered constructor is replayed from a snapshot
- **THEN** the replayed value is an `Error` instance with the recorded `name`, `message`, and `stack`

### Requirement: Typed array round-trip

The serializer SHALL serialize any non-Buffer `ArrayBuffer` view as a dedicated typed-array entry carrying its bytes (base64), and deserialization SHALL restore it as a `Uint8Array` with identical byte content. `Buffer` values SHALL continue to round-trip as `Buffer`, not as typed arrays.

#### Scenario: Uint8Array survives record→replay

- **WHEN** a recorded call returns a `Uint8Array` (e.g. PDF bytes) and the entry is replayed
- **THEN** the replayed value is a `Uint8Array` whose bytes are identical to the recorded ones

#### Scenario: Buffer round-trip unchanged

- **WHEN** a recorded call returns a `Buffer` and the entry is replayed
- **THEN** the replayed value is a `Buffer` with identical bytes

### Requirement: Legacy snapshot compatibility

Snapshot entries written by previous package versions (error payload without own-fields, no typed-array form) SHALL deserialize with unchanged behavior, and the format of call keys SHALL NOT change.

#### Scenario: Old error payload without own fields

- **WHEN** a snapshot entry recorded by a previous version contains an error payload with only `name`, `message`, and `stack`
- **THEN** deserialization produces a generic `Error` with that `name`, `message`, and `stack`, identical to previous behavior
