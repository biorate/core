import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Probe')
@Controller('probe')
export class ProbeController {
  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe' })
  protected readiness() {
    return 1;
  }

  @Get('healthz')
  @ApiOperation({ summary: 'Healthz probe' })
  protected healthz() {
    return 1;
  }
}
