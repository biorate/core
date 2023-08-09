import { inject, Types } from '@biorate/inversion';
import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPrometheus } from '@biorate/prometheus';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @inject(Types.Prometheus) protected prometheus: IPrometheus;

  @Get()
  @Header('content-type', 'text/plain')
  @ApiOperation({ summary: 'Prometheus metrics hook' })
  protected async metrics() {
    return this.prometheus.registry.metrics();
  }
}
