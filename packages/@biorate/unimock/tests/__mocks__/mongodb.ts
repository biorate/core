import { MongoDBConnector as RawMongoDBConnector } from '@biorate/mongodb';
import { Mockable } from '../../src';

@Mockable({})
export class MongoDBConnector extends RawMongoDBConnector {}
