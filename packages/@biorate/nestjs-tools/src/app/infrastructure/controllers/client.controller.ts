import { Controller, Get, Post, Param, Body, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLocaleUseCase, SetLocaleUseCase } from '../../application';
import { GetLocalesDTO, PostLocalesDTO } from './dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  public constructor(
    protected readonly getLoc: GetLocaleUseCase,
    protected readonly setLoc: SetLocaleUseCase,
  ) {}

  @Get('locale/:lang/:namespace')
  @ApiOperation({ summary: 'Get locale' })
  protected getLocale(@Param() param: GetLocalesDTO) {
    return this.getLoc.execute(param.lang, param.namespace);
  }

  @Post('locale/:lang/:namespace')
  @ApiOperation({ summary: 'Put locale' })
  protected async postLocale(
    @Param() param: PostLocalesDTO,
    @Body() body: Record<string, string>,
  ) {
    return this.setLoc.execute(body, param.lang, param.namespace);
  }
}
