import { IConfig } from '@biorate/config';

declare module '@biorate/config-loader' {
  export abstract class ConfigLoader {
    /**
     * @description Config dependency
     */
    protected readonly config: IConfig;
    /**
     * @description Initialize
     */
    protected abstract initialize(): Promise<void> | void;
  }
}
