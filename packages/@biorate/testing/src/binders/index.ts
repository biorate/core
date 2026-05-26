import { ConnectorKind } from '../endpoints';
import { TestingConnectorNotBoundError } from '../errors';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';
import { bindAmqp } from './amqp';
import { bindClickhouse } from './clickhouse';
import { bindIORedis } from './ioredis';
import { bindKafka } from './kafka';
import { bindMinio } from './minio';
import { bindMongoDB } from './mongodb';
import { bindMssql } from './mssql';
import { bindOpenSearch } from './opensearch';
import { bindPg } from './pg';
import { bindRdkafka } from './rdkafka';
import { bindRedis } from './redis';
import { bindSequelize } from './sequelize';
import { bindVault } from './vault';

export type ConnectorBinder = (registry: ITestBindingRegistry, profile: TestProfile) => void;

const CONNECTOR_BINDERS: Record<ConnectorKind, ConnectorBinder> = {
  pg: bindPg,
  redis: bindRedis,
  ioredis: bindIORedis,
  kafka: bindKafka,
  rdkafka: bindRdkafka,
  amqp: bindAmqp,
  mongodb: bindMongoDB,
  mssql: bindMssql,
  clickhouse: bindClickhouse,
  minio: bindMinio,
  vault: bindVault,
  opensearch: bindOpenSearch,
  sequelize: bindSequelize,
};

/** @description Binds all requested connectors for the test profile. */
export function bindConnectors(
  registry: ITestBindingRegistry,
  profile: TestProfile,
  connectors: ConnectorKind[],
) {
  for (const kind of connectors) {
    const bind = CONNECTOR_BINDERS[kind];
    if (!bind) throw new TestingConnectorNotBoundError(kind);
    bind(registry, profile);
  }
}

export {
  bindPg,
  bindRedis,
  bindIORedis,
  bindKafka,
  bindRdkafka,
  bindAmqp,
  bindMongoDB,
  bindMssql,
  bindClickhouse,
  bindMinio,
  bindVault,
  bindOpenSearch,
  bindSequelize,
};
