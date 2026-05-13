/**
 * @confluentinc/kafka-javascript exposes a single CJS `module.exports`. Node ESM does not support
 * `import { AdminClient } from '…'` for that shape; default-import once and re-export values here.
 */
import confluent from '@confluentinc/kafka-javascript';

const k = confluent as typeof import('@confluentinc/kafka-javascript');

export const AdminClient = k.AdminClient;
export const Producer = k.Producer;
export const KafkaConsumer = k.KafkaConsumer;
export const HighLevelProducer = k.HighLevelProducer;
export const CODES = k.CODES;
