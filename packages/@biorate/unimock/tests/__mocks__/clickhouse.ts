import { ClickhouseConnector as ChConnector } from '@biorate/clickhouse';
import { Mockable } from '../../src';
import { createMockSetup } from './helpers';

@Mockable({})
export class ClickhouseConnector extends ChConnector {}

const config = {
  Clickhouse: [{ name: 'connection', options: {} }],
};

export const { setup, teardown } = createMockSetup(ClickhouseConnector, config);
