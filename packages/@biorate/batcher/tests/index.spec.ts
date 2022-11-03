import { expect } from 'chai';
import { IBatcher, Batcher } from '../src';
import './__mocks__';

describe('@biorate/batcher', function () {
  const batcher: IBatcher = new Batcher<{ data: string }, { test: string }>();

  after(() => process.exit(0));

  it('register / add', (done) => {
    batcher.register((tasks) => {
      expect(tasks).toMatchSnapshot();
      done();
    });
    batcher.add({ data: 'one' }, { test: 'one' });
    batcher.add({ data: 'two' }, { test: 'two' });
    batcher.add({ data: 'three' }, { test: 'three' });
  });
});
