import { Injectable } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IPrometheus } from '@biorate/prometheus';
import { MetricsDrivenPort } from '../../application';

@Injectable()
export class MetricsRepositoryAdapter implements MetricsDrivenPort {
  @inject(Types.Prometheus) protected prometheus: IPrometheus;

  public get() {
    return this.prometheus.registry.metrics();
  }
}
