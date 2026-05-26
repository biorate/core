import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IPgConfig } from '../interfaces';
import { PgUnsupportedInMemoryError } from './errors';
import { MemoryPgClient } from './memory-client';

export type IMemoryPgConnection = MemoryPgClient;

/** @description In-memory PostgreSQL connector for unit and component tests. */
@injectable()
export class MemoryPgConnector extends Connector<IPgConfig, IMemoryPgConnection> {
  protected readonly namespace = 'Pg';

  protected async connect() {
    const client = new MemoryPgClient();
    await client.connect();
    return client;
  }

  public cursor(name: string, query: string, values?: unknown[], config?: unknown) {
    void name;
    void query;
    void values;
    void config;
    throw new PgUnsupportedInMemoryError('cursor');
  }

  public stream(name: string, query: string, values?: unknown[], config?: unknown) {
    void name;
    void query;
    void values;
    void config;
    throw new PgUnsupportedInMemoryError('stream');
  }
}
