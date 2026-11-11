# Spec Delta

## ADDED Requirements

### Requirement: Documented public API

The package's public API SHALL carry TSDoc blocks (`@description`, plus `@param`/`@returns`/`@example` where useful) following the monorepo style, so that `pnpm run doc` (typedoc over `packages/@biorate/*/index.ts`) generates an API reference with meaningful descriptions. Exported types SHALL NOT use `any`.

#### Scenario: Typedoc generates documented API

- **WHEN** `pnpm run doc` is executed at the monorepo root
- **THEN** the generated API reference for `@biorate/hygen` contains descriptions for `runner`, the runner configuration types, and the error classes

#### Scenario: No arbitrary any in exported types

- **WHEN** the exported types of the package are inspected
- **THEN** none of them uses `any`; `unknown`, generics, or concrete types are used instead

### Requirement: Package documentation and fork attribution

The package README, the `docs/` user guide, and the repository root README SHALL document the package consistently and preserve fork attribution to jondot/hygen (v6.2.11, MIT) with a link to the upstream source.

#### Scenario: README documents embedding

- **WHEN** a reader opens the package README looking to use the generator from code
- **THEN** an embedding section with a working `runner()` example and links to the API reference and user guide is present

#### Scenario: User guide matches fork semantics

- **WHEN** the docs/ pages describing escaping or injection are read
- **THEN** they describe identity escaping and the anchor-not-found error behavior of this fork, and mention the fork attribution with the upstream source link

#### Scenario: Root README lists the package

- **WHEN** the repository root README Modules list is inspected
- **THEN** it contains a `hygen` entry linking to the generated API reference
