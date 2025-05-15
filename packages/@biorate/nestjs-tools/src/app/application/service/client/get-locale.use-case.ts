import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { ClientDrivenPort } from '../../ports';

@Injectable()
export class GetLocaleUseCase {
  @Inject(Types.ClientDrivenPort)
  protected readonly clientProvider: ClientDrivenPort;

  public async execute(lang: string, namespace: string) {
    return this.clientProvider.getLang(lang, namespace);
  }
}
