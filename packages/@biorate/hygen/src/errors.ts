import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the user has not specified a generator or action,
 * or the action folder cannot be found. Signals the CLI to print help. */
export class ShowHelpError extends BaseError {
  public constructor(message: string) {
    super('%s', [message]);
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
