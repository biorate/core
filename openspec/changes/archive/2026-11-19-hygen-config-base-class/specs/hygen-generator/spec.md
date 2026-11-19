# Spec Delta

## ADDED Requirements

### Requirement: HygenConfig base class

The package SHALL export an abstract `HygenConfig` class whose constructor initializes all project-config fields available to the base class with neutral defaults and whose prototype declares no-op lifecycle hook methods (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`). The class SHALL provide a conversion producing the project-config subset (fields plus bound hook methods) used by configuration resolution.

#### Scenario: Constructor initializes defaults

- **WHEN** a subclass calls `super()` and does not assign any field
- **THEN** the instance carries `templates` and `localsDefaults` as undefined, `argCase` as `'keep'`, and no helpers, without runtime errors

#### Scenario: Hook methods live on the prototype with live `this`

- **WHEN** a subclass overrides `beforeEach(ctx)` as a prototype method that reads an instance field, and a generator run executes
- **THEN** the hook is invoked with `this` bound to the config instance and the instance field is readable

#### Scenario: Direct instantiation is prevented

- **WHEN** code attempts to instantiate `HygenConfig` directly
- **THEN** compilation fails under `strict` TypeScript (abstract class), and the abstract class exports successfully from the package entry point

### Requirement: HygenConfig helpers member forms

A `HygenConfig` subclass MAY provide `helpers` as an own property map, a getter returning a map, or a factory method `(locals, config) => Helpers`; all three forms SHALL be honored when the configuration is resolved.

#### Scenario: Helpers as property, getter, and method

- **WHEN** three subclasses provide `helpers` respectively as an own property map, a getter returning a map, and a method `(locals, config) => Helpers`
- **THEN** in all three cases the effective runner configuration receives the produced helpers map

## MODIFIED Requirements

### Requirement: Project configuration file

The runner SHALL resolve project-level configuration from a prioritized family of
configuration file names, walking directories up from the current directory,
and merges the nearest match into the effective runner configuration. The merged
configuration MAY carry an optional `hooks` object with lifecycle methods that apply
to every generator run. The resolved file's export SHALL be normalized: named
exports take priority when present; otherwise a default export is used — a plain
object as-is, or a class instantiated with no constructor arguments. A class whose
prototype chain includes the exported `HygenConfig` base class SHALL be resolved
through the base class conversion (fields plus bound prototype hook methods and the
configured `helpers` member). Any other class SHALL be resolved to the instance's
own enumerable properties (prototype members are not read). Own enumerable
properties outside the known project-config key set SHALL be ignored with a warning
naming the property (legacy class path). Instantiating a class whose constructor
requires arguments SHALL fail the run with a standardized error naming the config file.

#### Scenario: Single config file resolution

- **WHEN** a project contains only a `.hygen.js` at or above the current directory
- **THEN** the runner loads it and merges its exports into the runner configuration

#### Scenario: Candidate priority

- **WHEN** multiple configuration candidates exist in the same directory
  (`.hygen.js`, `.hygen.cjs`, `.hygen.mjs`, `.hygen.ts`)
- **THEN** the runner uses exactly one file, in the priority order
  `.hygen.js` → `.hygen.cjs` → `.hygen.mjs` → `.hygen.ts`

#### Scenario: Nearest directory wins

- **WHEN** configuration candidates exist in several directories along the
  path from the current directory to the filesystem root
- **THEN** the nearest directory containing any candidate determines the
  resolved file, and only that file is loaded

#### Scenario: No configuration file present

- **WHEN** no candidate exists in any walked directory
- **THEN** the runner proceeds with no project configuration and no error

#### Scenario: TypeScript configuration file

- **WHEN** the resolved file is `.hygen.ts`
- **THEN** the runner loads it as TypeScript (on-the-fly transpilation) and
  merges its exports into the runner configuration

#### Scenario: Explicit module systems

- **WHEN** the resolved file is `.hygen.cjs` (CommonJS) or `.hygen.mjs` (ESM)
- **THEN** the runner loads it with the corresponding module-system semantics,
  independent of the host project's `type` field

#### Scenario: Backward compatibility

- **WHEN** a project uses an existing `.hygen.js` configuration
- **THEN** resolution and merge behavior is unchanged from prior versions

#### Scenario: Project lifecycle hooks apply to every run

- **WHEN** the resolved project configuration exports a `hooks` object with
  `beforeAll` and `afterAll`
- **THEN** both run once around any generator run, regardless of the generator and
  action names

#### Scenario: Named exports take priority over a default export

- **WHEN** the resolved configuration file declares both named export fields and a
  default export
- **THEN** the named export fields are merged and the default export is ignored

#### Scenario: Default-exported plain object

- **WHEN** the resolved configuration file has no named exports and default-exports
  a plain object
- **THEN** the object's fields are merged into the runner configuration

#### Scenario: Default-exported class

- **WHEN** the resolved configuration file has no named exports and default-exports
  a class that does not extend `HygenConfig`
- **THEN** the runner instantiates it with no constructor arguments and merges the
  instance's own enumerable properties into the runner configuration; prototype
  methods and getters are not read, and class methods never become helpers

#### Scenario: Class with unknown own properties

- **WHEN** a default-exported config class instance exposes own enumerable
  properties outside the known project-config key set
- **THEN** the unknown properties are ignored and a warning naming each unknown
  property is logged

#### Scenario: Class with required constructor arguments

- **WHEN** a default-exported config class cannot be instantiated without
  constructor arguments
- **THEN** the run fails with a standardized error naming the configuration file

#### Scenario: Base-class config resolved through the base class

- **WHEN** the default export is a class extending `HygenConfig` with prototype hook methods and a `templates` field assigned in the constructor
- **THEN** the effective runner configuration carries the constructor-assigned field and lifecycle hooks bound to the instance, and the project hooks apply to every run

#### Scenario: Legacy class config keeps own-props resolution

- **WHEN** the default export is a class NOT extending `HygenConfig` whose own properties declare `helpers` and `hooks`
- **THEN** the instance's own enumerable properties are merged as before, prototype members are not read, and unknown own properties warn

#### Scenario: Base-class instance fields outside known keys

- **WHEN** a `HygenConfig` subclass declares an extra own field used as internal state
- **THEN** it does not leak into the runner configuration and no unknown-property warning is emitted for base-class instances
