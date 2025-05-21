import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Probe')
@Controller('probe')
export class ProbeController {
  @Get('readiness')
  @Header(
    'Deprecation',
    'Use domain controller instead [@biorate/nestjs-tools >= v1.121.0]',
  )
  @ApiOperation({ summary: 'Readiness probe', deprecated: true })
  protected readiness() {
    return 1;
  }

  @Get('healthz')
  @Header(
    'Deprecation',
    'Use domain controller instead [@biorate/nestjs-tools >= v1.121.0]',
  )
  @ApiOperation({ summary: 'Healthz probe', deprecated: true })
  protected healthz() {
    return 1;
  }
}
