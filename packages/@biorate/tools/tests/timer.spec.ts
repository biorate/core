import { assert } from 'chai';
import { timer } from '../src';

describe('timer', () => {
  it('wait', async () => await timer.wait(1));

  it('tick', async () => await timer.tick());

  it('immediate', async () => await timer.immediate());
});
