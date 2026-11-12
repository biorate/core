import { BaseError } from '@biorate/errors';
import type { ActionResult, RunFailure } from './types';

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

  public constructor(failures: RunFailure[], results: ActionResult[]) {
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
