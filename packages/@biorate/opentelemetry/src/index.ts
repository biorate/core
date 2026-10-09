import 'reflect-metadata';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { DataMaskingProcessor } from './data-masking-processor';
import {
  exporter,
  getMetricReader,
  resourceDetectors,
  resolveSpanProcessorMode,
  spanProcessorFactories,
} from './utils';

// Skip GCP metadata server detection by default (overridable via env).
if (!process.env.METADATA_SERVER_DETECTION)
  process.env.METADATA_SERVER_DETECTION = 'none';

export * from '@opentelemetry/api';
export * from './decorators';
/**
 * @description
 * OpenTelemetry integration
 *
 * @example
 * ```ts
 * // Minimal setup – environment variables must be set before import.
 * process.env.OTEL_SERVICE_NAME = 'my-app';
 * process.env.OTEL_TRACES_SAMPLER = 'always_on';
 * process.env.OTEL_TRACES_SAMPLER_ARG = '1';
 * process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:4317';
 * process.env.OTEL_SPAN_PROCESSOR = 'batch'; // 'batch' (default) | 'simple' | 'console'
 *
 * import { scope, span } from '@biorate/opentelemetry';
 *
 * @scope('1.0')
 * class Service {
 *   @span({ exclude: ['arguments.0.password', 'result.token'] })
 *   public authenticate(credentials: { password: string; login: string }) {
 *     return { token: 'jwt...', user: { id: 1 } };
 *   }
 * }
 *
 * const svc = new Service();
 * svc.authenticate({ password: 'secret', login: 'admin' });
 * // span.arguments → '[{"login":"admin"}]' (password excluded)
 * // span.result    → '{"user":{"id":1}}'       (token excluded)
 * ```
 *
 * Span processor tuning (optional, defaults shown):
 * - `OTEL_SPAN_PROCESSOR=batch|simple|console` (default `batch`; unknown/empty values fall back to `batch`)
 * - `OTEL_BSP_SCHEDULE_DELAY=5000`, `OTEL_BSP_MAX_QUEUE_SIZE=2048`
 * - `OTEL_BSP_MAX_EXPORT_BATCH_SIZE=512`, `OTEL_BSP_EXPORT_TIMEOUT=30000`
 * - `OTEL_SPAN_ATTR_MAX_LENGTH=2048` truncates string span attributes.
 */
export const sdk = new NodeSDK({
  autoDetectResources: true,
  instrumentations: [getNodeAutoInstrumentations()],
  spanProcessors: [
    new DataMaskingProcessor(
      spanProcessorFactories[resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)](
        exporter,
      ),
    ),
  ],
  metricReaders: getMetricReader(),
  resourceDetectors,
});

sdk.start();
