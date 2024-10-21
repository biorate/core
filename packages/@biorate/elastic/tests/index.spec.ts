import { container } from '@biorate/inversion';
import { Root } from './__mocks__';
import { expect } from 'chai';

describe('@biorate/elastic', function () {
  let root: Root;

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
  });

  after(async () => {
    await root.elasticConnector.current?.indices.delete({
      index: 'connector_test',
    });
  });

  it('create', async () =>
    expect(
      await root.elasticConnector.current?.indices.create({
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
