import { Controller, Get, Post, Param, Body, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLangUseCase, SetLangUseCase } from '../../application/service/client';
import { GetLocalesDTO, PostLocalesDTO } from './dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  public constructor(
    private readonly getLang: GetLangUseCase,
    private readonly setLang: SetLangUseCase,
  ) {}

  @Get('locale/:lang/:namespace')
  @ApiOperation({ summary: 'Get locale' })
  protected get(@Param() param: GetLocalesDTO) {
    return this.getLang.execute(param.lang, param.namespace);
  }

  @Post('locale/:lang/:namespace')
  @ApiOperation({ summary: 'Put locale' })
  protected async post(
    @Param() param: PostLocalesDTO,
    @Body() body: Record<string, string>,
  ) {
    return this.setLang.execute(body, param.lang, param.namespace);
  }
}
