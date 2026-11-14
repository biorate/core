import { BaseError } from '@biorate/errors';
import type { ActionResult, ActionStatusEntry, RunFailure } from './types';

/**
 * @description Thrown when the user has not specified a generator or action,
 * or the action folder cannot be found. Signals the CLI to print help. */
export class ShowHelpError extends BaseError {
  public constructor(message: string) {
    super('%s', [message]);
  }
}

/**
 * @description Thrown at the end of a `--keep-going` run when one or more
 * `(name, action)` pairs failed. Carries the partial `results` (the successful
 * operation outcomes that did run) and the structured `failures` list so the
 * runner can surface them in `RunnerResult.failures` instead of discarding the
 * partial work. Extends `ShowHelpError` so the CLI still prints help, matching
 * the pre-existing keep-going failure reporting.
 * */
export class KeepGoingError extends ShowHelpError {
  /** @description The operation outcomes that succeeded before the failures. */
  public readonly results: ActionResult[];
  /** @description The structured list of failed pairs. */
  public readonly failures: RunFailure[];
  /**
   * @description Per-action three-state outcomes (ok / skipped / failed), one
   * entry per rendered action, so the runner can surface `RunnerResult.statuses`
   * for a `--keep-going` run that hit failures. */
  public readonly statuses: ActionStatusEntry[];

  public constructor(
    failures: RunFailure[],
    results: ActionResult[],
    statuses: ActionStatusEntry[] = [],
  ) {
    super(
      `the run failed for ${failures.length} pair(s):\n${failures
        .map(
          (f) =>
            `action '${f.action}'${
              f.name !== undefined ? ` for name '${f.name}'` : ''
            }: ${f.error}`,
        )
        .join('\n')}`,
    );
    this.results = results;
    this.failures = failures;
    this.statuses = statuses;
  }
}

/**
 * @description Thrown when an EJS template or its frontmatter fails to render. */
export class TemplateRenderError extends BaseError {
  public constructor(file: string, cause: unknown) {
    super('Template render error in [%s]: [%s]', [
      file,
      (cause as Error)?.message ?? cause,
    ]);
  }
}

/**
 * @description Thrown when an action folder for a generator does not exist. */
export class TemplateNotFoundError extends BaseError {
  public constructor(generator: string, action: string) {
    super(`I can't find action [%s] for generator [%s]`, [action, generator]);
  }
}

/**
 * @description Thrown when an inject target file does not exist. */
export class InjectionTargetNotFoundError extends BaseError {
  public constructor(to: string) {
    super('Cannot inject to [%s]: file does not exist', [to]);
  }
}

/**
 * @description Thrown when an inject `before`/`after` anchor cannot be found in
 * the target file. The inject operation fails and the file is left untouched. */
export class InjectionAnchorNotFoundError extends BaseError {
  public constructor(anchor: string, to: string) {
    super('Injection anchor [%s] not found in [%s]', [anchor, to]);
  }
}

/**
 * @description Thrown when inject-family frontmatter options are used together
 * incorrectly: `inject` with `replace`, or `replace` with an anchor that does
 * not support replacement (only `before`/`after` do). */
export class TemplateConfigError extends BaseError {
  public constructor(message: string) {
    super('%s', [message]);
  }
}

/**
 * @description Thrown when a shell command fails and exit code is not ignored. */
export class ShellCommandError extends BaseError {
  public constructor(command: string, cause: unknown) {
    super('Shell command [%s] failed: [%s]', [
      command,
      (cause as Error)?.message ?? cause,
    ]);
  }
}

/**
 * @description Thrown when a template declares both `mirror: true` and a `glob:`
 * attribute. Mirroring derives a single target path from the template file's own
 * name, which is meaningless for a glob that expands into many files, so the
 * combination is rejected as a configuration error rather than silently resolved.
 */
/**
 * @description Thrown when a mirrored template's path contains a `$IDENTIFIER$`
 * macro whose identifier cannot be resolved from the run locals (prompt-hook
 * answers, `name`, CLI args, or values exported by the config helpers factory).
 * The run fails fast for that action; no file is written. */
export class PathMacroResolutionError extends BaseError {
  public constructor(file: string, segment: string, identifier: string) {
    super(
      'Template [%s] has a mirrored path segment [%s] with the macro $%s$, which ' +
        'cannot be resolved from the run locals. Define it in the prompt hook, pass ' +
        'it as a CLI flag, or export it from the config helpers factory.',
      [file, segment, identifier],
    );
  }
}

export class GlobMirrorConflictError extends BaseError {
  public constructor(file: string) {
    super(
      'Template [%s] declares both `mirror: true` and `glob:`, which are incompatible: ' +
        "mirroring derives a target path from the template's own name, but a glob " +
        'expands into multiple files. Remove one of the two attributes.',
      [file],
    );
  }
}

/**
 * @description Thrown when a `.hygen.ts` config file is resolved but `ts-node`
 * cannot be registered to transpile it on the fly (typically `ts-node` is not
 * installed in the project). */
export class ConfigTsNodeError extends BaseError {
  public constructor(file: string, cause: unknown) {
    super(
      'TypeScript config [%s] requires ts-node: install it with `npm i -D ts-node` (error: [%s])',
      [file, (cause as Error)?.message ?? cause],
    );
  }
}

/**
 * @description Thrown when a `.ts` hook file is resolved but `ts-node` cannot be
 * registered to transpile it on the fly (typically `ts-node` is not installed in
 * the project). Mirrors `ConfigTsNodeError` for the action-hook layer. */
export class HookTsNodeError extends BaseError {
  public constructor(file: string, cause: unknown) {
    super(
      'TypeScript hook [%s] requires ts-node: install it with `npm i -D ts-node` (error: [%s])',
      [file, (cause as Error)?.message ?? cause],
    );
  }
}

/**
 * @description Thrown when a `hooks.*` action file does not export a class as its
 * default export. Names the offending file and the expected shape so the
 * misconfiguration is explicit rather than surfacing as an opaque `new` error. */
export class HookModuleError extends BaseError {
  public constructor(file: string, detail: string) {
    super('Hook file [%s] must export a class as its default export (received [%s])', [
      file,
      detail,
    ]);
  }
}

/**
 * @description Thrown when a template's `transform:` frontmatter attribute
 * references a name that is not registered in the config's `transforms` map.
 * Naming the missing transform and the config key makes the misconfiguration
 * explicit rather than silently skipping the post-processing step.
 */
export class UnknownTransformError extends BaseError {
  public constructor(name: string) {
    super('Unknown transform [%s]: register it under the `transforms` config key', [
      name,
    ]);
  }
}

/**
 * @description Thrown when a `setup` frontmatter value is not a valid repository. */
export class SetupRepositoryError extends BaseError {
  public constructor(setup: string) {
    super('[%s] must be a repo', [setup]);
  }
}

/**
 * @description Thrown when the CLI arguments are used incorrectly — for example the
 * repeated `--name` flag, which is rejected in favour of a comma-separated positional
 * list. */
export class CliArgumentError extends BaseError {
  public constructor(message: string) {
    super('%s', [message]);
  }
}

/**
 * @description Thrown when the removed `--name` flag is used without an active legacy
 * escape. The message shows the offending flag, the positional equivalent (the
 * single-path grammar `hygen <generator> <action[,action...]> <name[,name...]>`) and
 * the two migration escapes (`HYGEN_LEGACY_NAME=1` and `legacyNameFlag: true`). A
 * dedicated class lets embedders catch and map the removal, as opposed to a generic
 * `CliArgumentError`. */
export class NameFlagRemovedError extends BaseError {
  public constructor(name: unknown) {
    const shown = Array.isArray(name) ? name.join(', ') : String(name);
    super(
      `the '--name' flag is no longer supported (received '--name %s'). ` +
        `Pass the name as a positional argument instead: ` +
        `hygen <generator> <action[,action...]> <name[,name...]> (e.g. 'hygen mailer new fancy'). ` +
        `To keep using '--name' during migration, enable the legacy escape: ` +
        `set HYGEN_LEGACY_NAME=1, or pass legacyNameFlag: true in the RunnerConfig.`,
      [shown],
    );
  }
}

/**
 * @description Thrown when a CLI flag value cannot be coerced to the type
 * declared by an action parameter descriptor. */
export class ParamCoercionError extends BaseError {
  public constructor(name: string, type: string, raw: unknown) {
    super(
      `cannot coerce the value [%s] of the '--%s' parameter to the expected type [%s]`,
      [String(raw), name, type],
    );
  }
}

/**
 * @description Thrown when a parameter declared `required: true` was neither
 * supplied as a flag nor answered in the prompt phase. */
export class ParamRequiredError extends BaseError {
  public constructor(name: string) {
    super(`the parameter '--%s' is required but was not supplied`, [name]);
  }
}

/**
 * @description Thrown when a parameter descriptor declares an unrecognized
 * string type. Detected when the action's hooks are loaded, so a schema mistake
 * fails before any pair runs. */
export class ParamUnknownTypeError extends BaseError {
  public constructor(name: string, type: string) {
    super(`the parameter '--%s' declares an unknown type [%s]`, [name, type]);
  }
}
