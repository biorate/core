# Elastic

Elastic OOP static interface

### Examples:

```ts
// Merge config
container.get<IConfig>(Types.Config).merge({
  Elastic: [
    {
      name: 'dev',
      options: {
        node: '${ELASTIC_PROTOCOL}://${ELASTIC_AUTH}@${ELASTIC_HOST}:${ELASTIC_PORT}',
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
  ],
});

@injectable()
export class SomeService {
  @inject(Types.ElasticConnector) private elasticConnector: IElasticConnector;

  private doStuffWithElastic(): void {
    // Create index
    await this.elasticConnector.current.indices.create({
      index: 'test-index',
      body: {
        settings: {
          number_of_shards: 3,
          number_of_replicas: 2,
        },
      },
    });

    await this.elasticConnector.current.index({
      id: 'testid1',
      index: 'test-index',
      body: {
        name: 'Vadim',
        company: 'Lemana Pro',
      },
    });
  }
}
```
