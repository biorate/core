import { expect } from 'vitest';
import { container } from '@biorate/inversion';
import { Root, root } from './__mocks__';

describe('@biorate/opensearch', function () {
  beforeAll(async () => await root.$run());

  afterAll(async () => {
    await root.opensearchConnector.current?.indices.delete({
      index: 'connector_test',
    });
  });

  it('create', async () =>
    expect(
      await root.opensearchConnector.current?.indices.create({
        index: 'connector_test',
        body: {
          settings: {
            index: {
              number_of_shards: 1,
              number_of_replicas: 1,
            },
          },
        },
      }),
    )
      .to.have.property('statusCode')
      .to.equal(200));
});
