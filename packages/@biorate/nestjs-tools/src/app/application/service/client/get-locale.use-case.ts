import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { ClientProviderPort } from '../../ports';

@Injectable()
export class GetLocaleUseCase {
  @Inject(Types.ClientProviderPort)
  protected readonly clientProvider: ClientProviderPort;

  public async execute(lang: string, namespace: string) {
    return this.clientProvider.getLang(lang, namespace);
  }
}
