import { expect } from 'chai';
import { container } from '@biorate/inversion';
import { Root, Connection } from './__mocks__';

describe('@biorate/connector', function () {
  let root: Root;
  this.timeout(3e4);

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
  });

  it('get connection', () => {
    expect(root.connector.connection('test-connection'))
      .to.be.an.instanceof(Connection)
      .to.have.property('name', 'test-connection');
  });
});
