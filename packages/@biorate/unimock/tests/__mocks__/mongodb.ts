import { MongoDBConnector as RawMongoDBConnector } from '@biorate/mongodb';
import { Mockable } from '../../src';
import { createMockSetup } from './helpers';

@Mockable({})
export class MongoDBConnector extends RawMongoDBConnector {}

const config = {
  MongoDB: [
    {
      name: 'connection',
      host: 'mongodb://localhost:27017/',
      options: { dbName: 'test' },
    },
  ],
};

export const { setup, teardown } = createMockSetup(MongoDBConnector, config);
