import { BaseError } from '@biorate/errors';
import { HookModuleError, HookTsNodeError } from '../src/errors';

describe('hook errors', () => {
  it('HookModuleError is a BaseError naming the file and the received shape', () => {
    const error = new HookModuleError(
      '/tmp/_templates/x/new/hooks.ts',
      'no default export',
    );

    expect(error).toBeInstanceOf(BaseError);
    expect(error.message).toContain('/tmp/_templates/x/new/hooks.ts');
    expect(error.message).toContain('no default export');
    expect(error.message).toContain('class');
  });

  it('HookTsNodeError is a BaseError naming the file and the cause', () => {
    const error = new HookTsNodeError(
      '/tmp/_templates/x/new/hooks.ts',
      new Error('cannot find ts-node'),
    );

    expect(error).toBeInstanceOf(BaseError);
    expect(error.message).toContain('/tmp/_templates/x/new/hooks.ts');
    expect(error.message).toContain('ts-node');
    expect(error.message).toContain('cannot find ts-node');
  });
});
