import { PgConnector as RawPgConnector } from '@biorate/pg';
import { Mockable } from '../../src';
import { createMockSetup } from './helpers';

@Mockable({})
export class PgConnector extends RawPgConnector {}

const config = {
  Pg: [
    {
      name: 'connection',
      options: {
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432,
      },
    },
  ],
};

export const { setup, teardown } = createMockSetup(PgConnector, config);
