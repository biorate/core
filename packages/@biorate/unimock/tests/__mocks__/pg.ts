import { PgConnector as RawPgConnector } from '@biorate/pg';
import { Mockable } from '../../src';

@Mockable({})
export class PgConnector extends RawPgConnector {}
