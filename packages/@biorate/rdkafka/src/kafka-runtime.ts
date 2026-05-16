/**
 * @confluentinc/kafka-javascript exposes a single CJS `module.exports`. Node ESM does not support
 * `import { AdminClient } from '…'` for that shape; default-import once and re-export values here.
 */
import confluent from '@confluentinc/kafka-javascript';

const k = confluent as typeof import('@confluentinc/kafka-javascript');

/**
 * @description Re-exported AdminClient from `@confluentinc/kafka-javascript`.
 */
export const AdminClient = k.AdminClient;

/**
 * @description Re-exported Producer from `@confluentinc/kafka-javascript`.
 */
export const Producer = k.Producer;

/**
 * @description Re-exported KafkaConsumer from `@confluentinc/kafka-javascript`.
 */
export const KafkaConsumer = k.KafkaConsumer;

/**
 * @description Re-exported HighLevelProducer from `@confluentinc/kafka-javascript`.
 */
export const HighLevelProducer = k.HighLevelProducer;

/**
 * @description Re-exported CODES from `@confluentinc/kafka-javascript`.
 */
export const CODES = k.CODES;
