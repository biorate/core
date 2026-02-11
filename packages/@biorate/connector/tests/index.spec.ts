import { expect } from 'vitest';
import { container } from '@biorate/inversion';
import { Root, Connection, root } from './__mocks__';

describe('@biorate/connector', function () {
  beforeAll(async () => await root.$run());

  it('get connection', () => {
    expect(root.connector.connection('test-connection'))
      .to.be.an.instanceof(Connection)
      .to.have.property('name', 'test-connection');
  });
});
