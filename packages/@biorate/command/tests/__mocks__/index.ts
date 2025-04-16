import { CommonCommandSync, CommonCommandAsync } from '../../src';

export class EchoSyncCommand extends CommonCommandSync {
  protected command = [`echo #{value}`];

  protected override options = { cwd: '/tmp' };

  public static override execute(options: { value: string | number }) {
    return super.execute(options);
  }
}

export class EchoAsyncCommand extends CommonCommandAsync {
  protected command = [`echo #{value}`];

  protected override options = { cwd: '/tmp' };

  public static override execute(options: { value: string | number }) {
    return super.execute(options);
  }
}

export class EchoSyncErrorCommand extends CommonCommandSync {
  protected command = [`undefined_command`];
}

export class EchoAsyncErrorCommand extends CommonCommandAsync {
  protected command = [`undefined_command`];
}

export class ReturnAsyncSTDERRCommand extends CommonCommandAsync {
  public static stderrText = 'stderr';
  public static stdoutText = 'stdout';

  protected command = [
    `echo "${ReturnAsyncSTDERRCommand.stderrText}" >&2;`,
    `echo "${ReturnAsyncSTDERRCommand.stdoutText}";`,
  ];
}
