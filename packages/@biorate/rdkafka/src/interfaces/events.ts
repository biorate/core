export type KafkaClientEvents =
  | 'disconnected'
  | 'ready'
  | 'connection.failure'
  | 'event.error'
  | 'event.stats'
  | 'event.log'
  | 'event.event'
  | 'event.throttle';
export type KafkaConsumerEvents =
  | 'data'
  | 'partition.eof'
  | 'rebalance'
  | 'rebalance.error'
  | 'subscribed'
  | 'unsubscribed'
  | 'unsubscribe'
  | 'offset.commit'
  | KafkaClientEvents;
export type KafkaProducerEvents = 'delivery-report' | KafkaClientEvents;
