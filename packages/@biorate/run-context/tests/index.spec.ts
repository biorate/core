import { expect } from 'vitest';
import { Scenario1, Scenario2 } from './__mocks__';
import { Context, Scenario, step } from '../src';
import { RunContextKeyAlreadyExistsError } from '../src/errors';

describe('@biorate/run-context', () => {
  it('Context.run', async () => {
    const ctx = await Context.run([Scenario1, Scenario2], { initial: 'value' });
    expect(ctx.all()).toMatchSnapshot();
  });

  it('set throws RunContextKeyAlreadyExistsError on duplicate key', async () => {
    class DupScenario extends Scenario {
      @step()
      protected async step0() {
        this.ctx.set('initial', true);
      }
    }
    await expect(Context.run([DupScenario], { initial: 'value' })).rejects.toThrow(
      RunContextKeyAlreadyExistsError,
    );
  });
});
