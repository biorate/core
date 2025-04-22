import 'reflect-metadata';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { gcpDetector } from '@opentelemetry/resource-detector-gcp';
import { alibabaCloudEcsDetector } from '@opentelemetry/resource-detector-alibaba-cloud';
import { awsEksDetector, awsEc2Detector } from '@opentelemetry/resource-detector-aws';
// import { ResourceDetector } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import {
  envDetector,
  hostDetector,
  osDetector,
  processDetector,
} from '@opentelemetry/resources';
import { OTELMetricsExporterError } from './errors';

export * from '@opentelemetry/api';
export * from './decorators';
/**
 * @description
 * OpenTelemetry integration
 *
 * @example
 * ```
 * import { scope, span } from '@biorate/opentelemetry';
 *
 * @scope('v1')
 * export class Test {
 *   @span()
 *   public test1(a: number, b: number) {
 *     return { a, b };
 *   }
 *
 *   @span()
 *   public test2(a: number, b: number) {
 *     return a + b;
 *   }
 *
 *   @span()
 *   public test3(a: number, b: number) {
 *     throw new Error('test error');
 *   }
 * }
 *
 * const test = new Test();
 * test.test1(1, 2);
 * ```
 */
function getMetricReader() {
  switch (process.env.OTEL_METRICS_EXPORTER) {
    case undefined:
    case '':
    case 'otlp':
      return new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() });
    case 'prometheus':
      return new PrometheusExporter({});
    case 'console':
      return new PeriodicExportingMetricReader({ exporter: new ConsoleMetricExporter() });
    case 'none':
      return;
    default:
      throw new OTELMetricsExporterError();
  }
}

const resources = {
  // Standard resource detectors.
  containerDetector,
  envDetector,
  hostDetector,
  osDetector,
  processDetector,
  // Cloud resource detectors.
  alibabaCloudEcsDetector,
  // Ordered AWS Resource Detectors as per:
  // https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourcedetectionprocessor/README.md#ordering
  awsEksDetector,
  awsEc2Detector,
  gcpDetector,
};

const otelExcludeDetectors = (process.env.OTEL_EXCLUDED_DETECTORS ?? '').split(',');

const resourceDetectors: any[] = []; //TODO:
for (const field in resources)
  if (!otelExcludeDetectors.includes(field))
    resourceDetectors.push(resources[<keyof typeof resources>field]);

const sdk = new NodeSDK({
  autoDetectResources: true,
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: new OTLPTraceExporter(),
  metricReader: getMetricReader(),
  resourceDetectors,
});

sdk.start();
