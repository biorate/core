import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { path } from '@biorate/tools';
import { promises as fs, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { merge } from 'lodash';
import { GetLocalesDTO, PostLocalesDTO } from '../dto';

@ApiTags('Locales')
@Controller('locales')
export class LocalesController {
  protected static async getFile(namespace: string, lang: string) {
    try {
      return JSON.parse(
        await fs.readFile(
          path.create(process.cwd(), 'locales', namespace, `${lang}.json`),
          'utf-8',
        ),
      );
    } catch {
      return {};
    }
  }

  protected static getFileSync(namespace: string, lang: string) {
    try {
      return JSON.parse(
        readFileSync(
          path.create(process.cwd(), 'locales', namespace, `${lang}.json`),
          'utf-8',
        ),
      );
    } catch {
      return {};
    }
  }

  protected static putFile(
    namespace: string,
    lang: string,
    data: Record<string, string>,
  ) {
    try {
      const directory = path.create(process.cwd(), 'locales', namespace);
      mkdirSync(directory, { recursive: true });
      writeFileSync(
        path.create(directory, `${lang}.json`),
        JSON.stringify(data, null, '  '),
        'utf-8',
      );
    } catch (e) {
      console.warn(e);
    }
  }

  @Get(':lang/:namespace')
  @ApiOperation({ summary: 'Get locales' })
  protected get(@Param() param: GetLocalesDTO) {
    return LocalesController.getFile(param.namespace, param.lang);
  }

  @Post(':lang/:namespace')
  @ApiOperation({ summary: 'Put locales' })
  protected async post(
    @Param() param: PostLocalesDTO,
    @Body() body: Record<string, string>,
  ) {
    const data = LocalesController.getFileSync(param.namespace, param.lang);
    const result = merge(data, body);
    LocalesController.putFile(param.namespace, param.lang, result);
  }
}
