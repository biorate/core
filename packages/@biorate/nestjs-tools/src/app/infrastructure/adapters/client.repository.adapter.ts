import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { path } from '@biorate/tools';
import { ClientDrivenPort } from '../../application';

@Injectable()
export class ClientRepositoryAdapter implements ClientDrivenPort {
  public getLang(lang: string, namespace: string) {
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

  public setLang(data: Record<string, string>, lang: string, namespace: string) {
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
}
