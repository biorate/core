import traverse from 'traverse';
import stringify from 'json-stringify-safe';
import micromatch from 'micromatch';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { gcpDetector } from '@opentelemetry/resource-detector-gcp';
import { alibabaCloudEcsDetector } from '@opentelemetry/resource-detector-alibaba-cloud';
import { awsEksDetector, awsEc2Detector } from '@opentelemetry/resource-detector-aws';
import {
  envDetector,
  hostDetector,
  osDetector,
  processDetector,
  ResourceDetector,
} from '@opentelemetry/resources';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import {
  BatchSpanProcessor,
  BufferConfig,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanExporter,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTELMetricsExporterError } from './errors';

const SEP = '/';

/** @description Copies all Reflect metadata keys from the original function to the current function. */
export const copyMetadata = (original: any, current: any): void => {
  Reflect.getMetadataKeys(original).forEach((metadataKey) => {
    Reflect.defineMetadata(
      metadataKey,
      Reflect.getMetadata(metadataKey, original),
      current,
    );
  });
};

/** @description Recursively traverses an object and attempts to parse string values as JSON. */
export function deepJsonParse(data: any) {
  return traverse(data).map(function (value: any) {
    if (typeof value === 'string') {
      try {
        this.update(JSON.parse(value));
      } catch {}
    }
  });
}

/** @description Removes fields from a deep-cloned copy of data that match the given JSON path patterns. */
export function filterByPaths<T>(data: T, root: string, patterns: string[]): T {
  if (data === null || data === undefined) return data;
  const prefix = root + '.';
  const relevant = patterns
    .filter((p) => p.startsWith(prefix))
    .map((p) => p.slice(prefix.length).split('.'));
  if (!relevant.length) return data;
  let clone: any;
  try {
    clone = JSON.parse(JSON.stringify(data));
  } catch {
    return data;
  }
  return traverse(clone).map(function (value: any) {
    if (this.isRoot) return;
    if (
      relevant.some((pattern) =>
        micromatch.isMatch(this.path.join(SEP), pattern.join(SEP)),
      )
    )
      this.remove();
  });
}

const DEFAULT_ATTR_MAX_LENGTH = 2048;

/** @description Reads the span attribute length cap from env, falling back to the default when unset or invalid. */
const readAttrMaxLength = (): number => {
  const limit = parseInt(process.env.OTEL_SPAN_ATTR_MAX_LENGTH ?? '', 10);
  return Number.isNaN(limit) || limit <= 0 ? DEFAULT_ATTR_MAX_LENGTH : limit;
};

/**
 * @description Truncates string attributes longer than max (env OTEL_SPAN_ATTR_MAX_LENGTH, default 2048).
 * Accepts a broad record (not just OTel `Attributes`) so consumers can pass objects with
 * non-primitive values; only string values are truncated, everything else passes through.
 */
export function truncateAttributes<T extends Record<string, unknown>>(
  attributes: T,
  max?: number,
): T {
  const limit = max ?? readAttrMaxLength();
  for (const key in attributes) {
    const value = attributes[key];
    if (typeof value === 'string' && value.length > limit)
      (attributes as Record<string, unknown>)[key] = value.slice(0, limit);
  }
  return attributes;
}

export type SpanProcessorMode = 'batch' | 'simple' | 'console';

export const SPAN_PROCESSOR_MODES: readonly SpanProcessorMode[] = [
  'batch',
  'simple',
  'console',
];

/**
 * @description Resolves the span processor mode from a raw env string (OTEL_SPAN_PROCESSOR),
 * normalising case and surrounding whitespace; unknown/empty values fall back to 'batch'.
 */
export function resolveSpanProcessorMode(raw?: string): SpanProcessorMode {
  const mode = raw?.trim().toLowerCase() as SpanProcessorMode | undefined;
  return mode && SPAN_PROCESSOR_MODES.includes(mode) ? mode : 'batch';
}

/** @description Serializes data for a span attribute, applying exclude patterns if provided. */
export function attrStringify(attr: string, data: unknown, exclude?: string[]) {
  if (!exclude) return stringify(data);
  if (exclude.includes(attr)) return;
  return stringify(filterByPaths(data, attr, exclude));
}

// Batch processor tuning; unset/invalid env values fall back to OpenTelemetry defaults.
const intFromEnv = (name: string, fallback: number): number => {
  const value = parseInt(process.env[name] ?? '', 10);
  return Number.isNaN(value) ? fallback : value;
};

export const bspConfig: BufferConfig = {
  scheduledDelayMillis: intFromEnv('OTEL_BSP_SCHEDULE_DELAY', 5000),
  maxQueueSize: intFromEnv('OTEL_BSP_MAX_QUEUE_SIZE', 2048),
  maxExportBatchSize: intFromEnv('OTEL_BSP_MAX_EXPORT_BATCH_SIZE', 512),
  exportTimeoutMillis: intFromEnv('OTEL_BSP_EXPORT_TIMEOUT', 30000),
};

export function getMetricReader() {
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

export const resources = {
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

export const resourceDetectors: ResourceDetector[] = [];
for (const field in resources)
  if (!otelExcludeDetectors.includes(field))
    resourceDetectors.push(resources[<keyof typeof resources>field]);

export const exporter = new OTLPTraceExporter();

export const spanProcessorFactories: Record<
  SpanProcessorMode,
  (e: SpanExporter) => SpanProcessor
> = {
  batch: (e) => new BatchSpanProcessor(e, bspConfig),
  simple: (e) => new SimpleSpanProcessor(e),
  // console mode ignores the OTLP exporter and prints spans to stdout (debug).
  console: () => new SimpleSpanProcessor(new ConsoleSpanExporter()),
};
