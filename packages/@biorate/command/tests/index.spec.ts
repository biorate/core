import { assert, expect } from 'chai';
import { CommandExecutionError } from '../src';
import {
  EchoSyncCommand,
  EchoAsyncCommand,
  EchoSyncErrorCommand,
  EchoAsyncErrorCommand,
  ReturnAsyncSTDERRCommand,
} from './__mocks__';

describe('@biorate/command', () => {
  it('SyncCommand', async () => {
    const params = { value: '1\n' };
    const result = await EchoSyncCommand.execute(params);
    assert.equal(params.value, result);
  });

  it('AsyncCommand', async () => {
    const params = { value: '2\n' };
    const result = await EchoAsyncCommand.execute(params);
    assert.equal(params.value, result);
  });

  it('SyncErrorCommand', async () => {
    let error: Error | null = null;
    try {
      await EchoSyncErrorCommand.execute();
    } catch (e: any) {
      error = e;
    }
    assert(error instanceof CommandExecutionError);
  });

  it('AsyncErrorCommand', async () => {
    let error: Error | null = null;
    try {
      await EchoAsyncErrorCommand.execute();
    } catch (e: any) {
      error = e;
    }
    assert(error instanceof CommandExecutionError);
  });

  it('ReturnAsyncSTDERRCommand', async () => {
    assert.equal(
      await ReturnAsyncSTDERRCommand.execute(),
      [ReturnAsyncSTDERRCommand.stderrText, ReturnAsyncSTDERRCommand.stdoutText].join(
        '\n',
      ) + '\n',
    );
  });
});
