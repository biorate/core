import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { ClientProviderPort } from '../../ports';

@Injectable()
export class SetLocaleUseCase {
  @Inject(Types.ClientProviderPort)
  protected readonly clientProvider: ClientProviderPort;

  public async execute(data: Record<string, string>, lang: string, namespace: string) {
    return this.clientProvider.setLang(data, lang, namespace);
  }
}
