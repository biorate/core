import { ClickhouseConnector as ChConnector } from '@biorate/clickhouse';
import { Mockable } from '../../src';

@Mockable({})
export class ClickhouseConnector extends ChConnector {}
