import 'reflect-metadata';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { gcpDetector } from '@opentelemetry/resource-detector-gcp';
import { alibabaCloudEcsDetector } from '@opentelemetry/resource-detector-alibaba-cloud';
import { awsEksDetector, awsEc2Detector } from '@opentelemetry/resource-detector-aws';
import { ResourceDetector } from '@opentelemetry/resources';
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
import { DataMaskingProcessor } from './data-masking-processor';

export * from '@opentelemetry/api';
export * from './decorators';
/**
 * @description
 * OpenTelemetry integration
 *
 * @example
 * ```
 * process.env.OTEL_METRICS_EXPORTER = 'console';
 * process.env.OTEL_KUBE_NODE_NAME = 'localhost';
 * process.env.OTEL_SERVICE_NAME = 'test-app';
 * process.env.OTEL_TRACES_SAMPLER = 'always_on';
 * process.env.OTEL_TRACES_SAMPLER_ARG = '1';
 * process.env.OTEL_PROPAGATORS = 'tracecontext,baggage';
 * process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:14317';
 * process.env.OTEL_NODE_IP = 'localhost';
 * process.env.OTEL_RESOURCE_ATTRIBUTES_NODE_NAME = 'application-nodes';
 * process.env.OTEL_RESOURCE_ATTRIBUTES =
 *   'k8s.container.name=app,k8s.deployment.name=app,k8s.namespace.name=test,k8s.node.name=application-nodes,k8s.pod.name=app,k8s.replicaset.name=app,service.instance.id=test.app,service.version=develop';
 * process.env.OTEL_POD_IP = 'localhost';
 * process.env.OTEL_RESOURCE_ATTRIBUTES_POD_NAME = 'app';
 *
 * import { scope, span } from '@biorate/opentelemetry';
 *
 * @scope('v2')
 * export class Test {
 *   @span()
 *   public test(a: number, b: number) {
 *     return { a, b };
 *   }
 * }
 *
 * const test = new Test();
 * test.test(1, 2);
 * ```
 */
function getMetricReader() {
  switch (process.env.OTEL_METRICS_EXPORTER) {
    case undefined:
    case '':
    case 'none':
      return;
    case 'otlp':
      return new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() });
    case 'prometheus':
      return new PrometheusExporter({});
    case 'console':
      return new PeriodicExportingMetricReader({ exporter: new ConsoleMetricExporter() });
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

const resourceDetectors: ResourceDetector[] = [];
for (const field in resources)
  if (!otelExcludeDetectors.includes(field))
    resourceDetectors.push(resources[<keyof typeof resources>field]);

const exporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
  autoDetectResources: true,
  instrumentations: [getNodeAutoInstrumentations()],
  spanProcessors: [new DataMaskingProcessor(exporter)],
  traceExporter: exporter,
  metricReader: getMetricReader(),
  resourceDetectors,
});

sdk.start();
