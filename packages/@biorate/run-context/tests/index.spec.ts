import { expect } from 'chai';
import { Scenario1, Scenario2 } from './__mocks__';
import { Context } from '../src';

describe('@biorate/run-context', function () {
  it('Context.run', async () => {
    const ctx = await Context.run([Scenario1, Scenario2], { initial: 'value' });
    expect(ctx.get()).toMatchSnapshot();
  });
});
