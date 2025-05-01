import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMetricsUseCase } from '../../application/service/metrics';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  public constructor(private readonly getMetrics: GetMetricsUseCase) {}

  @Get()
  @Header('content-type', 'text/plain')
  @ApiOperation({ summary: 'Prometheus metrics hook' })
  protected async metrics() {
    return this.getMetrics.execute();
  }
}
