import { BaseError } from '@biorate/errors';

export class OTELMetricsExporterError extends BaseError {
  public constructor() {
    super(`No valid option for OTEL_METRICS_EXPORTER: %s`, [
      process.env.OTEL_METRICS_EXPORTER,
    ]);
  }
}

export class OTELUndefinedTracerError extends BaseError {
  public constructor(classname: string) {
    super(
      `Undefined tracer for class [%s], make sure you decorate class by @scope() decorator`,
      [classname],
    );
  }
}
