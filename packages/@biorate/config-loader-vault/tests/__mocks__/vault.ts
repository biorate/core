import { init } from '@biorate/inversion';
import { VaultConnector as VaultConnectorBase } from '@biorate/vault';
import { root, data } from './';

export class VaultConnector extends VaultConnectorBase {
  @init() protected async initialize() {
    await super.initialize();
    await this.current!.write('secret/data/config.json', {
      data: data.config,
    });
    await this.current!.write('secret/data/files.json', {
      data: data.files,
    });
  }
}
