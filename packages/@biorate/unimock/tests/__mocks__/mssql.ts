import { MssqlConnector as RawMssqlConnector } from '@biorate/mssql';
import { Mockable } from '../../src';

@Mockable({})
export class MssqlConnector extends RawMssqlConnector {}
