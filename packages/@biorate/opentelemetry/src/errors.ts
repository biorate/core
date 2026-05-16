import { BaseError } from '@biorate/errors';

/** @description Error thrown when OTEL_METRICS_EXPORTER env variable has no valid option. */
export class OTELMetricsExporterError extends BaseError {
  public constructor() {
    super(`No valid option for OTEL_METRICS_EXPORTER: %s`, [
      process.env.OTEL_METRICS_EXPORTER,
    ]);
  }
}

/** @description Error thrown when a tracer is undefined for a class not decorated with @scope(). */
export class OTELUndefinedTracerError extends BaseError {
  public constructor(classname: string) {
    super(
      `Undefined tracer for class [%s], make sure you decorate class by @scope() decorator`,
      [classname],
    );
  }
}
