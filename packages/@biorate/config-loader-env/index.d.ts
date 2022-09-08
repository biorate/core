import { ConfigLoader } from '@biorate/config-loader';

declare module '@biorate/config-loader-env' {
  export class ConfigLoaderEnv extends ConfigLoader {
    /**
     * @description Initialize
     */
    protected initialize(): Promise<void>;
  }
}
