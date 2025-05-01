import { Injectable } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IPrometheus } from '@biorate/prometheus';
import { MetricsProviderPort } from '../../application/ports/output';

@Injectable()
export class MetricsRepositoryAdapter implements MetricsProviderPort {
  @inject(Types.Prometheus) protected prometheus: IPrometheus;

  public get() {
    return this.prometheus.registry.metrics();
  }
}
