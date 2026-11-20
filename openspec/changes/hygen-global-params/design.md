# Design

## Context

Parameter schemas currently exist only per action folder (`static params` on the
hooks class), prompted by `promptFromParams` inside the per-pair prompt phase of
`engine.ts`. Project-level configuration (`.hygen.*` → `ProjectConfig` /
`RunnerConfig`) already carries `templates`, `argCase`, `localsDefaults`,
`helpers` and lifecycle `hooks`, resolved by `config-resolver.ts` and, for the
class form, collected by `HygenConfig.toRunnerConfig()`. See proposal.md — Why.

## Goals / Non-Goals

**Goals:**

- Declare shared parameters once per project; ask them exactly once per run
  (variant B — author decision) before the pair loop.
- Uniform semantics with action parameters: coercion, required empty-value
  rejection, `argCase` alias resolution, validation.

**Non-Goals:**

- No per-generator (between global and action) schema level.
- No changes to the descriptor shape or to the legacy prompt hooks.
- No new CLI surface beyond what the schema already implies.

## Decisions

- **`params` joins the project-config key set.** `ProjectConfig`/`RunnerConfig`
  gain `params?: ParamsSchema`; `HygenConfig` gets the field and
  `toRunnerConfig()` carries it; `config-resolver.ts` accepts the key. The
  schema is validated with the existing `validateParamsSchema` at resolution
  time so a typo fails before any pair runs (same contract as `static params`).

- **Global phase lives in `engine.ts`, before the pair loop.** After
  `params()` produces the base args and before the per-generator iteration:
  `promptFromParams(config.params ?? [], createPrompter, baseArgs)` — once per
  run — with the resolved values merged into the base args that seed each
  pair's `hookArgs`. Rationale: the once-per-run requirement cannot be met
  inside the per-pair phase without hidden cross-pair state; an explicit phase
  keeps the documented order readable: `coerce → global prompt → per-pair
(beforeEach → action prompt → render)`. _Alternative:_ cache answers across
  pairs inside the prompt phase — rejected: implicit state, and global answers
  would arrive after some `beforeEach` hooks already ran.

- **Merge precedence: action overrides global, with a warning.** At the
  action's prompt phase the effective schema is
  `global.filter(not shadowed).concat(actionParams)`; a name present on both
  levels logs a warning naming the parameter and both levels, and the action
  descriptor wins (author decision). A warning — not an error — keeps small
  schemas composable while making the shadowing visible.

- **`argCase` aliases apply to the global phase for free.** The global phase
  runs on the same normalized `cleanArgv` keys, and `promptFromParams` already
  resolves descriptor names under `normalizeFlagKey` aliases and mirrors values
  under both keys — no new code, only tests.

- **Required/empty rules are shared.** The global schema goes through the same
  `promptFromParams` (TTY re-ask via enquirer `validate`) and `validateParams`
  (empty/whitespace → `ParamRequiredError`) paths.

## Risks / Trade-offs

- **New lifecycle position:** global prompts run before `beforeEach`/`beforeAll`
  hooks of any pair. Documented as the new canonical order; projects relying on
  prompting inside hooks are unaffected because they use their own prompt calls.
- **Warning volume:** a project shadowing a global name in many actions gets
  one warning per action pair. Accepted: the warning points at a real config
  smell; deduplication per run can be added later if it proves noisy.
- **Embedders:** `runner(args, config)` callers that build `RunnerConfig`
  manually gain the field optionally — no signature changes.
