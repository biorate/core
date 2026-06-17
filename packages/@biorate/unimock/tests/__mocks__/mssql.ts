import { MssqlConnector as RawMssqlConnector } from '@biorate/mssql';
import { Mockable } from '../../src';
import { createMockSetup } from './helpers';

@Mockable({})
export class MssqlConnector extends RawMssqlConnector {}

const config = {
  Mssql: [
    {
      name: 'connection',
      options: {
        server: 'localhost',
        user: 'sa',
        password: 'admin_007',
        database: 'master',
        options: { trustServerCertificate: true },
      },
    },
  ],
};

export const { setup, teardown } = createMockSetup(MssqlConnector, config);
