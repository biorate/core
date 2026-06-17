import { SchemaRegistryConnector as BaseSchemaRegistryConnector } from '@biorate/schema-registry';
import { Mockable } from '../../src';
import { createMockSetup } from './helpers';

@Mockable({})
export class SchemaRegistryConnector extends BaseSchemaRegistryConnector {}

export const subject = 'unimock-test-subject';

const config = {
  SchemaRegistry: [{ name: 'connection', baseURL: 'http://localhost:8085' }],
};

export const { setup, teardown } = createMockSetup(SchemaRegistryConnector, config);
