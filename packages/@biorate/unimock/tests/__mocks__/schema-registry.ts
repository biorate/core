import { SchemaRegistryConnector as BaseSchemaRegistryConnector } from '@biorate/schema-registry';
import { Mockable } from '../../src';

@Mockable({})
export class SchemaRegistryConnector extends BaseSchemaRegistryConnector {}
