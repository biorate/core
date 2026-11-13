# Spec Delta

## MODIFIED Requirements

### Requirement: Template mirroring

The runner SHALL support opt-in mirroring: when a template declares `mirror: true` and
has no `to:`, its rendered body SHALL be written to the path mirroring the template's
location inside the action folder, with the template suffix resolved per the suffix
convention. Each path segment of the mirrored target MAY contain one or more macros of
the form `$IDENTIFIER$`; every macro SHALL be substituted with the string value of
`IDENTIFIER` from the run locals (prompt-hook answers, positional/flag `name`, CLI
args, and values exported by the config helpers factory), evaluated once per render
pass so a macro is always a scalar. An identifier with no resolvable value SHALL fail
the run with a standardized error naming the template file, the path segment and the
identifier. Template files whose segments contain no macros SHALL resolve exactly as
before.

#### Scenario: Mirror with default suffix rule

- **WHEN** a template `parts/header.ejs.t` declares `mirror: true` and no `to:`
- **THEN** the rendered body is written to `<cwd>/parts/header.ejs` (trailing `.t` stripped)

#### Scenario: Mirror with EJS suffix flag

- **WHEN** `HYGEN_MIRROR_EJS_SUFFIX=1` is set for the same template
- **THEN** the rendered body is written to `<cwd>/parts/header` (`.ejs.t` stripped)

#### Scenario: Explicit to wins

- **WHEN** a template declares both `to:` and `mirror: true`
- **THEN** the explicit `to:` target is used and `mirror` has no effect

#### Scenario: Mirror never applies to shell templates

- **WHEN** a template declares `sh` (shell execution) without `to:`
- **THEN** no file is created, regardless of `mirror`

#### Scenario: Nested template directories

- **WHEN** a mirrored template resides in nested subdirectories of the action folder
- **THEN** the target path reproduces that nesting under the current directory,
  creating missing directories

#### Scenario: Macro segment resolves from helpers

- **WHEN** a template resides at `<generator>/<action>/apps/$CLIENT_NAME$/src/index.ts.t`
  with `mirror: true`, and the config helpers factory exports `CLIENT_NAME`
- **THEN** the rendered body is written to `<cwd>/apps/<resolved CLIENT_NAME>/src/index.ts`

#### Scenario: Macro segment with surrounding literal text

- **WHEN** a mirrored template's path contains a segment `v$VERSION$-build`
  and `VERSION` resolves to `2`
- **THEN** the segment resolves to `v2-build` in the target path

#### Scenario: Unknown macro identifier fails the run

- **WHEN** a mirrored template's path contains a segment `$NOPE$` and no `NOPE`
  value exists in the run locals
- **THEN** the run fails with a standardized error naming the template file, the
  segment and the identifier `NOPE`, and no file is written by that action

#### Scenario: Macro is a scalar per pass under name expansion

- **WHEN** a mirrored template's path contains a segment `$name$` and the run
  expands names `a,b`
- **THEN** each pass resolves the segment with its own scalar `name`, producing
  `<cwd>/a/...` and `<cwd>/b/...` in two separate passes
