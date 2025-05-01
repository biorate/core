import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { MetricsProviderPort } from '../../ports/output';

@Injectable()
export class GetMetricsUseCase {
  @Inject(Types.MetricsProviderPort)
  protected readonly metricsProvider: MetricsProviderPort;

  public async execute() {
    return this.metricsProvider.get();
  }
}
