import { expect } from 'vitest';
import { IBatcher, Batcher } from '../src';

describe('@biorate/batcher', function () {
  const batcher: IBatcher = new Batcher<{ data: string }, { test: string }>();

  it('register / add', () =>
    new Promise((done) => {
      batcher.register((tasks) => {
        expect(tasks).toMatchSnapshot();
        done();
      });
      batcher.add({ data: 'one' }, { test: 'one' });
      batcher.add({ data: 'two' }, { test: 'two' });
      batcher.add({ data: 'three' }, { test: 'three' });
    }));
});
