import { inject, Types } from '@biorate/inversion';
import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPrometheus } from '@biorate/prometheus';

/**
 * @description Deprecated metrics controller. Use domain controller instead.
 * @deprecated Use domain controller instead [@biorate/nestjs-tools >= v1.121.0]
 */
@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @inject(Types.Prometheus) protected prometheus: IPrometheus;

  @Get()
  @Header('content-type', 'text/plain')
  @Header(
    'Deprecation',
    'Use domain controller instead [@biorate/nestjs-tools >= v1.121.0]',
  )
  @ApiOperation({ summary: 'Prometheus metrics hook', deprecated: true })
  protected async metrics() {
    return this.prometheus.registry.metrics();
  }
}
