import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { MetricsDrivenPort } from '../../ports';

/**
 * @description Use case for retrieving Prometheus metrics.
 */
@Injectable()
export class GetMetricsUseCase {
  @Inject(Types.MetricsDrivenPort)
  protected readonly metricsProvider: MetricsDrivenPort;

  public async execute() {
    return this.metricsProvider.get();
  }
}
