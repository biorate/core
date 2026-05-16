import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { ClientDrivenPort } from '../../ports';

/**
 * @description Use case for persisting locale data.
 */
@Injectable()
export class SetLocaleUseCase {
  @Inject(Types.ClientDrivenPort)
  protected readonly clientProvider: ClientDrivenPort;

  public async execute(data: Record<string, string>, lang: string, namespace: string) {
    return this.clientProvider.setLang(data, lang, namespace);
  }
}
