import { expect } from 'chai';
import { container } from '@biorate/inversion';
import { Root } from './__mocks__';

describe('@biorate/migrations', function () {
  let root: Root;

  before(async () => await container.get<Root>(Root).$run().catch(console.error));

  it('test', (done) => {});
});
