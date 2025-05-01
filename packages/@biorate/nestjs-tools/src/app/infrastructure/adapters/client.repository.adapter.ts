import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { path } from '@biorate/tools';
import { ClientProviderPort } from '../../application/ports/output';

@Injectable()
export class ClientRepositoryAdapter implements ClientProviderPort {
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
