import { ILoader } from '@biorate/config-loader';
import { IConfig } from '@biorate/config';

declare module '@biorate/config-loader-fs' {
  export class ConfigLoaderFs implements ILoader {
    /**
     * @description Process
     */
    public process(config: IConfig): Promise<void>;
  }
}
