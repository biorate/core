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
  amqp: {
    name: 'amqp',
    urls: ['amqp://guest:guest@localhost:5672'],
  },
} as const;

export type ConnectorKind = 'pg' | 'redis' | 'kafka' | 'amqp';

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

  if (connectors.includes('kafka')) {
    config.KafkaJSGlobal = { ...dockerEndpoints.kafka.global };
    config.KafkaJSProducer = [{ ...dockerEndpoints.kafka.producer }];
    config.KafkaJSConsumer = [{ ...dockerEndpoints.kafka.consumer }];
  }

  if (connectors.includes('amqp')) {
    config.Amqp = [
      profile === 'memory'
        ? { name: dockerEndpoints.amqp.name, urls: ['memory://'] }
        : { name: dockerEndpoints.amqp.name, urls: [...dockerEndpoints.amqp.urls] },
    ];
  }

  return config;
}
