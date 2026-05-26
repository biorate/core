import { tmpdir } from 'os';
import { join } from 'path';

/**
 * @description Docker Compose service endpoints (localhost).
 * Keep in sync with `/docker-compose.yml`.
 */
export const dockerEndpoints = {
  pg: {
    name: 'connection',
    options: {
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'postgres',
      port: 5432,
    },
  },
  redis: {
    name: 'connection',
    host: 'localhost',
    options: {
      url: 'redis://localhost:6379',
    },
  },
  ioredis: {
    name: 'connection',
    options: {
      host: 'localhost',
      port: 6379,
      reconnectTimes: -1,
      reconnectTimeoutDelta: 1000,
      reconnectTimeoutLimit: 1000,
    },
  },
  kafka: {
    global: {
      brokers: ['localhost:9092'],
      clientId: 'biorate-test',
      logLevel: 1 as const,
    },
    producer: {
      name: 'producer',
      global: '#{KafkaJSGlobal}',
      options: {},
    },
    consumer: {
      name: 'consumer',
      global: '#{KafkaJSGlobal}',
      subscribe: { topics: ['biorate-test-topic'], fromBeginning: true },
      options: {
        groupId: 'biorate-test',
      },
    },
  },
  rdkafka: {
    global: {
      'metadata.broker.list': 'localhost:9092',
      'group.id': 'kafka',
      'socket.keepalive.enable': true,
      'queue.buffering.max.ms': 5,
      'allow.auto.create.topics': false,
    },
    topic: {
      'auto.offset.reset': 'earliest',
      'enable.auto.commit': false,
    },
    admin: {
      name: 'admin',
      global: '#{RDKafkaGlobal}',
    },
    producer: {
      name: 'producer',
      global: '#{RDKafkaGlobal}',
      pollInterval: 0,
    },
    highLevelProducer: {
      name: 'highLevelProducer',
      global: '#{RDKafkaGlobal}',
      pollInterval: 0,
    },
    consumer: {
      name: 'consumer',
      global: '#{RDKafkaGlobal}',
      topic: '#{RDKafkaTopic}',
    },
    consumerStream: {
      name: 'consumer',
      global: '#{RDKafkaGlobal}',
      topic: '#{RDKafkaTopic}',
      stream: { topics: ['test'] },
      concurrency: 1,
    },
  },
  amqp: {
    name: 'amqp',
    urls: ['amqp://guest:guest@localhost:5672'],
  },
  mongodb: {
    name: 'connection',
    host: 'mongodb://localhost:27017/',
    options: {
      dbName: 'test',
    },
  },
  mssql: {
    name: 'connection',
    options: {
      server: 'localhost',
      user: 'sa',
      password: 'admin_007',
      database: 'master',
      options: {
        trustServerCertificate: true,
      },
    },
  },
  clickhouse: {
    name: 'connection',
    options: {},
  },
  minio: {
    name: 'connection',
    options: {
      endPoint: 'localhost',
      port: 9000,
      accessKey: 'admin',
      secretKey: 'minioadmin',
      useSSL: false,
    },
  },
  vault: {
    name: 'connection',
    options: {
      apiVersion: 'v1',
      endpoint: 'http://localhost:8200',
      token: 'admin',
    },
  },
  opensearch: {
    name: 'dev',
    options: {
      node: 'https://admin:fo4Gai1phah7eexu@localhost:9200',
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  sequelize: {
    name: 'connection',
    options: {
      logging: false,
      dialect: 'sqlite',
      storage: join(tmpdir(), 'biorate-sequelize-test.db'),
    },
  },
} as const;

export type ConnectorKind =
  | 'pg'
  | 'redis'
  | 'ioredis'
  | 'kafka'
  | 'rdkafka'
  | 'amqp'
  | 'mongodb'
  | 'mssql'
  | 'clickhouse'
  | 'minio'
  | 'vault'
  | 'opensearch'
  | 'sequelize';

/** @description Config fragments merged into `IConfig` per profile and connector set. */
export function getProfileConfig(
  connectors: ConnectorKind[],
  profile: 'memory' | 'docker' = 'memory',
): Record<string, unknown> {
  const config: Record<string, unknown> = {};

  if (connectors.includes('pg')) {
    config.Pg = [
      profile === 'memory'
        ? { name: dockerEndpoints.pg.name, options: {} }
        : { name: dockerEndpoints.pg.name, options: { ...dockerEndpoints.pg.options } },
    ];
  }

  if (connectors.includes('redis')) {
    config.Redis = [
      profile === 'memory'
        ? { name: dockerEndpoints.redis.name, host: 'memory', options: {} }
        : {
            name: dockerEndpoints.redis.name,
            host: dockerEndpoints.redis.host,
            options: { ...dockerEndpoints.redis.options },
          },
    ];
  }

  if (connectors.includes('ioredis')) {
    config.IORedis = [
      profile === 'memory'
        ? { name: dockerEndpoints.ioredis.name, options: {} }
        : {
            name: dockerEndpoints.ioredis.name,
            options: { ...dockerEndpoints.ioredis.options },
          },
    ];
  }

  if (connectors.includes('kafka')) {
    config.KafkaJSGlobal = { ...dockerEndpoints.kafka.global };
    config.KafkaJSProducer = [{ ...dockerEndpoints.kafka.producer }];
    config.KafkaJSConsumer = [{ ...dockerEndpoints.kafka.consumer }];
  }

  if (connectors.includes('rdkafka')) {
    config.RDKafkaGlobal = { ...dockerEndpoints.rdkafka.global };
    config.RDKafkaTopic = { ...dockerEndpoints.rdkafka.topic };
    config.RDKafkaAdmin = [{ ...dockerEndpoints.rdkafka.admin }];
    config.RDKafkaProducer = [{ ...dockerEndpoints.rdkafka.producer }];
    config.RDKafkaHighLevelProducer = [{ ...dockerEndpoints.rdkafka.highLevelProducer }];
    config.RDKafkaConsumer = [{ ...dockerEndpoints.rdkafka.consumer }];
    config.RDKafkaConsumerStream = [{ ...dockerEndpoints.rdkafka.consumerStream }];
  }

  if (connectors.includes('amqp')) {
    config.Amqp = [
      profile === 'memory'
        ? { name: dockerEndpoints.amqp.name, urls: ['memory://'] }
        : { name: dockerEndpoints.amqp.name, urls: [...dockerEndpoints.amqp.urls] },
    ];
  }

  if (connectors.includes('mongodb')) {
    config.MongoDB = [
      profile === 'memory'
        ? {
            name: dockerEndpoints.mongodb.name,
            host: 'memory://',
            options: { dbName: dockerEndpoints.mongodb.options.dbName },
          }
        : {
            name: dockerEndpoints.mongodb.name,
            host: dockerEndpoints.mongodb.host,
            options: { ...dockerEndpoints.mongodb.options },
          },
    ];
  }

  if (connectors.includes('mssql')) {
    config.Mssql = [
      profile === 'memory'
        ? { name: dockerEndpoints.mssql.name, options: {} }
        : { name: dockerEndpoints.mssql.name, options: { ...dockerEndpoints.mssql.options } },
    ];
  }

  if (connectors.includes('clickhouse')) {
    config.Clickhouse = [
      profile === 'memory'
        ? { name: dockerEndpoints.clickhouse.name, options: {} }
        : { name: dockerEndpoints.clickhouse.name, options: { ...dockerEndpoints.clickhouse.options } },
    ];
  }

  if (connectors.includes('minio')) {
    config.Minio = [
      profile === 'memory'
        ? { name: dockerEndpoints.minio.name, options: {} }
        : { name: dockerEndpoints.minio.name, options: { ...dockerEndpoints.minio.options } },
    ];
  }

  if (connectors.includes('vault')) {
    config.Vault = [
      profile === 'memory'
        ? { name: dockerEndpoints.vault.name, options: {} }
        : { name: dockerEndpoints.vault.name, options: { ...dockerEndpoints.vault.options } },
    ];
  }

  if (connectors.includes('opensearch')) {
    config.OpenSearch = [
      profile === 'memory'
        ? { name: dockerEndpoints.opensearch.name, options: {} }
        : {
            name: dockerEndpoints.opensearch.name,
            options: { ...dockerEndpoints.opensearch.options },
          },
    ];
  }

  if (connectors.includes('sequelize')) {
    config.Sequelize = [
      {
        name: dockerEndpoints.sequelize.name,
        options:
          profile === 'memory'
            ? { logging: false, dialect: 'sqlite', storage: ':memory:' }
            : { ...dockerEndpoints.sequelize.options },
      },
    ];
  }

  return config;
}
